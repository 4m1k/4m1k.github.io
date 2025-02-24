(function(){
  'use strict';
  if(window.KPPluginLoaded) return;
  window.KPPluginLoaded = true;
  console.log('KP Plugin script loaded');

  try {
    /* ===== Минимальная интеграция KP API ===== */
    if (!Lampa.Api.sources.KP) {
      // Переименованные переменные и функции с префиксом KP_
      var KP_network = new Lampa.Reguest();
      var KP_cache = {};
      var KP_total_cnt = 0;
      var KP_proxy_cnt = 0;
      var KP_good_cnt = 0;
      var KP_CACHE_SIZE = 100;
      var KP_CACHE_TIME = 1000 * 60 * 60;
      var KP_SOURCE_NAME = 'KP';
      var KP_SOURCE_TITLE = 'KP';
      var KP_genres_map = {};
      var KP_countries_map = {};

      function KP_cleanTitle(str) {
        return str.replace(/[\s.,:;’'`!?]+/g, ' ').trim();
      }
      function KP_kpCleanTitle(str) {
        return KP_cleanTitle(str).replace(/^[ \/\\]+/, '').replace(/[ \/\\]+$/, '');
      }
      function KP_normalizeTitle(str) {
        return KP_cleanTitle(str.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, '-').replace(/ё/g, 'е'));
      }
      function KP_containsTitle(str, title) {
        return typeof str === 'string' && typeof title === 'string' && KP_normalizeTitle(str).indexOf(KP_normalizeTitle(title)) !== -1;
      }
      function KP_startsWith(str, searchString) {
        return str.lastIndexOf(searchString, 0) === 0;
      }

      function KP_get(method, oncomplite, onerror) {
        var use_proxy = KP_total_cnt >= 10 && KP_good_cnt > KP_total_cnt / 2;
        if (!use_proxy) KP_total_cnt++;
        var kp_prox = 'https://cors.kp556.workers.dev:8443/';
        var url = 'https://kinopoiskapiunofficial.tech/' + method;
        console.log('KP API (get): Отправка запроса по URL:', url);
        KP_network.timeout(15000);
        KP_network.silent((use_proxy ? kp_prox : '') + url, function(json) {
          console.log('KP API (get): Получен ответ:', json);
          oncomplite(json);
        }, function(a, c) {
          use_proxy = !use_proxy && (KP_proxy_cnt < 10 || KP_good_cnt > KP_proxy_cnt / 2);
          if (use_proxy && (a.status == 429 || (a.status == 0 && a.statusText !== 'timeout'))) {
            KP_proxy_cnt++;
            KP_network.timeout(15000);
            KP_network.silent(kp_prox + url, function(json) {
              KP_good_cnt++;
              oncomplite(json);
            }, onerror, false, {
              headers: { 'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616' }
            });
          } else onerror(a, c);
        }, false, {
          headers: { 'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616' }
        });
      }

      function KP_getComplite(method, oncomplite) {
        KP_get(method, oncomplite, function () { oncomplite(null); });
      }

      function KP_getCompliteIf(condition, method, oncomplite) {
        if (condition) {
          KP_getComplite(method, oncomplite);
        } else {
          setTimeout(function () { oncomplite(null); }, 10);
        }
      }

      function KP_getCache(key) {
        var res = KP_cache[key];
        if (res) {
          var cache_timestamp = new Date().getTime() - KP_CACHE_TIME;
          if (res.timestamp > cache_timestamp) return res.value;
          for (var ID in KP_cache) {
            var node = KP_cache[ID];
            if (!(node && node.timestamp > cache_timestamp)) delete KP_cache[ID];
          }
        }
        return null;
      }

      function KP_setCache(key, value) {
        var timestamp = new Date().getTime();
        var size = Object.keys(KP_cache).length;
        if (size >= KP_CACHE_SIZE) {
          var cache_timestamp = timestamp - KP_CACHE_TIME;
          for (var ID in KP_cache) {
            var node = KP_cache[ID];
            if (!(node && node.timestamp > cache_timestamp)) delete KP_cache[ID];
          }
          size = Object.keys(KP_cache).length;
          if (size >= KP_CACHE_SIZE) {
            var timestamps = [];
            for (var _ID in KP_cache) {
              var _node = KP_cache[_ID];
              timestamps.push(_node && _node.timestamp || 0);
            }
            timestamps.sort(function(a, b){ return a - b; });
            cache_timestamp = timestamps[Math.floor(timestamps.length / 2)];
            for (var _ID2 in KP_cache) {
              var _node2 = KP_cache[_ID2];
              if (!(_node2 && _node2.timestamp > cache_timestamp)) delete KP_cache[_ID2];
            }
          }
        }
        KP_cache[key] = { timestamp: timestamp, value: value };
      }

      function KP_getFromCache(method, oncomplite, onerror) {
        console.log('KP_getFromCache вызвана с аргументом:', method);
        var json = KP_getCache(method);
        if (json) {
          setTimeout(function () { oncomplite(json, true); }, 10);
        } else {
          KP_get(method, oncomplite, onerror);
        }
      }

      function KP_clear() {
        KP_network.clear();
      }

      function KP_convertElem(elem) {
        var type = !elem.type || elem.type === 'FILM' || elem.type === 'VIDEO' ? 'movie' : 'tv';
        var kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
        var kp_rating = +elem.rating || +elem.ratingKinopoisk || 0;
        var title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
        var original_title = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
        var adult = false;
        var result = {
          "source": KP_SOURCE_NAME,
          "type": type,
          "adult": false,
          "id": KP_SOURCE_NAME + '_' + kinopoisk_id,
          "title": title,
          "original_title": original_title,
          "overview": elem.description || elem.shortDescription || '',
          "img": elem.posterUrlPreview || elem.posterUrl || '',
          "background_image": elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
          "genres": elem.genres && elem.genres.map(function(e) {
            if(e.genre === 'для взрослых') { adult = true; }
            return { "id": e.genre && KP_genres_map[e.genre] || 0, "name": e.genre, "url": '' };
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
          var seasons = elem.seasons_obj.items || [];
          result.number_of_seasons = elem.seasons_obj.total || seasons.length || 1;
          result.seasons = seasons.map(function(s){
            return KP_convertSeason(s);
          });
          var number_of_episodes = 0;
          result.seasons.forEach(function(s){ number_of_episodes += s.episode_count; });
          result.number_of_episodes = number_of_episodes;
        }

        if (elem.staff_obj) {
          var staff = elem.staff_obj || [];
          var cast = [];
          var crew = [];
          staff.forEach(function(s){
            var person = KP_convertPerson(s);
            if(s.professionKey === 'ACTOR') cast.push(person); else crew.push(person);
          });
          result.persons = { "cast": cast, "crew": crew };
        }

        if (elem.sequels_obj) {
          var sequels = elem.sequels_obj || [];
          result.collection = { "results": sequels.map(function(s){ return KP_convertElem(s); }) };
        }

        if (elem.similars_obj) {
          var similars = elem.similars_obj.items || [];
          result.simular = { "results": similars.map(function(s){ return KP_convertElem(s); }) };
        }

        return result;
      }

      function KP_convertSeason(season) {
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

      function KP_convertPerson(person) {
        return {
          "id": person.staffId,
          "name": person.nameRu || person.nameEn || '',
          "url": '',
          "img": person.posterUrl || '',
          "character": person.description || '',
          "job": Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
        };
      }

      function KP_getList(method, params, oncomplite, onerror) {
        var page = params.page || 1;
        var url = Lampa.Utils.addUrlComponent(method, 'page=' + page);
        KP_getFromCache(url, function(json, cached) {
          var items = [];
          if (json.items && json.items.length) items = json.items;
          else if (json.films && json.films.length) items = json.films;
          else if (json.releases && json.releases.length) items = json.releases;
          if (!cached && items.length) KP_setCache(url, json);
          var results = items.map(function(elem){ return KP_convertElem(elem); });
          results = results.filter(function(elem) { return !elem.adult; });
          var total_pages = json.pagesCount || json.totalPages || 1;
          oncomplite({
            "results": results,
            "url": method,
            "page": page,
            "total_pages": total_pages,
            "total_results": 0,
            "more": total_pages > page
          });
        }, onerror);
      }

      function KP__getById(id, params, oncomplite, onerror) {
        var url = 'api/v2.2/films/' + id;
        var film = KP_getCache(url);
        if (film) {
          setTimeout(function () { oncomplite(KP_convertElem(film)); }, 10);
        } else {
          KP_get(url, function(film) {
            if (film.kinopoiskId) {
              var type = !film.type || film.type === 'FILM' || film.type === 'VIDEO' ? 'movie' : 'tv';
              KP_getCompliteIf(type == 'tv', 'api/v2.2/films/' + id + '/seasons', function(seasons) {
                film.seasons_obj = seasons;
                KP_getComplite('api/v2.2/films/' + id + '/distributions', function(distributions) {
                  film.distributions_obj = distributions;
                  KP_getComplite('/api/v1/staff?filmId=' + id, function(staff) {
                    film.staff_obj = staff;
                    // Вместо запроса sequels_and_prequels (404) запрашиваем similars:
                    KP_getComplite('api/v2.2/films/' + id + '/similars', function(similars) {
                      film.similars_obj = similars;
                      KP_setCache(url, film);
                      oncomplite(KP_convertElem(film));
                    });
                  });
                });
              });
            } else onerror();
          }, onerror);
        }
      }

      // Stub-реализации main и category
      function main(params, oncomplite, onerror) {
        list(params, oncomplite, onerror);
      }
      function category(params, oncomplite, onerror) {
        list(params, oncomplite, onerror);
      }

      function full() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;
        var kinopoisk_id = '';
        if (params.card && params.card.source === KP_SOURCE_NAME) {
          if (params.card.kinopoisk_id) {
            kinopoisk_id = params.card.kinopoisk_id;
          } else if (KP_startsWith(params.card.id + '', KP_SOURCE_NAME + '_')) {
            kinopoisk_id = (params.card.id + '').substring(KP_SOURCE_NAME.length + 1);
            params.card.kinopoisk_id = kinopoisk_id;
          }
        }
        if (kinopoisk_id) {
          KP__getById(kinopoisk_id, params, function(json) {
            var status = new Lampa.Status(4);
            status.onComplite = oncomplite;
            status.append('movie', json);
            status.append('persons', json && json.persons);
            status.append('collection', json && json.collection);
            status.append('simular', json && json.similars_obj);
          }, onerror);
        } else onerror();
      }

      function list(params, oncomplite, onerror) {
        params = params || {};
        var method = params.url;
        if (method === '' && params.genres) {
          method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
        }
        KP_getList(method, params, oncomplite, onerror);
      }

      function search(params, oncomplite) {
        params = params || {};
        var title = decodeURIComponent(params.query || '');
        var status = new Lampa.Status(1);
        status.onComplite = function(data) {
          var items = [];
          if (data.query && data.query.results) {
            var tmp = data.query.results.filter(function(elem) {
              return KP_containsTitle(elem.title, title) || KP_containsTitle(elem.original_title, title);
            });
            if (tmp.length && tmp.length !== data.query.results.length) {
              data.query.results = tmp;
              data.query.more = true;
            }
            var movie = Object.assign({}, data.query);
            movie.results = data.query.results.filter(function(elem) { return elem.type === 'movie'; });
            movie.title = Lampa.Lang.translate('menu_movies');
            movie.type = 'movie';
            if (movie.results.length) items.push(movie);
            var tv = Object.assign({}, data.query);
            tv.results = data.query.results.filter(function(elem) { return elem.type === 'tv'; });
            tv.title = Lampa.Lang.translate('menu_tv');
            tv.type = 'tv';
            if (tv.results.length) items.push(tv);
          }
          oncomplite(items);
        };
        KP_getList('api/v2.1/films/search-by-keyword', params, function(json) {
          status.append('query', json);
        }, status.error.bind(status));
      }

      function discovery() {
        return {
          title: KP_SOURCE_TITLE,
          search: search,
          params: {
            align_left: true,
            object: { source: KP_SOURCE_NAME }
          },
          onMore: function(params) {
            Lampa.Activity.push({
              url: 'api/v2.1/films/search-by-keyword',
              title: Lampa.Lang.translate('search') + ' - ' + params.query,
              component: 'category_full',
              page: 1,
              query: encodeURIComponent(params.query),
              source: KP_SOURCE_NAME
            });
          },
          onCancel: KP_network.clear.bind(KP_network)
        };
      }

      function person(params, oncomplite) {
        params = params || {};
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
                  director_films.push(KP_convertElem(f));
                } else if (f.professionKey === 'ACTOR' && !actor_map[f.filmId]) {
                  actor_map[f.filmId] = true;
                  actor_films.push(KP_convertElem(f));
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
        KP_getFromCache(url, function(json, cached) {
          if (!cached && json.personId) KP_setCache(url, json);
          status.append('query', json);
        }, status.error.bind(status));
      }

      var KP = {
        SOURCE_NAME: KP_SOURCE_NAME,
        SOURCE_TITLE: KP_SOURCE_TITLE,
        main: main,
        menu: menu,
        full: full,
        list: list,
        category: category,
        clear: KP_clear,
        person: person,
        seasons: seasons,
        menuCategory: menuCategory,
        discovery: discovery,
        search: search
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
            get: function() { return KP; }
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

    var originalSource = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ?
      Object.assign({}, Lampa.Params.values.source) : { tmdb: 'TMDB' };
    console.log('Исходный источник сохранён:', originalSource);

    var rus_id = '225';
    function kp_loadCountryId(callback) {
      try {
        KP_get('api/v2.2/films/filters', function(json) {
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
        console.error('Ошибка в kp_loadCountryId:', e);
        if (callback) callback();
      }
    }

    /* ===== Добавление кнопки "Кинопоиск" в меню ===== */
    function addKPButton() {
      var menu = Lampa.Menu.render();
      if (!menu || !menu.length) {
        console.error('Меню не найдено, повторная попытка через 1000мс');
        setTimeout(addKPButton, 1000);
        return;
      }
      if (menu.find('[data-action="kp"]').length) {
        console.log('Кнопка "Кинопоиск" уже добавлена');
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
        kp_loadCountryId(function() {
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
                    if (originalSource) { Lampa.Params.select('source', originalSource); }
                    Lampa.Controller.toggle("menu");
                  }
                });
              },
              onBack: function() {
                if (originalSource) { Lampa.Params.select('source', originalSource); }
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

    /* ===== Конец добавления кнопки ===== */

    function startPlugin() {
      window.kp_source_plugin = true;
      function addPlugin() {
        if (Lampa.Api.sources[KP_SOURCE_NAME]) {
          Lampa.Noty.show('Установлен плагин несовместимый с kp_source');
          return;
        }
        Lampa.Api.sources[KP_SOURCE_NAME] = KP;
        Object.defineProperty(Lampa.Api.sources, KP_SOURCE_NAME, { get: function() { return KP; } });
        var sources;
        if (Lampa.Params.values && Lampa.Params.values['source']) {
          sources = Object.assign({}, Lampa.Params.values['source']);
          sources[KP_SOURCE_NAME] = KP_SOURCE_TITLE;
        } else {
          sources = {};
          ALL_SOURCES.forEach(function(s) {
            if (Lampa.Api.sources[s.name]) sources[s.name] = s.title;
          });
        }
        Lampa.Params.select('source', sources, 'tmdb');
      }
      if (window.appready) addPlugin(); else {
        Lampa.Listener.follow('app', function(e) { if (e.type == 'ready') addPlugin(); });
      }
    }
    if (!window.kp_source_plugin) startPlugin();
    Lampa.Api.sources.KP = KP;
    console.log('KP API интегрирован');
  } catch (ex) {
    console.error('Script error:', ex);
  }
})();
