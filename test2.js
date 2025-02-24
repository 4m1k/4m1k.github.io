(function(){
  'use strict';

  /* ===== Минимальная интеграция KP API ===== */
  if(!Lampa.Api.sources.KP){
    var network = new Lampa.Reguest();
    var cache = {};
    
    function getCache(key) {
      var res = cache[key];
      if(res){
        var cache_timestamp = new Date().getTime() - 1000 * 60 * 60;
        if(res.timestamp > cache_timestamp) return res.value;
      }
      return null;
    }
    function setCache(key, value){
      cache[key] = { timestamp: new Date().getTime(), value: value };
    }
    function get(method, oncomplite, onerror){
      var url = 'https://kinopoiskapiunofficial.tech/' + method;
      network.timeout(15000);
      network.silent(url, function(json){
         oncomplite(json);
      }, onerror, false, {
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
    function getList(method, params, oncomplite, onerror){
      var page = params.page || 1;
      var url = method;
      url += '&page=' + page;
      getFromCache(url, function(json, cached){
         if(!cached && json && json.items && json.items.length) setCache(url, json);
         var results = json.items || [];
         var total_pages = json.pagesCount || json.totalPages || 1;
         oncomplite({ results: results, page: page, total_pages: total_pages });
      }, onerror);
    }
    
    var KP = {
      SOURCE_NAME: 'KP',
      // Для демонстрации реализуем только метод list – который используется компонентом category_full.
      list: function(params, oncomplite, onerror){
         getList(params.url, params, oncomplite, onerror);
      }
      // Дополнительные методы (main, full, discovery и т.д.) можно добавить при необходимости.
    };
    Lampa.Api.sources.KP = KP;
  }
  
  /* ===== Конец интеграции KP API ===== */
  
  // Сохраняем исходный источник из настроек Лампы для последующего восстановления
  var originalSource = null;
  if(Lampa.Params && Lampa.Params.values && Lampa.Params.values.source){
    originalSource = Object.assign({}, Lampa.Params.values.source);
  } else {
    originalSource = { tmdb: 'TMDB' };
  }
  console.log('Исходный источник сохранён:', originalSource);
  
  /* ===== Добавление кнопки "Кинопоиск" в меню ===== */
  Lampa.Listener.follow('app', function(e){
    if(e.type === 'ready'){
      var menu = Lampa.Menu.render();
      if(!menu || !menu.length){
        console.error('Меню не найдено');
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
      
      // При нажатии открываем окно с категориями
      kpButton.on('click', function(){
        console.log('Нажата кнопка Кинопоиск');
        if(typeof Lampa.Select !== 'undefined' && typeof Lampa.Select.show === 'function'){
          Lampa.Select.show({
            title: 'Кинопоиск',
            items: [
              { title: 'Топ Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS' } },
              { title: 'Популярные Фильмы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=FILM' } },
              { title: 'Российские Фильмы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=FILM&countries=225' } },
              { title: 'Российские Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES&countries=225' } },
              { title: 'Популярные Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES' } },
              { title: 'Популярные Телешоу', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW' } }
            ],
            onSelect: function(item){
              console.log('Выбран пункт:', item);
              // При выборе категории вызываем Activity.push с источником "KP"
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
      
      // Добавляем кнопку после элемента с data-action="tv", если он найден, иначе в конец меню
      var tvItem = menu.find('[data-action="tv"]');
      if(tvItem.length){
        tvItem.after(kpButton);
        console.log('Кнопка Кинопоиск добавлена после элемента TV');
      } else {
        menu.append(kpButton);
        console.log('Кнопка Кинопоиск добавлена в конец меню');
      }
    }
  });
})();
