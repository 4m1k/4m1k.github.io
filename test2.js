(function(){
  'use strict';
  // Если плагин уже загружен – ничего не делаем
  if(window.KPPluginLoaded) return;
  window.KPPluginLoaded = true;
  console.log('KP Plugin script loaded');

  try {
    /* ===== Минимальная интеграция KP API ===== */
    if (!Lampa.Api.sources.KP) {
      // --- Сеть и кэш ---
      const KP_NETWORK = new Lampa.Reguest();
      const KP_CACHE_SIZE = 100;
      const KP_CACHE_TIME = 1000 * 60 * 60; // 1 час
      let KP_cache = {};
      let KP_total_cnt = 0, KP_proxy_cnt = 0, KP_good_cnt = 0;
      const KP_SOURCE_NAME = 'KP';
      const KP_SOURCE_TITLE = 'KP';
      let KP_genres_map = {};
      let KP_countries_map = {};
      let KP_menu_list = [];

      // --- Функции для обработки строк ---
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
        return typeof str === 'string' && typeof title === 'string' &&
               KP_normalizeTitle(str).indexOf(KP_normalizeTitle(title)) !== -1;
      }
      function KP_startsWith(str, searchString) {
        return str.lastIndexOf(searchString, 0) === 0;
      }

      // --- Сетевые функции ---
      function KP_get(method, onComplite, onError) {
        let use_proxy = KP_total_cnt >= 10 && KP_good_cnt > KP_total_cnt / 2;
        if (!use_proxy) KP_total_cnt++;
        const kp_prox = 'https://cors.kp556.workers.dev:8443/';
        const url = 'https://kinopoiskapiunofficial.tech/' + method;
        console.log('KP_get: URL:', url);
        KP_NETWORK.timeout(15000);
        KP_NETWORK.silent((use_proxy ? kp_prox : '') + url, function(json) {
          console.log('KP_get: Ответ:', json);
          onComplite(json);
        }, function(a, c) {
          use_proxy = !use_proxy && (KP_proxy_cnt < 10 || KP_good_cnt > KP_proxy_cnt / 2);
          if (use_proxy && (a.status === 429 || (a.status === 0 && a.statusText !== 'timeout'))) {
            KP_proxy_cnt++;
            KP_NETWORK.timeout(15000);
            KP_NETWORK.silent(kp_prox + url, function(json) {
              KP_good_cnt++;
              onComplite(json);
            }, onError, false, {
              headers: { 'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616' }
            });
          } else {
            onError(a, c);
          }
        }, false, {
          headers: { 'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616' }
        });
      }
      function KP_getComplite(method, onComplite) {
        KP_get(method, onComplite, () => onComplite(null));
      }
      function KP_getCompliteIf(condition, method, onComplite) {
        if (condition) {
          KP_getComplite(method, onComplite);
        } else {
          setTimeout(() => onComplite(null), 10);
        }
      }
      function KP_getCache(key) {
        const res = KP_cache[key];
        if (res) {
          const cache_timestamp = new Date().getTime() - KP_CACHE_TIME;
          if (res.timestamp > cache_timestamp) return res.value;
          for (const ID in KP_cache) {
            const node = KP_cache[ID];
            if (!(node && node.timestamp > cache_timestamp)) delete KP_cache[ID];
          }
        }
        return null;
      }
      function KP_setCache(key, value) {
        const timestamp = new Date().getTime();
        let size = Object.keys(KP_cache).length;
        if (size >= KP_CACHE_SIZE) {
          let cache_timestamp = timestamp - KP_CACHE_TIME;
          for (const ID in KP_cache) {
            const node = KP_cache[ID];
            if (!(node && node.timestamp > cache_timestamp)) delete KP_cache[ID];
          }
          size = Object.keys(KP_cache).length;
          if (size >= KP_CACHE_SIZE) {
            const timestamps = [];
            for (const _ID in KP_cache) {
              const _node = KP_cache[_ID];
              timestamps.push(_node && _node.timestamp || 0);
            }
            timestamps.sort((a, b) => a - b);
            cache_timestamp = timestamps[Math.floor(timestamps.length / 2)];
            for (const _ID2 in KP_cache) {
              const _node2 = KP_cache[_ID2];
              if (!(_node2 && _node2.timestamp > cache_timestamp)) delete KP_cache[_ID2];
            }
          }
        }
        KP_cache[key] = { timestamp, value };
      }
      function KP_getFromCache(method, onComplite, onError) {
        console.log('KP_getFromCache:', method);
        const json = KP_getCache(method);
        if (json) {
          setTimeout(() => onComplite(json, true), 10);
        } else {
          KP_get(method, onComplite, onError);
        }
      }
      function KP_clear() {
        KP_NETWORK.clear();
      }

      // --- Функции преобразования элементов ---
      function KP_convertElem(elem) {
        const type = (!elem.type || elem.type === 'FILM' || elem.type === 'VIDEO') ? 'movie' : 'tv';
        const kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
        const kp_rating = +elem.rating || +elem.ratingKinopoisk || 0;
        const title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
        const original_title = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
        let adult = false;
        const result = {
          source: KP_SOURCE_NAME,
          type,
          adult: false,
          id: KP_SOURCE_NAME + '_' + kinopoisk_id,
          title,
          original_title,
          overview: elem.description || elem.shortDescription || '',
          img: elem.posterUrlPreview || elem.posterUrl || '',
          background_image: elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
          genres: elem.genres ? elem.genres.map(e => {
            if (e.genre === 'для взрослых') adult = true;
            return { id: (e.genre && KP_genres_map[e.genre]) || 0, name: e.genre, url: '' };
          }) : [],
          production_companies: [],
          production_countries: elem.countries ? elem.countries.map(e => ({ name: e.country })) : [],
          vote_average: kp_rating,
          vote_count: elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
          kinopoisk_id,
          kp_rating,
          imdb_id: elem.imdbId || '',
          imdb_rating: elem.ratingImdb || 0
        };
        result.adult = adult;
        let first_air_date = (elem.year && elem.year !== 'null') ? elem.year : '';
        let last_air_date = '';
        if (type === 'tv') {
          if (elem.startYear && elem.startYear !== 'null') first_air_date = elem.startYear;
          if (elem.endYear && elem.endYear !== 'null') last_air_date = elem.endYear;
        }
        if (elem.distributions_obj) {
          const distributions = elem.distributions_obj.items || [];
          const year_timestamp = Date.parse(first_air_date);
          let min = null;
          distributions.forEach(d => {
            if (d.date && (d.type === 'WORLD_PREMIER' || d.type === 'ALL')) {
              const timestamp = Date.parse(d.date);
              if (!isNaN(timestamp) && (min === null || timestamp < min) &&
                  (isNaN(year_timestamp) || timestamp >= year_timestamp)) {
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
          if (last_air_date) result.last_air_date = last_air_date;
        } else {
          result.release_date = first_air_date;
        }
        if (elem.seasons_obj) {
          const seasons = elem.seasons_obj.items || [];
          result.number_of_seasons = elem.seasons_obj.total || seasons.length || 1;
          result.seasons = seasons.map(s => KP_convertSeason(s));
          let number_of_episodes = 0;
          result.seasons.forEach(s => { number_of_episodes += s.episode_count; });
          result.number_of_episodes = number_of_episodes;
        }
        if (elem.staff_obj) {
          const staff = elem.staff_obj || [];
          const cast = [];
          const crew = [];
          staff.forEach(s => {
            const person = KP_convertPerson(s);
            if (s.professionKey === 'ACTOR') cast.push(person); else crew.push(person);
          });
          result.persons = { cast, crew };
        }
        if (elem.sequels_obj) {
          const sequels = elem.sequels_obj || [];
          result.collection = { results: sequels.map(s => KP_convertElem(s)) };
        }
        if (elem.similars_obj) {
          const similars = elem.similars_obj.items || [];
          result.simular = { results: similars.map(s => KP_convertElem(s)) };
        }
        return result;
      }
      function KP_convertSeason(season) {
        let episodes = season.episodes || [];
        episodes = episodes.map(e => ({
          season_number: e.seasonNumber,
          episode_number: e.episodeNumber,
          name: e.nameRu || e.nameEn || 'S' + e.seasonNumber + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + e.episodeNumber,
          overview: e.synopsis || '',
          air_date: e.releaseDate
        }));
        return {
          season_number: season.number,
          episode_count: episodes.length,
          episodes,
          name: Lampa.Lang.translate('torrent_serial_season') + ' ' + season.number,
          overview: ''
        };
      }
      function KP_convertPerson(person) {
        return {
          id: person.staffId,
          name: person.nameRu || person.nameEn || '',
          url: '',
          img: person.posterUrl || '',
          character: person.description || '',
          job: Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
        };
      }

      // --- Функция для загрузки списка по категории ---
      function KP_getListWrapper(method, params, onComplite, onError) {
        const page = params.page || 1;
        const url = Lampa.Utils.addUrlComponent(method, 'page=' + page);
        KP_getFromCache(url, function(json, cached) {
          let items = [];
          if (json.items && json.items.length) items = json.items;
          else if (json.films && json.films.length) items = json.films;
          else if (json.releases && json.releases.length) items = json.releases;
          if (!cached && items.length) KP_setCache(url, json);
          let results = items.map(elem => KP_convertElem(elem));
          results = results.filter(elem => !elem.adult);
          const total_pages = json.pagesCount || json.totalPages || 1;
          onComplite({
            results,
            url: method,
            page,
            total_pages,
            total_results: 0,
            more: total_pages > page
          });
        }, onError);
      }

      // --- Функция получения деталей (переименована, чтобы не дублировалась) ---
      function KP_getByIdInternal(id, params, onComplite, onError) {
        const url = 'api/v2.2/films/' + id;
        const film = KP_getCache(url);
        if (film) {
          setTimeout(() => onComplite(KP_convertElem(film)), 10);
        } else {
          KP_get(url, function(film) {
            if (film.kinopoiskId) {
              const type = (!film.type || film.type === 'FILM' || film.type === 'VIDEO') ? 'movie' : 'tv';
              KP_getCompliteIf(type == 'tv', 'api/v2.2/films/' + id + '/seasons', function(seasons) {
                film.seasons_obj = seasons;
                KP_getComplite('api/v2.2/films/' + id + '/distributions', function(distributions) {
                  film.distributions_obj = distributions;
                  KP_getComplite('/api/v1/staff?filmId=' + id, function(staff) {
                    film.staff_obj = staff;
                    // Запрашиваем похожие фильмы вместо sequels_and_prequels
                    KP_getComplite('api/v2.2/films/' + id + '/similars', function(similars) {
                      film.similars_obj = similars;
                      KP_setCache(url, film);
                      onComplite(KP_convertElem(film));
                    });
                  });
                });
              });
            } else onError();
          }, onError);
        }
      }

      // --- Stub‑реализации основных функций ---
      function KP_mainWrapper(params, onComplite, onError) {
        return KP_listWrapper(params, onComplite, onError);
      }
      function KP_categoryWrapper(params, onComplite, onError) {
        return KP_listWrapper(params, onComplite, onError);
      }
      function KP_fullWrapper(params = {}, onComplite, onError) {
        let kinopoisk_id = '';
        if (params.card && params.card.source === KP_SOURCE_NAME) {
          if (params.card.kinopoisk_id) {
            kinopoisk_id = params.card.kinopoisk_id;
          } else if (KP_startsWith(params.card.id + '', KP_SOURCE_NAME + '_')) {
            kinopoisk_id = (params.card.id + '').substring(KP_SOURCE_NAME.length + 1);
            params.card.kinopoisk_id = kinopoisk_id;
          }
        }
        if (kinopoisk_id) {
          KP_getByIdInternal(kinopoisk_id, params, function(json) {
            const status = new Lampa.Status(4);
            status.onComplite = onComplite;
            status.append('movie', json);
            status.append('persons', json && json.persons);
            status.append('collection', json && json.collection);
            status.append('simular', json && json.similars_obj);
          }, onError);
        } else onError();
      }
      function KP_listWrapper(params, onComplite, onError) {
        params = params || {};
        let method = params.url;
        if (method === '' && params.genres) {
          method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
        }
        KP_getListWrapper(method, params, onComplite, onError);
      }
      function KP_searchWrapper(params, onComplite) {
        params = params || {};
        const title = decodeURIComponent(params.query || '');
        const status = new Lampa.Status(1);
        status.onComplite = function(data) {
          let items = [];
          if (data.query && data.query.results) {
            const tmp = data.query.results.filter(elem =>
              KP_containsTitle(elem.title, title) || KP_containsTitle(elem.original_title, title)
            );
            if (tmp.length && tmp.length !== data.query.results.length) {
              data.query.results = tmp;
              data.query.more = true;
            }
            const movie = Object.assign({}, data.query);
            movie.results = data.query.results.filter(elem => elem.type === 'movie');
            movie.title = Lampa.Lang.translate('menu_movies');
            movie.type = 'movie';
            if (movie.results.length) items.push(movie);
            const tv = Object.assign({}, data.query);
            tv.results = data.query.results.filter(elem => elem.type === 'tv');
            tv.title = Lampa.Lang.translate('menu_tv');
            tv.type = 'tv';
            if (tv.results.length) items.push(tv);
          }
          onComplite(items);
        };
        KP_getListWrapper('api/v2.1/films/search-by-keyword', params, function(json) {
          status.append('query', json);
        }, status.error.bind(status));
      }
      function KP_discoveryWrapper() {
        return {
          title: KP_SOURCE_TITLE,
          search: KP_searchWrapper,
          params: { align_left: true, object: { source: KP_SOURCE_NAME } },
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
          onCancel: KP_NETWORK.clear.bind(KP_NETWORK)
        };
      }
      function KP_personWrapper(params, onComplite) {
        params = params || {};
        const status = new Lampa.Status(1);
        status.onComplite = function(data) {
          let result = {};
          if (data.query) {
            const p = data.query;
            result.person = {
              id: p.personId,
              name: p.nameRu || p.nameEn || '',
              url: '',
              img: p.posterUrl || '',
              gender: p.sex === 'MALE' ? 2 : p.sex === 'FEMALE' ? 1 : 0,
              birthday: p.birthday,
              place_of_birth: p.birthplace,
              deathday: p.death,
              place_of_death: p.deathplace,
              known_for_department: p.profession || '',
              biography: (p.facts || []).join(' ')
            };
            let director_films = [];
            let director_map = {};
            let actor_films = [];
            let actor_map = {};
            if (p.films) {
              p.films.forEach(f => {
                if (f.professionKey === 'DIRECTOR' && !director_map[f.filmId]) {
                  director_map[f.filmId] = true;
                  director_films.push(KP_convertElem(f));
                } else if (f.professionKey === 'ACTOR' && !actor_map[f.filmId]) {
                  actor_map[f.filmId] = true;
                  actor_films.push(KP_convertElem(f));
                }
              });
            }
            let knownFor = [];
            if (director_films.length) {
              director_films.sort((a, b) => (b.vote_average - a.vote_average) || (a.id - b.id));
              knownFor.push({
                name: Lampa.Lang.translate('title_producer'),
                credits: director_films
              });
            }
            if (actor_films.length) {
              actor_films.sort((a, b) => (b.vote_average - a.vote_average) || (a.id - b.id));
              knownFor.push({
                name: Lampa.Lang.translate(p.sex === 'FEMALE' ? 'title_actress' : 'title_actor'),
                credits: actor_films
              });
            }
            result.credits = { knownFor };
          }
          onComplite(result);
        };
        const url = 'api/v1/staff/' + params.id;
        KP_getFromCache(url, function(json, cached) {
          if (!cached && json.personId) KP_setCache(url, json);
          status.append('query', json);
        }, status.error.bind(status));
      }

      // --- Объединяем объект KP для Lampa ---
      const KP_OBJECT = {
        SOURCE_NAME: KP_SOURCE_NAME,
        SOURCE_TITLE: KP_SOURCE_TITLE,
        main: KP_mainWrapper,
        // Для меню мы используем встроенную Lampa.Menu (без переопределения)
        full: KP_fullWrapper,
        list: KP_listWrapper,
        category: KP_categoryWrapper,
        clear: KP_clear,
        person: KP_personWrapper,
        seasons: KP_seasons,
        menuCategory: KP_menuCategory,
        discovery: KP_discoveryWrapper,
        search: KP_searchWrapper
      };

      const KP_ALL_SOURCES = [
        { name: 'tmdb', title: 'TMDB' },
        { name: 'cub', title: 'CUB' },
        { name: 'pub', title: 'PUB' },
        { name: 'filmix', title: 'FILMIX' },
        { name: KP_OBJECT.SOURCE_NAME, title: KP_OBJECT.SOURCE_TITLE }
      ];

      function KP__getById(id, params, onComplite, onError) {
        const url = 'api/v2.2/films/' + id;
        const film = KP_getCache(url);
        if (film) {
          setTimeout(() => onComplite(KP_convertElem(film)), 10);
        } else {
          KP_get(url, function(film) {
            if (film.kinopoiskId) {
              const type = (!film.type || film.type === 'FILM' || film.type === 'VIDEO') ? 'movie' : 'tv';
              KP_getCompliteIf(type == 'tv', 'api/v2.2/films/' + id + '/seasons', function(seasons) {
                film.seasons_obj = seasons;
                KP_getComplite('api/v2.2/films/' + id + '/distributions', function(distributions) {
                  film.distributions_obj = distributions;
                  KP_getComplite('/api/v1/staff?filmId=' + id, function(staff) {
                    film.staff_obj = staff;
                    KP_getComplite('api/v2.2/films/' + id + '/similars', function(similars) {
                      film.similars_obj = similars;
                      KP_setCache(url, film);
                      onComplite(KP_convertElem(film));
                    });
                  });
                });
              });
            } else onError();
          }, onError);
        }
      }

      // --- Функции-обёртки для внешнего использования ---
      function KP_fullExternal() {
        const params = arguments.length > 0 ? arguments[0] : {};
        const onComplite = arguments.length > 1 ? arguments[1] : undefined;
        const onError = arguments.length > 2 ? arguments[2] : undefined;
        let kinopoisk_id = '';
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
            const status = new Lampa.Status(4);
            status.onComplite = onComplite;
            status.append('movie', json);
            status.append('persons', json && json.persons);
            status.append('collection', json && json.collection);
            status.append('simular', json && json.similars_obj);
          }, onError);
        } else onError();
      }
      
      // Объединяем конечный объект KP для Lampa
      Lampa.Api.sources.KP = KP_OBJECT;
      console.log('KP API интегрирован');
    }
    /* ===== Конец интеграции KP API ===== */

    // --- Сохранение исходного источника ---
    const originalSource = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ?
      Object.assign({}, Lampa.Params.values.source) : { tmdb: 'TMDB' };
    console.log('Исходный источник сохранён:', originalSource);

    // --- Функция загрузки ID страны "Россия" ---
    let rus_id = '225';
    function kp_loadCountryId(callback) {
      try {
        KP_get('api/v2.2/films/filters', function(json) {
          if (json && json.countries) {
            json.countries.forEach(c => {
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
      } catch(e) {
        console.error('Ошибка в kp_loadCountryId:', e);
        if (callback) callback();
      }
    }

    // --- Добавление кнопки "Кинопоиск" в меню ---
    function addKPButton() {
      const menuEl = Lampa.Menu.render();
      if (!menuEl || !menuEl.length) {
        console.error('Меню не найдено, повторная попытка через 1000 мс');
        setTimeout(addKPButton, 1000);
        return;
      }
      if (menuEl.find('[data-action="kp"]').length) {
        console.log('Кнопка "Кинопоиск" уже добавлена');
        return;
      }
      console.log('Меню найдено, добавляем кнопку Кинопоиск');
      const kpButton = $(`
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
      const tvItem = menuEl.find('[data-action="tv"]');
      if (tvItem.length) {
        tvItem.after(kpButton);
        console.log('Кнопка Кинопоиск добавлена после элемента TV');
      } else {
        menuEl.append(kpButton);
        console.log('Кнопка Кинопоиск добавлена в конец меню');
      }
    }
    Lampa.Listener.follow('app', function(e) {
      if (e.type === 'ready') addKPButton();
    });
    /* ===== Конец добавления кнопки ===== */

    // --- Регистрация плагина в Lampa ---
    function startPlugin() {
      window.kp_source_plugin = true;
      function addPlugin() {
        if (Lampa.Api.sources[KP_SOURCE_NAME]) {
          Lampa.Noty.show('Установлен плагин несовместимый с kp_source');
          return;
        }
        Lampa.Api.sources[KP_SOURCE_NAME] = KP_OBJECT;
        Object.defineProperty(Lampa.Api.sources, KP_SOURCE_NAME, { get: function() { return KP_OBJECT; } });
        let sources;
        if (Lampa.Params.values && Lampa.Params.values['source']) {
          sources = Object.assign({}, Lampa.Params.values['source']);
          sources[KP_SOURCE_NAME] = KP_SOURCE_TITLE;
        } else {
          sources = {};
          KP_ALL_SOURCES.forEach(s => {
            if (Lampa.Api.sources[s.name]) sources[s.name] = s.title;
          });
        }
        Lampa.Params.select('source', sources, 'tmdb');
      }
      if (window.appready) {
        addPlugin();
      } else {
        Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') addPlugin(); });
      }
    }
    if (!window.kp_source_plugin) startPlugin();
    Lampa.Api.sources.KP = KP_OBJECT;
    console.log('KP API интегрирован');
  } catch (ex) {
    console.error('Script error:', ex);
  }
});
