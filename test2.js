(function(){
  'use strict';

  try {
    /* ===== Минимальная интеграция KP API ===== */
    if(!Lampa.Api.sources.KP){
      var network = new Lampa.Reguest();
      var cache = {};
      var total_cnt = 0;
      var proxy_cnt = 0;
      var good_cnt = 0;
      var SOURCE_NAME = 'KP';
      var SOURCE_TITLE = 'KP';

      function startsWith(str, searchString) {
        return str.lastIndexOf(searchString, 0) === 0;
      }

      function getCache(key){
        var res = cache[key];
        if(res){
          var cache_timestamp = new Date().getTime() - (1000 * 60 * 60); // 1 час
          if(res.timestamp > cache_timestamp) return res.value;
        }
        return null;
      }
      function setCache(key, value){
        cache[key] = { timestamp: new Date().getTime(), value: value };
      }
      function get(method, oncomplite, onerror){
        var url = 'https://kinopoiskapiunofficial.tech/' + method;
        console.log('KP API (get): Отправка запроса по URL:', url);
        network.timeout(15000);
        network.silent(url, function(json){
          console.log('KP API (get): Получен ответ:', json);
          oncomplite(json);
        }, function(err){
          console.error('KP API (get): Ошибка запроса:', err);
          onerror(err);
        }, false, {
          headers: { 'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616' }
        });
      }
      function getFromCache(method, oncomplite, onerror){
        var json = getCache(method);
        if(json){
          setTimeout(function(){ oncomplite(json, true); }, 10);
        } else {
          get(method, oncomplite, onerror);
        }
      }
      // Преобразование элемента из KP API в формат Lampa
      function convertElem(elem) {
        var kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
        var title = elem.nameRu || elem.nameEn || elem.nameOriginal || 'undefined';
        var img = elem.posterUrlPreview || elem.posterUrl || '';
        return {
          source: SOURCE_NAME,
          id: SOURCE_NAME + '_' + kinopoisk_id,
          title: title,
          original_title: title,
          overview: elem.description || elem.shortDescription || '',
          img: img,
          background_image: elem.coverUrl || img,
          vote_average: parseFloat(elem.rating) || 0,
          vote_count: elem.ratingVoteCount || 0,
          kinopoisk_id: kinopoisk_id,
          type: (elem.type === 'TV_SHOW' || elem.type === 'TV_SERIES') ? 'tv' : 'movie'
        };
      }
      // Функция для загрузки списка элементов по категории
      function getList(method, params, oncomplite, onerror){
        var page = params.page || 1;
        var url = method + '&page=' + page;
        getFromCache(url, function(json, cached){
          if(!cached && json && json.items && json.items.length) setCache(url, json);
          var items = json.items || [];
          var results = items.map(function(elem){
            return convertElem(elem);
          });
          var total_pages = json.pagesCount || json.totalPages || 1;
          oncomplite({ results: results, page: page, total_pages: total_pages });
        }, onerror);
      }
      // Функция для загрузки детальной информации по ID
      function getById(id, oncomplite, onerror){
        var url = 'api/v2.2/films/' + id;
        console.log('KP API (getById): Отправка запроса по URL:', url);
        getFromCache(url, function(json, cached){
          if(json && json.kinopoiskId){
            var result = convertElem(json);
            console.log('KP API (getById): Получены данные для id', id, result);
            oncomplite(result);
          } else {
            console.error('KP API (getById): Нет данных для id', id);
            onerror();
          }
        }, onerror);
      }
      
      // Функция для последовательных вызовов (из исходного кода)
      function getComplite(method, oncomplite) {
        get(method, oncomplite, function () {
          oncomplite(null);
        });
      }
      function getCompliteIf(condition, method, oncomplite) {
        if (condition) getComplite(method, oncomplite); else {
          setTimeout(function () {
            oncomplite(null);
          }, 10);
        }
      }
      // Функция _getById для загрузки расширенной информации карточки
      function _getById(id, params, oncomplite, onerror) {
        var url = 'api/v2.2/films/' + id;
        var film = getCache(url);
        if (film) {
          setTimeout(function () {
            oncomplite(convertElem(film));
          }, 10);
        } else {
          get(url, function (film) {
            if (film.kinopoiskId) {
              var type = !film.type || film.type === 'FILM' || film.type === 'VIDEO' ? 'movie' : 'tv';
              getCompliteIf(type == 'tv', 'api/v2.2/films/' + id + '/seasons', function (seasons) {
                film.seasons_obj = seasons;
                getComplite('api/v2.2/films/' + id + '/distributions', function (distributions) {
                  film.distributions_obj = distributions;
                  getComplite('/api/v1/staff?filmId=' + id, function (staff) {
                    film.staff_obj = staff;
                    // Запрашиваем похожие фильмы вместо sequels_and_prequels (404)
                    getComplite('api/v2.2/films/' + id + '/similars', function (similars) {
                      film.similars_obj = similars;
                      setCache(url, film);
                      oncomplite(convertElem(film));
                    });
                  });
                });
              });
            } else onerror();
          }, onerror);
        }
      }
      // Метод full – получает полную карточку с дополнительными данными
      function full() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;
        var kinopoisk_id = '';

        if (params.card && params.card.source === SOURCE_NAME) {
          if (params.card.kinopoisk_id) {
            kinopoisk_id = params.card.kinopoisk_id;
          } else if (startsWith(params.card.id + '', SOURCE_NAME + '_')) {
            kinopoisk_id = (params.card.id + '').substring(SOURCE_NAME.length + 1);
            params.card.kinopoisk_id = kinopoisk_id;
          }
        }

        if (kinopoisk_id) {
          _getById(kinopoisk_id, params, function (json) {
            var status = new Lampa.Status(4);
            status.onComplite = oncomplite;
            status.append('movie', json);
            status.append('persons', json && json.persons);
            status.append('collection', json && json.collection);
            status.append('simular', json && json.similars_obj);
          }, onerror);
        } else onerror();
      }

      var KP = {
        SOURCE_NAME: SOURCE_NAME,
        list: function(params, oncomplite, onerror){
          getList(params.url, params, oncomplite, onerror);
        },
        full: full,
        // Остальные методы (menu, category, person, discovery, seasons, menuCategory) можно добавить при необходимости
      };
      Lampa.Api.sources.KP = KP;
      console.log('KP API интегрирован');
    }
    /* ===== Конец интеграции KP API ===== */

    // Сохраняем исходный источник для последующего восстановления
    var originalSource = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ?
                           Object.assign({}, Lampa.Params.values.source) : { tmdb: 'TMDB' };
    console.log('Исходный источник сохранён:', originalSource);

    // Функция для получения ID страны "Россия" через фильтры KP API
    var rus_id = '225';
    function loadCountryId(callback){
      try {
        get('api/v2.2/films/filters', function(json){
          if(json && json.countries){
            json.countries.forEach(function(c){
              if(c.country.toLowerCase() === 'россия'){
                rus_id = c.id;
              }
            });
          }
          console.log('ID России:', rus_id);
          if(callback) callback();
        }, function(){
          console.error('Не удалось загрузить фильтры для определения страны');
          if(callback) callback();
        });
      } catch(e){
        console.error('Ошибка в loadCountryId:', e);
        if(callback) callback();
      }
    }

    /* ===== Добавление кнопки "Кинопоиск" в меню ===== */
    function addKPButton(){
      var menu = Lampa.Menu.render();
      if(!menu || !menu.length){
        console.error('Меню не найдено, повторная попытка через 2 секунды');
        setTimeout(addKPButton, 2000);
        return;
      }
      console.log('Меню найдено, добавляем кнопку Кинопоиск');

      var kpButton = $(`
          <li class="menu__item selector" data-action="kp">
            <div class="menu__ico">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
                <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="menu__text">Кинопоиск</div>
          </li>
      `);

      kpButton.on('click', function(){
        console.log('Нажата кнопка Кинопоиск');
        loadCountryId(function(){
          if(typeof Lampa.Select !== 'undefined' && typeof Lampa.Select.show === 'function'){
            Lampa.Select.show({
              title: 'Кинопоиск',
              items: [
                { title: 'Популярные Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_100_POPULAR_FILMS' } },
                { title: 'Топ Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS' } },
                { title: 'Российские Фильмы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=FILM&countries=' + rus_id } },
                { title: 'Российские Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES&countries=' + rus_id } },
                { title: 'Популярные Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES' } },
                { title: 'Популярные Телешоу', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW' } }
              ],
              onSelect: function(item){
                console.log('Выбран пункт:', item);
                Lampa.Activity.push({
                  url: item.data.url,
                  title: item.title,
                  component: 'category_full',
                  source: 'KP',
                  card_type: true,
                  page: 1,
                  onBack: function(){
                    if(originalSource){
                      Lampa.Params.select('source', originalSource);
                    }
                    Lampa.Controller.toggle("menu");
                  }
                });
              },
              onBack: function(){
                if(originalSource){
                  Lampa.Params.select('source', originalSource);
                }
                Lampa.Controller.toggle("menu");
              }
            });
            console.log('Окно выбора категорий открыто');
          } else {
            console.error('Lampa.Select.show недоступен');
          }
        });
      });

      var tvItem = menu.find('[data-action="tv"]');
      if(tvItem.length){
        tvItem.after(kpButton);
        console.log('Кнопка Кинопоиск добавлена после элемента TV');
      } else {
        menu.append(kpButton);
        console.log('Кнопка Кинопоиск добавлена в конец меню');
      }
    }

    Lampa.Listener.follow('app', function(e){
      if(e.type === 'ready'){
        addKPButton();
      }
    });
    
  } catch(ex) {
    console.error('Script error:', ex);
  }
})();
