(function(){
  'use strict';
  // Предотвращаем повторное выполнение плагина
  if(window.KPPluginLoaded) return;
  window.KPPluginLoaded = true;

  try {
    /* ===== Минимальная интеграция KP API ===== */
    if (!Lampa.Api.sources.KP) {
      var network = new Lampa.Reguest();
      var cache = {};
      var total_cnt = 0;
      var proxy_cnt = 0;
      var good_cnt = 0;
      var menu_list = [];
      var genres_map = {};
      var countries_map = {};
      var CACHE_SIZE = 100;
      var CACHE_TIME = 1000 * 60 * 60;
      var SOURCE_NAME = 'KP';
      var SOURCE_TITLE = 'KP';

      function startsWith(str, searchString) {
        return str.lastIndexOf(searchString, 0) === 0;
      }

      function get(method, oncomplite, onerror) {
        var use_proxy = total_cnt >= 10 && good_cnt > total_cnt / 2;
        if (!use_proxy) total_cnt++;
        var kp_prox = 'https://cors.kp556.workers.dev:8443/';
        var url = 'https://kinopoiskapiunofficial.tech/' + method;
        console.log('KP API (get): Отправка запроса по URL:', url);
        network.timeout(15000);
        network.silent((use_proxy ? kp_prox : '') + url, function(json) {
          console.log('KP API (get): Получен ответ:', json);
          oncomplite(json);
        }, function(a, c) {
          use_proxy = !use_proxy && (proxy_cnt < 10 || good_cnt > proxy_cnt / 2);
          if (use_proxy && (a.status == 429 || (a.status == 0 && a.statusText !== 'timeout'))) {
            proxy_cnt++;
            network.timeout(15000);
            network.silent(kp_prox + url, function(json) {
              good_cnt++;
              oncomplite(json);
            }, onerror, false, {
              headers: { 'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616' }
            });
          } else onerror(a, c);
        }, false, {
          headers: { 'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616' }
        });
      }

      function getComplite(method, oncomplite) {
        get(method, oncomplite, function () {
          oncomplite(null);
        });
      }

      function getCompliteIf(condition, method, oncomplite) {
        if (condition) {
          getComplite(method, oncomplite);
        } else {
          setTimeout(function () {
            oncomplite(null);
          }, 10);
        }
      }

      function getCache(key) {
        var res = cache[key];
        if (res) {
          var cache_timestamp = new Date().getTime() - CACHE_TIME;
          if (res.timestamp > cache_timestamp) return res.value;
          for (var ID in cache) {
            var node = cache[ID];
            if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
          }
        }
        return null;
      }

      function setCache(key, value) {
        var timestamp = new Date().getTime();
        var size = Object.keys(cache).length;
        if (size >= CACHE_SIZE) {
          var cache_timestamp = timestamp - CACHE_TIME;
          for (var ID in cache) {
            var node = cache[ID];
            if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
          }
          size = Object.keys(cache).length;
          if (size >= CACHE_SIZE) {
            var timestamps = [];
            for (var _ID in cache) {
              var _node = cache[_ID];
              timestamps.push(_node && _node.timestamp || 0);
            }
            timestamps.sort(function(a, b){ return a - b; });
            cache_timestamp = timestamps[Math.floor(timestamps.length / 2)];
            for (var _ID2 in cache) {
              var _node2 = cache[_ID2];
              if (!(_node2 && _node2.timestamp > cache_timestamp)) delete cache[_ID2];
            }
          }
        }
        cache[key] = { timestamp: timestamp, value: value };
      }

      function getFromCache(method, oncomplite, onerror) {
        console.log('getFromCache вызвана с аргументом:', method);
        var json = getCache(method);
        if (json) {
          setTimeout(function () { oncomplite(json, true); }, 10);
        } else {
          get(method, oncomplite, onerror);
        }
      }

      function clear() {
        network.clear();
      }

      function convertElem(elem) {
        var type = !elem.type || elem.type === 'FILM' || elem.type === 'VIDEO' ? 'movie' : 'tv';
        var kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
        var kp_rating = +elem.rating || +elem.ratingKinopoisk || 0;
        var title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
        var original_title = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
        var adult = false;
        var result = {
          "source": SOURCE_NAME,
          "type": type,
          "adult": false,
          "id": SOURCE_NAME + '_' + kinopoisk_id,
          "title": title,
          "original_title": original_title,
          "overview": elem.description || elem.shortDescription || '',
          "img": elem.posterUrlPreview || elem.posterUrl || '',
          "background_image": elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
          "genres": elem.genres && elem.genres.map(function(e) {
            if(e.genre === 'для взрослых') {
              adult = true;
            }
            return { "id": e.genre && genres_map[e.genre] || 0, "name": e.genre, "url": '' };
          }) || [],
          "production_companies": [],
          "production_countries": elem.countries && elem.countries.map(function(e) {
            return { "name": e.country };
          }) || [],
          "vote_average": kp_rating,
          "vote_count": elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
          "kinopoisk_id": kinopoisk_id,
          "kp_rating": kp_rating,
          "imdb_id": elem.imdbId || '',
          "imdb_rating": elem.ratingImdb || 0
        };
        result.adult = adult;
        var first_air_date = elem.year && elem.year !== 'null' ? elem.year : '';
        var last_air_date = '';

        if (type === 'tv') {
          if (elem.startYear && elem.startYear !== 'null') first_air_date = elem.startYear;
          if (elem.endYear && elem.endYear !== 'null') last_air_date = elem.endYear;
        }

        if (elem.distributions_obj) {
          var distributions = elem.distributions_obj.items || [];
          var year_timestamp = Date.parse(first_air_date);
          var min = null;
          distributions.forEach(function(d) {
            if(d.date && (d.type === 'WORLD_PREMIER' || d.type === 'ALL')) {
              var timestamp = Date.parse(d.date);
              if(!isNaN(timestamp) && (min == null || timestamp < min) && (isNaN(year_timestamp) || timestamp >= year_timestamp)) {
                min = timestamp;
                first_air_date = d.date;
              }
            }
          });
        }

        if (type === 'tv') {
          result.name = title;
          result.original_name = original_title;
          result.first_air_date = first_air_date;
          if(last_air_date) result.last_air_date = last_air_date;
        } else {
          result.release_date = first_air_date;
        }

        if (elem.seasons_obj) {
          var _seasons = elem.seasons_obj.items || [];
          result.number_of_seasons = elem.seasons_obj.total || _seasons.length || 1;
          result.seasons = _seasons.map(function(s){
            return convertSeason(s);
          });
          var number_of_episodes = 0;
          result.seasons.forEach(function(s){
            number_of_episodes += s.episode_count;
          });
          result.number_of_episodes = number_of_episodes;
        }

        if (elem.staff_obj) {
          var staff = elem.staff_obj || [];
          var cast = [];
          var crew = [];
          staff.forEach(function(s){
            var person = convertPerson(s);
            if(s.professionKey === 'ACTOR') cast.push(person); else crew.push(person);
          });
          result.persons = { "cast": cast, "crew": crew };
        }

        if (elem.sequels_obj) {
          var sequels = elem.sequels_obj || [];
          result.collection = {
            "results": sequels.map(function(s){
              return convertElem(s);
            })
          };
        }

        if (elem.similars_obj) {
          var similars = elem.similars_obj.items || [];
          result.simular = {
            "results": similars.map(function(s){
              return convertElem(s);
            })
          };
        }

        return result;
      }

      function convertSeason(season) {
        var episodes = season.episodes || [];
        episodes = episodes.map(function(e){
          return {
            "season_number": e.seasonNumber,
            "episode_number": e.episodeNumber,
            "name": e.nameRu || e.nameEn || 'S' + e.seasonNumber + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + e.episodeNumber,
            "overview": e.synopsis || '',
            "air_date": e.releaseDate
          };
        });
        return {
          "season_number": season.number,
          "episode_count": episodes.length,
          "episodes": episodes,
          "name": Lampa.Lang.translate('torrent_serial_season') + ' ' + season.number,
          "overview": ''
        };
      }

      function convertPerson(person) {
        return {
          "id": person.staffId,
          "name": person.nameRu || person.nameEn || '',
          "url": '',
          "img": person.posterUrl || '',
          "character": person.description || '',
          "job": Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
        };
      }

      function getList(method, params, oncomplite, onerror) {
        var page = params.page || 1;
        var url = Lampa.Utils.addUrlComponent(method, 'page=' + page);
        getFromCache(url, function(json, cached) {
          var items = [];
          if (json.items && json.items.length) items = json.items;
          else if (json.films && json.films.length) items = json.films;
          else if (json.releases && json.releases.length) items = json.releases;
          if (!cached && items.length) setCache(url, json);
          var results = items.map(function(elem){
            return convertElem(elem);
          });
          results = results.filter(function(elem) { return !elem.adult; });
          var total_pages = json.pagesCount || json.totalPages || 1;
          var res = {
            "results": results,
            "url": method,
            "page": page,
            "total_pages": total_pages,
            "total_results": 0,
            "more": total_pages > page
          };
          oncomplite(res);
        }, onerror);
      }

      function _getById(id, params, oncomplite, onerror) {
        var url = 'api/v2.2/films/' + id;
        var film = getCache(url);
        if (film) {
          setTimeout(function () { oncomplite(convertElem(film)); }, 10);
        } else {
          get(url, function(film) {
            if (film.kinopoiskId) {
              var type = !film.type || film.type === 'FILM' || film.type === 'VIDEO' ? 'movie' : 'tv';
              getCompliteIf(type == 'tv', 'api/v2.2/films/' + id + '/seasons', function(seasons) {
                film.seasons_obj = seasons;
                getComplite('api/v2.2/films/' + id + '/distributions', function(distributions) {
                  film.distributions_obj = distributions;
                  getComplite('/api/v1/staff?filmId=' + id, function(staff) {
                    film.staff_obj = staff;
                    // Вместо запроса sequels_and_prequels (возвращавшего 404) сразу запрашиваем similars:
                    getComplite('api/v2.2/films/' + id + '/similars', function(similars) {
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
          _getById(kinopoisk_id, params, function(json) {
            var status = new Lampa.Status(4);
            status.onComplite = oncomplite;
            status.append('movie', json);
            status.append('persons', json && json.persons);
            status.append('collection', json && json.collection);
            status.append('simular', json && json.similars_obj);
          }, onerror);
        } else onerror();
      }

      function list() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;
        var method = params.url;
        if (method === '' && params.genres) {
          method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
        }
        getList(method, params, oncomplite, onerror);
      }

      function search() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var title = decodeURIComponent(params.query || '');
        var status = new Lampa.Status(1);
        status.onComplite = function(data) {
          var items = [];
          if (data.query && data.query.results) {
            var tmp = data.query.results.filter(function(elem) {
              return containsTitle(elem.title, title) || containsTitle(elem.original_title, title);
            });
            if (tmp.length && tmp.length !== data.query.results.length) {
              data.query.results = tmp;
              data.query.more = true;
            }
            var movie = Object.assign({}, data.query);
            movie.results = data.query.results.filter(function(elem) {
              return elem.type === 'movie';
            });
            movie.title = Lampa.Lang.translate('menu_movies');
            movie.type = 'movie';
            if (movie.results.length) items.push(movie);
            var tv = Object.assign({}, data.query);
            tv.results = data.query.results.filter(function(elem) {
              return elem.type === 'tv';
            });
            tv.title = Lampa.Lang.translate('menu_tv');
            tv.type = 'tv';
            if (tv.results.length) items.push(tv);
          }
          oncomplite(items);
        };

        getList('api/v2.1/films/search-by-keyword', params, function(json) {
          status.append('query', json);
        }, status.error.bind(status));
      }

      function discovery() {
        return {
          title: SOURCE_TITLE,
          search: search,
          params: {
            align_left: true,
            object: { source: SOURCE_NAME }
          },
          onMore: function onMore(params) {
            Lampa.Activity.push({
              url: 'api/v2.1/films/search-by-keyword',
              title: Lampa.Lang.translate('search') + ' - ' + params.query,
              component: 'category_full',
              page: 1,
              query: encodeURIComponent(params.query),
              source: SOURCE_NAME
            });
          },
          onCancel: network.clear.bind(network)
        };
      }

      function person() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var status = new Lampa.Status(1);
        status.onComplite = function(data) {
          var result = {};
          if (data.query) {
            var p = data.query;
            result.person = {
              "id": p.personId,
              "name": p.nameRu || p.nameEn || '',
              "url": '',
              "img": p.posterUrl || '',
              "gender": p.sex === 'MALE' ? 2 : p.sex === 'FEMALE' ? 1 : 0,
              "birthday": p.birthday,
              "place_of_birth": p.birthplace,
              "deathday": p.death,
              "place_of_death": p.deathplace,
              "known_for_department": p.profession || '',
              "biography": (p.facts || []).join(' ')
            };
            var director_films = [];
            var director_map = {};
            var actor_films = [];
            var actor_map = {};
            if (p.films) {
              p.films.forEach(function(f) {
                if (f.professionKey === 'DIRECTOR' && !director_map[f.filmId]) {
                  director_map[f.filmId] = true;
                  director_films.push(convertElem(f));
                } else if (f.professionKey === 'ACTOR' && !actor_map[f.filmId]) {
                  actor_map[f.filmId] = true;
                  actor_films.push(convertElem(f));
                }
              });
            }
            var knownFor = [];
            if (director_films.length) {
              director_films.sort(function(a, b) {
                var res = b.vote_average - a.vote_average;
                if (res) return res;
                return a.id - b.id;
              });
              knownFor.push({
                "name": Lampa.Lang.translate('title_producer'),
                "credits": director_films
              });
            }
            if (actor_films.length) {
              actor_films.sort(function(a, b) {
                var res = b.vote_average - a.vote_average;
                if (res) return res;
                return a.id - b.id;
              });
              knownFor.push({
                "name": Lampa.Lang.translate(p.sex === 'FEMALE' ? 'title_actress' : 'title_actor'),
                "credits": actor_films
              });
            }
            result.credits = { "knownFor": knownFor };
          }
          oncomplite(result);
        };

        var url = 'api/v1/staff/' + params.id;
        getFromCache(url, function(json, cached) {
          if (!cached && json.personId) setCache(url, json);
          status.append('query', json);
        }, status.error.bind(status));
      }

      function menu() {
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        if (menu_list.length) oncomplite(menu_list); else {
          get('api/v2.2/films/filters', function(j) {
            if (j.genres) {
              j.genres.forEach(function(g) {
                menu_list.push({
                  "id": g.id,
                  "title": g.genre,
                  "url": '',
                  "hide": g.genre === 'для взрослых',
                  "separator": !g.genre
                });
                genres_map[g.genre] = g.id;
              });
            }
            if (j.countries) {
              j.countries.forEach(function(c) {
                countries_map[c.country] = c.id;
              });
            }
            oncomplite(menu_list);
          }, function() {
            oncomplite([]);
          });
        }
      }

      function menuCategory(params, oncomplite) {
        oncomplite([]);
      }

      function seasons(tv, from, oncomplite) {
        var status = new Lampa.Status(from.length);
        status.onComplite = oncomplite;
        from.forEach(function(season) {
          var seasons = tv.seasons || [];
          seasons = seasons.filter(function(s) {
            return s.season_number === season;
          });
          if (seasons.length) {
            status.append('' + season, seasons[0]);
          } else {
            status.error();
          }
        });
      }

      var KP = {
        SOURCE_NAME: SOURCE_NAME,
        SOURCE_TITLE: SOURCE_TITLE,
        main: main,
        menu: menu,
        full: full,
        list: list,
        category: category,
        clear: clear,
        person: person,
        seasons: seasons,
        menuCategory: menuCategory,
        discovery: discovery
      };

      var ALL_SOURCES = [{
        name: 'tmdb',
        title: 'TMDB'
      }, {
        name: 'cub',
        title: 'CUB'
      }, {
        name: 'pub',
        title: 'PUB'
      }, {
        name: 'filmix',
        title: 'FILMIX'
      }, {
        name: KP.SOURCE_NAME,
        title: KP.SOURCE_TITLE
      }];

      function startPlugin() {
        window.kp_source_plugin = true;
        function addPlugin() {
          if (Lampa.Api.sources[KP.SOURCE_NAME]) {
            Lampa.Noty.show('Установлен плагин несовместимый с kp_source');
            return;
          }
          Lampa.Api.sources[KP.SOURCE_NAME] = KP;
          Object.defineProperty(Lampa.Api.sources, KP.SOURCE_NAME, {
            get: function() {
              return KP;
            }
          });
          var sources;
          if (Lampa.Params.values && Lampa.Params.values['source']) {
            sources = Object.assign({}, Lampa.Params.values['source']);
            sources[KP.SOURCE_NAME] = KP.SOURCE_TITLE;
          } else {
            sources = {};
            ALL_SOURCES.forEach(function(s) {
              if (Lampa.Api.sources[s.name]) sources[s.name] = s.title;
            });
          }
          Lampa.Params.select('source', sources, 'tmdb');
        }
        if (window.appready) addPlugin(); else {
          Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') addPlugin();
          });
        }
      }

      if (!window.kp_source_plugin) startPlugin();

      Lampa.Api.sources.KP = KP;
      console.log('KP API интегрирован');
    }
    /* ===== Конец интеграции KP API ===== */

    // Сохраняем исходный источник для восстановления
    var originalSource = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ?
      Object.assign({}, Lampa.Params.values.source) : { tmdb: 'TMDB' };
    console.log('Исходный источник сохранён:', originalSource);

    // Функция для получения ID страны "Россия" через фильтры KP API
    var rus_id = '225';
    function loadCountryId(callback) {
      try {
        get('api/v2.2/films/filters', function(json) {
          if (json && json.countries) {
            json.countries.forEach(function(c) {
              if (c.country.toLowerCase() === 'россия') {
                rus_id = c.id;
              }
            });
          }
          console.log('ID России:', rus_id);
          if (callback) callback();
        }, function() {
          console.error('Не удалось загрузить фильтры для определения страны');
          if (callback) callback();
        });
      } catch (e) {
        console.error('Ошибка в loadCountryId:', e);
        if (callback) callback();
      }
    }

    /* ===== Добавление кнопки "Кинопоиск" в меню ===== */
    function addKPButton() {
      var menu = Lampa.Menu.render();
      if (!menu || !menu.length) {
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

      kpButton.on('click', function() {
        console.log('Нажата кнопка Кинопоиск');
        loadCountryId(function() {
          if (typeof Lampa.Select !== 'undefined' && typeof Lampa.Select.show === 'function') {
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
              onSelect: function(item) {
                console.log('Выбран пункт:', item);
                Lampa.Activity.push({
                  url: item.data.url,
                  title: item.title,
                  component: 'category_full',
                  source: 'KP',
                  card_type: true,
                  page: 1,
                  onBack: function() {
                    if (originalSource) {
                      Lampa.Params.select('source', originalSource);
                    }
                    Lampa.Controller.toggle("menu");
                  }
                });
              },
              onBack: function() {
                if (originalSource) {
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
      if (tvItem.length) {
        tvItem.after(kpButton);
        console.log('Кнопка Кинопоиск добавлена после элемента TV');
      } else {
        menu.append(kpButton);
        console.log('Кнопка Кинопоиск добавлена в конец меню');
      }
    }

    Lampa.Listener.follow('app', function(e) {
      if (e.type === 'ready') {
        addKPButton();
      }
    });
    // Дополнительный вызов через 5 секунд на случай, если событие "ready" пропущено
    setTimeout(addKPButton, 5000);
  } catch (ex) {
    console.error('Script error:', ex);
  }
})();
