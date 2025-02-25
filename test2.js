(function(){
  'use strict';
  // Предотвращаем повторное выполнение плагина
  if(window.KPPluginLoaded){
    console.log("KP Plugin уже загружен");
    return;
  }
  window.KPPluginLoaded = true;
  console.log("KP Plugin script loaded");

  // ------------------- Добавление кнопки в меню -------------------
  // Селектор для кнопки TV и таймаут перемещения
  const ITEM_TV_SELECTOR = '[data-action="tv"]';
  const ITEM_MOVE_TIMEOUT = 2000;
  function moveItemAfter(item, after){
    return setTimeout(() => {
      $(item).insertAfter($(after));
    }, ITEM_MOVE_TIMEOUT);
  }
  function addMenuButton(attr, text, iconHTML, onEnterHandler){
    const field = $(`
      <li class="menu__item selector" ${attr}>
        <div class="menu__ico">${iconHTML}</div>
        <div class="menu__text">${text}</div>
      </li>
    `);
    field.on('hover:enter', onEnterHandler);
    if(window.appready){
      Lampa.Menu.render().find(ITEM_TV_SELECTOR).after(field);
      moveItemAfter(`[${attr}]`, ITEM_TV_SELECTOR);
    } else {
      Lampa.Listener.follow('app', event => {
        if(event.type === 'ready'){
          Lampa.Menu.render().find(ITEM_TV_SELECTOR).after(field);
          moveItemAfter(`[${attr}]`, ITEM_TV_SELECTOR);
        }
      });
    }
  }

  // Используем простую иконку для кнопки "Кинопоиск"
  const kpIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

  // Функция открытия окна выбора категорий KP
  function openKPSelect(){
    console.log("Нажата кнопка Кинопоиск");
    Lampa.Select.show({
      title: "Кинопоиск",
      items: [
        { title: 'Топ Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS' } },
        { title: 'Популярные Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_100_POPULAR_FILMS' } },
        { title: 'Популярные Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES' } },
        { title: 'Популярные Телешоу', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW' } }
      ],
      onSelect: function(item){
        console.log("Выбран пункт:", item);
        Lampa.Activity.push({
          url: item.data.url,
          title: item.title,
          component: 'category_full',
          source: KP_PLUGIN.SOURCE_NAME,
          card_type: true,
          page: 1,
          onBack: function(){
            if(originalSource){ Lampa.Params.select('source', originalSource); }
            Lampa.Controller.toggle("menu");
          }
        });
      },
      onBack: function(){
        if(originalSource){ Lampa.Params.select('source', originalSource); }
        Lampa.Controller.toggle("menu");
      }
    });
    console.log("Окно выбора категорий открыто");
  }

  // Добавляем кнопку "Кинопоиск" в меню
  addMenuButton('data-action="kp"', 'Кинопоиск', kpIcon, openKPSelect);

  // ------------------- KP API Integration -------------------
  // Объект плагина
  const KP_PLUGIN = {};
  KP_PLUGIN.SOURCE_NAME = 'KP';
  KP_PLUGIN.SOURCE_TITLE = 'KP';
  
  // Создаём экземпляр Reguest и кэш
  KP_PLUGIN.network = new Lampa.Reguest();
  KP_PLUGIN.cache = {};
  KP_PLUGIN.totalCount = 0;
  KP_PLUGIN.proxyCount = 0;
  KP_PLUGIN.goodCount = 0;
  KP_PLUGIN.CACHE_SIZE = 100;
  KP_PLUGIN.CACHE_TIME = 1000 * 60 * 60; // 1 час
  
  // Функции кэширования
  KP_PLUGIN.getCache = function(key){
    const res = KP_PLUGIN.cache[key];
    if(res){
      const limit = new Date().getTime() - KP_PLUGIN.CACHE_TIME;
      if(res.timestamp > limit) return res.value;
      Object.keys(KP_PLUGIN.cache).forEach(id => {
        if(KP_PLUGIN.cache[id].timestamp <= limit) delete KP_PLUGIN.cache[id];
      });
    }
    return null;
  };
  KP_PLUGIN.setCache = function(key, value){
    const timestamp = new Date().getTime();
    if(Object.keys(KP_PLUGIN.cache).length >= KP_PLUGIN.CACHE_SIZE){
      const limit = timestamp - KP_PLUGIN.CACHE_TIME;
      Object.keys(KP_PLUGIN.cache).forEach(id => {
        if(KP_PLUGIN.cache[id].timestamp <= limit) delete KP_PLUGIN.cache[id];
      });
      if(Object.keys(KP_PLUGIN.cache).length >= KP_PLUGIN.CACHE_SIZE){
        const times = Object.values(KP_PLUGIN.cache).map(e => e.timestamp).sort((a,b)=>a-b);
        const mid = times[Math.floor(times.length/2)];
        Object.keys(KP_PLUGIN.cache).forEach(id => {
          if(KP_PLUGIN.cache[id].timestamp <= mid) delete KP_PLUGIN.cache[id];
        });
      }
    }
    KP_PLUGIN.cache[key] = { timestamp, value };
  };
  KP_PLUGIN.getFromCache = function(method, onComplite, onError){
    const json = KP_PLUGIN.getCache(method);
    if(json){
      setTimeout(() => onComplite(json, true), 10);
    } else {
      KP_PLUGIN.get(method, onComplite, onError);
    }
  };
  KP_PLUGIN.clear = function(){
    KP_PLUGIN.network.clear();
  };
  
  // Сетевой запрос
  KP_PLUGIN.get = function(method, onComplite, onError){
    let useProxy = KP_PLUGIN.totalCount >= 10 && KP_PLUGIN.goodCount > KP_PLUGIN.totalCount/2;
    if(!useProxy) KP_PLUGIN.totalCount++;
    const kpProxy = 'https://cors.kp556.workers.dev:8443/';
    const url = 'https://kinopoiskapiunofficial.tech/' + method;
    KP_PLUGIN.network.timeout(15000);
    KP_PLUGIN.network.silent((useProxy ? kpProxy : '') + url, function(json){
      console.log("KP get response:", json);
      onComplite(json);
    }, function(a, c){
      useProxy = !useProxy && (KP_PLUGIN.proxyCount < 10 || KP_PLUGIN.goodCount > KP_PLUGIN.proxyCount/2);
      if(useProxy && (a.status === 429 || (a.status === 0 && a.statusText !== 'timeout'))){
        KP_PLUGIN.proxyCount++;
        KP_PLUGIN.network.timeout(15000);
        KP_PLUGIN.network.silent(kpProxy + url, function(json){
          KP_PLUGIN.goodCount++;
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
  };
  KP_PLUGIN.getComplite = function(method, onComplite){
    KP_PLUGIN.get(method, onComplite, () => onComplite(null));
  };
  KP_PLUGIN.getCompliteIf = function(condition, method, onComplite){
    if(condition) KP_PLUGIN.getComplite(method, onComplite);
    else setTimeout(() => onComplite(null), 10);
  };

  // Функции преобразования данных
  KP_PLUGIN.convertElem = function(elem){
    const type = (!elem.type || elem.type === 'FILM' || elem.type === 'VIDEO') ? 'movie' : 'tv';
    const kpId = elem.kinopoiskId || elem.filmId || 0;
    const kpRating = +elem.rating || +elem.ratingKinopoisk || 0;
    const title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
    const originalTitle = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
    let adult = false;
    const result = {
      source: KP_PLUGIN.SOURCE_NAME,
      type,
      adult: false,
      id: KP_PLUGIN.SOURCE_NAME + '_' + kpId,
      title,
      original_title: originalTitle,
      overview: elem.description || elem.shortDescription || '',
      img: elem.posterUrlPreview || elem.posterUrl || '',
      background_image: elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
      genres: elem.genres ? elem.genres.map(e => {
         if(e.genre === 'для взрослых') adult = true;
         return { id: (e.genre && genres_map[e.genre]) || 0, name: e.genre, url: '' };
      }) : [],
      production_companies: [],
      production_countries: elem.countries ? elem.countries.map(e => ({ name: e.country })) : [],
      vote_average: kpRating,
      vote_count: elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
      kinopoisk_id: kpId,
      kp_rating: kpRating,
      imdb_id: elem.imdbId || '',
      imdb_rating: elem.ratingImdb || 0
    };
    result.adult = adult;
    let firstAirDate = (elem.year && elem.year !== 'null') ? elem.year : '';
    let lastAirDate = '';
    if(type === 'tv'){
      if(elem.startYear && elem.startYear !== 'null') firstAirDate = elem.startYear;
      if(elem.endYear && elem.endYear !== 'null') lastAirDate = elem.endYear;
    }
    if(elem.distributions_obj){
      const distributions = elem.distributions_obj.items || [];
      const yearTimestamp = Date.parse(firstAirDate);
      let min = null;
      distributions.forEach(d => {
        if(d.date && (d.type === 'WORLD_PREMIER' || d.type === 'ALL')){
          const timestamp = Date.parse(d.date);
          if(!isNaN(timestamp) && (min === null || timestamp < min) && (isNaN(yearTimestamp) || timestamp >= yearTimestamp)){
            min = timestamp;
            firstAirDate = d.date;
          }
        }
      });
    }
    if(type === 'tv'){
      result.name = title;
      result.original_name = originalTitle;
      result.first_air_date = firstAirDate;
      if(lastAirDate) result.last_air_date = lastAirDate;
    } else {
      result.release_date = firstAirDate;
    }
    if(elem.seasons_obj){
      const seasons = elem.seasons_obj.items || [];
      result.number_of_seasons = elem.seasons_obj.total || seasons.length || 1;
      result.seasons = seasons.map(s => KP_PLUGIN.convertSeason(s));
      let episodesCount = 0;
      result.seasons.forEach(s => { episodesCount += s.episode_count; });
      result.number_of_episodes = episodesCount;
    }
    if(elem.staff_obj){
      const staff = elem.staff_obj || [];
      const cast = [];
      const crew = [];
      staff.forEach(s => {
         const person = KP_PLUGIN.convertPerson(s);
         if(s.professionKey === 'ACTOR') cast.push(person); else crew.push(person);
      });
      result.persons = { cast, crew };
    }
    if(elem.sequels_obj){
      const sequels = elem.sequels_obj || [];
      result.collection = { results: sequels.map(s => KP_PLUGIN.convertElem(s)) };
    }
    if(elem.similars_obj){
      const similars = elem.similars_obj.items || [];
      result.simular = { results: similars.map(s => KP_PLUGIN.convertElem(s)) };
    }
    return result;
  };
  KP_PLUGIN.convertSeason = function(season){
    const episodes = (season.episodes || []).map(e => ({
      season_number: e.seasonNumber,
      episode_number: e.episodeNumber,
      name: e.nameRu || e.nameEn || ('S' + e.seasonNumber + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + e.episodeNumber),
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
  };
  KP_PLUGIN.convertPerson = function(person){
    return {
      id: person.staffId,
      name: person.nameRu || person.nameEn || '',
      url: '',
      img: person.posterUrl || '',
      character: person.description || '',
      job: Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
    };
  };

  // ------------------- Функции получения данных -------------------
  KP_PLUGIN.getList = function(method, params = {}, onComplite, onError){
    let url = method;
    if(params.query){
      const cleanStr = params.query && kpCleanTitle(decodeURIComponent(params.query));
      if(!cleanStr){ onError(); return; }
      url = Lampa.Utils.addUrlComponent(url, 'keyword=' + encodeURIComponent(cleanStr));
    }
    const page = params.page || 1;
    url = Lampa.Utils.addUrlComponent(url, 'page=' + page);
    KP_PLUGIN.getFromCache(url, (json, cached) => {
      let items = [];
      if(json.items && json.items.length) items = json.items;
      else if(json.films && json.films.length) items = json.films;
      else if(json.releases && json.releases.length) items = json.releases;
      if(!cached && items.length) KP_PLUGIN.setCache(url, json);
      const results = items.map(elem => KP_PLUGIN.convertElem(elem)).filter(elem => !elem.adult);
      const totalPages = json.pagesCount || json.totalPages || 1;
      onComplite({ results, url: method, page, total_pages: totalPages, total_results: 0, more: totalPages > page });
    }, onError);
  };
  KP_PLUGIN._getById = function(id, params = {}, onComplite, onError){
    const url = 'api/v2.2/films/' + id;
    const film = KP_PLUGIN.getCache(url);
    if(film){
      setTimeout(() => onComplite(KP_PLUGIN.convertElem(film)), 10);
    } else {
      KP_PLUGIN.get(url, film => {
        if(film.kinopoiskId){
          const type = (!film.type || film.type === 'FILM' || film.type === 'VIDEO') ? 'movie' : 'tv';
          KP_PLUGIN.getCompliteIf(type === 'tv', 'api/v2.2/films/' + id + '/seasons', seasons => {
            film.seasons_obj = seasons;
            KP_PLUGIN.getComplite('api/v2.2/films/' + id + '/distributions', distributions => {
              film.distributions_obj = distributions;
              KP_PLUGIN.getComplite('/api/v1/staff?filmId=' + id, staff => {
                film.staff_obj = staff;
                KP_PLUGIN.getComplite('api/v2.1/films/' + id + '/sequels_and_prequels', sequels => {
                  film.sequels_obj = sequels;
                  KP_PLUGIN.getComplite('api/v2.2/films/' + id + '/similars', similars => {
                    film.similars_obj = similars;
                    KP_PLUGIN.setCache(url, film);
                    onComplite(KP_PLUGIN.convertElem(film));
                  });
                });
              });
            });
          });
        } else onError();
      }, onError);
    }
  };
  KP_PLUGIN.getById = function(id, params = {}, onComplite, onError){
    // Для корректного вызова сначала загружаем меню (если требуется)
    menu(() => {
      KP_PLUGIN._getById(id, params, onComplite, onError);
    });
  };
  KP_PLUGIN.main = function(params = {}, onComplite, onError){
    const partsLimit = 5;
    const partsData = [
      cb => { KP_PLUGIN.getList('api/v2.2/films/top?type=TOP_100_POPULAR_FILMS', params, json => { json.title = Lampa.Lang.translate('title_now_watch'); cb(json); }, cb); },
      cb => { KP_PLUGIN.getList('api/v2.2/films/top?type=TOP_250_BEST_FILMS', params, json => { json.title = Lampa.Lang.translate('title_top_movie'); cb(json); }, cb); },
      cb => { KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&type=FILM', params, json => { json.title = 'Популярные фильмы'; cb(json); }, cb); },
      cb => { KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&type=TV_SERIES', params, json => { json.title = 'Популярные сериалы'; cb(json); }, cb); },
      cb => { KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES', params, json => { json.title = 'Популярные мини-сериалы'; cb(json); }, cb); },
      cb => { KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&type=TV_SHOW', params, json => { json.title = 'Популярные телешоу'; cb(json); }, cb); }
    ];
    function loadPart(loaded, empty){
      Lampa.Api.partNext(partsData, partsLimit, loaded, empty);
    }
    menu(() => {
      const rusId = countries_map['Россия'];
      if(rusId){
        partsData.splice(3, 0, cb => {
          KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&countries=' + rusId + '&type=FILM', params, json => { json.title = 'Популярные российские фильмы'; cb(json); }, cb);
        });
        partsData.splice(5, 0, cb => {
          KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&countries=' + rusId + '&type=TV_SERIES', params, json => { json.title = 'Популярные российские сериалы'; cb(json); }, cb);
        });
        partsData.splice(7, 0, cb => {
          KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&countries=' + rusId + '&type=MINI_SERIES', params, json => { json.title = 'Популярные российские мини-сериалы'; cb(json); }, cb);
        });
      }
      loadPart(onComplite, onError);
    });
    return loadPart;
  };
  
  KP_PLUGIN.category = function(params = {}, onComplite, onError){
    const show = ['movie','tv'].indexOf(params.url) > -1 && !params.genres;
    let books = show ? Lampa.Favorite.continues(params.url) : [];
    books.forEach(elem => { if(!elem.source) elem.source = 'tmdb'; });
    books = books.filter(elem => [KP_PLUGIN.SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1);
    let recomend = show ? Lampa.Arrays.shuffle(Lampa.Recomends.get(params.url)).slice(0,19) : [];
    recomend.forEach(elem => { if(!elem.source) elem.source = 'tmdb'; });
    recomend = recomend.filter(elem => [KP_PLUGIN.SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1);
    const partsLimit = 5;
    const partsData = [
      cb => { cb({ results: books, title: params.url === 'tv' ? Lampa.Lang.translate('title_continue') : Lampa.Lang.translate('title_watched') }); },
      cb => { cb({ results: recomend, title: Lampa.Lang.translate('title_recomend_watch') }); }
    ];
    function loadPart(loaded, empty){
      Lampa.Api.partNext(partsData, partsLimit, loaded, empty);
    }
    menu(() => {
      const priority = ['семейный','детский','короткометражка','мультфильм','аниме'];
      priority.forEach(g => {
        const id = genres_map[g];
        if(id){
          partsData.push(cb => {
            KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&genres=' + id + '&type=' + (params.url === 'tv' ? 'TV_SERIES' : 'FILM'), params, json => {
              json.title = Lampa.Utils.capitalizeFirstLetter(g);
              cb(json);
            }, cb);
          });
        }
      });
      menu_list.forEach(g => {
        if(!g.hide && !g.separator && priority.indexOf(g.title) === -1){
          partsData.push(cb => {
            KP_PLUGIN.getList('api/v2.2/films?order=NUM_VOTE&genres=' + g.id + '&type=' + (params.url === 'tv' ? 'TV_SERIES' : 'FILM'), params, json => {
              json.title = Lampa.Utils.capitalizeFirstLetter(g.title);
              cb(json);
            }, cb);
          });
        }
      });
      loadPart(onComplite, onError);
    });
    return loadPart;
  };
  
  KP_PLUGIN.full = function(params = {}, onComplite, onError){
    let kinopoisk_id = '';
    if(params.card && params.card.source === KP_PLUGIN.SOURCE_NAME){
      if(params.card.kinopoisk_id){
        kinopoisk_id = params.card.kinopoisk_id;
      } else if(startsWith(params.card.id + '', KP_PLUGIN.SOURCE_NAME + '_')){
        kinopoisk_id = (params.card.id + '').substring(KP_PLUGIN.SOURCE_NAME.length + 1);
        params.card.kinopoisk_id = kinopoisk_id;
      }
    }
    if(kinopoisk_id){
      KP_PLUGIN.getById(kinopoisk_id, params, json => {
        const status = new Lampa.Status(4);
        status.onComplite = onComplite;
        status.append('movie', json);
        status.append('persons', json && json.persons);
        status.append('collection', json && json.collection);
        status.append('simular', json && json.similar);
      }, onError);
    } else {
      onError();
    }
  };
  
  KP_PLUGIN.list = function(params = {}, onComplite, onError){
    let method = params.url;
    if(method === '' && params.genres){
      method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
    }
    KP_PLUGIN.getList(method, params, onComplite, onError);
  };
  
  KP_PLUGIN.search = function(params = {}, onComplite){
    const title = decodeURIComponent(params.query || '');
    const status = new Lampa.Status(1);
    status.onComplite = function(data){
      let items = [];
      if(data.query && data.query.results){
        const tmp = data.query.results.filter(elem =>
          containsTitle(elem.title, title) || containsTitle(elem.original_title, title)
        );
        if(tmp.length && tmp.length !== data.query.results.length){
          data.query.results = tmp;
          data.query.more = true;
        }
        const movie = Object.assign({}, data.query);
        movie.results = data.query.results.filter(elem => elem.type === 'movie');
        movie.title = Lampa.Lang.translate('menu_movies');
        movie.type = 'movie';
        if(movie.results.length) items.push(movie);
        const tv = Object.assign({}, data.query);
        tv.results = data.query.results.filter(elem => elem.type === 'tv');
        tv.title = Lampa.Lang.translate('menu_tv');
        tv.type = 'tv';
        if(tv.results.length) items.push(tv);
      }
      onComplite(items);
    };
    KP_PLUGIN.getList('api/v2.1/films/search-by-keyword', params, json => {
      status.append('query', json);
    }, status.error.bind(status));
  };
  
  KP_PLUGIN.discovery = function(){
    return {
      title: KP_PLUGIN.SOURCE_TITLE,
      search: KP_PLUGIN.search,
      params: { align_left: true, object: { source: KP_PLUGIN.SOURCE_NAME } },
      onMore: function(params){
        Lampa.Activity.push({
          url: 'api/v2.1/films/search-by-keyword',
          title: Lampa.Lang.translate('search') + ' - ' + params.query,
          component: 'category_full',
          page: 1,
          query: encodeURIComponent(params.query),
          source: KP_PLUGIN.SOURCE_NAME
        });
      },
      onCancel: KP_PLUGIN.clear.bind(KP_PLUGIN)
    };
  };
  
  KP_PLUGIN.person = function(params = {}, onComplite){
    const status = new Lampa.Status(1);
    status.onComplite = function(data){
      let result = {};
      if(data.query){
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
        let directorFilms = [];
        let directorMap = {};
        let actorFilms = [];
        let actorMap = {};
        if(p.films){
          p.films.forEach(f => {
            if(f.professionKey === 'DIRECTOR' && !directorMap[f.filmId]){
              directorMap[f.filmId] = true;
              directorFilms.push(KP_PLUGIN.convertElem(f));
            } else if(f.professionKey === 'ACTOR' && !actorMap[f.filmId]){
              actorMap[f.filmId] = true;
              actorFilms.push(KP_PLUGIN.convertElem(f));
            }
          });
        }
        let knownFor = [];
        if(directorFilms.length){
          directorFilms.sort((a, b) => (b.vote_average - a.vote_average) || (a.id - b.id));
          knownFor.push({ name: Lampa.Lang.translate('title_producer'), credits: directorFilms });
        }
        if(actorFilms.length){
          actorFilms.sort((a, b) => (b.vote_average - a.vote_average) || (a.id - b.id));
          knownFor.push({ name: Lampa.Lang.translate(p.sex === 'FEMALE' ? 'title_actress' : 'title_actor'), credits: actorFilms });
        }
        result.credits = { knownFor };
      }
      onComplite(result);
    };
    const url = 'api/v1/staff/' + params.id;
    KP_PLUGIN.getFromCache(url, (json, cached) => {
      if(!cached && json.personId) KP_PLUGIN.setCache(url, json);
      status.append('query', json);
    }, status.error.bind(status));
  };
  
  // ------------------- Регистрация плагина в Lampa -------------------
  const ALL_SOURCES = [
    { name: 'tmdb', title: 'TMDB' },
    { name: 'cub', title: 'CUB' },
    { name: 'pub', title: 'PUB' },
    { name: 'filmix', title: 'FILMIX' },
    { name: KP_PLUGIN.SOURCE_NAME, title: KP_PLUGIN.SOURCE_TITLE }
  ];
  
  const originalSource = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ?
    Object.assign({}, Lampa.Params.values.source) : { tmdb: 'TMDB' };
  console.log("Исходный источник сохранён:", originalSource);
  
  function startPlugin(){
    window.kp_source_plugin = true;
    function addPlugin(){
      if(Lampa.Api.sources[KP_PLUGIN.SOURCE_NAME]){
        Lampa.Noty.show("Установлен плагин несовместимый с kp_source");
        return;
      }
      Lampa.Api.sources[KP_PLUGIN.SOURCE_NAME] = KP_PLUGIN;
      Object.defineProperty(Lampa.Api.sources, KP_PLUGIN.SOURCE_NAME, { get: () => KP_PLUGIN });
      let sources;
      if(Lampa.Params.values && Lampa.Params.values['source']){
        sources = Object.assign({}, Lampa.Params.values['source']);
        sources[KP_PLUGIN.SOURCE_NAME] = KP_PLUGIN.SOURCE_TITLE;
      } else {
        sources = {};
        ALL_SOURCES.forEach(s => {
          if(Lampa.Api.sources[s.name]) sources[s.name] = s.title;
        });
      }
      Lampa.Params.select('source', sources, 'tmdb');
    }
    if(window.appready){
      addPlugin();
    } else {
      Lampa.Listener.follow('app', e => { if(e.type === 'ready') addPlugin(); });
    }
  }
  if(!window.kp_source_plugin) startPlugin();
  Lampa.Api.sources[KP_PLUGIN.SOURCE_NAME] = KP_PLUGIN;
  console.log("KP API интегрирован");

})();
