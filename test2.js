(function(){
  // Если плагин уже загружен – не загружаем повторно
  if(window.KPPluginLoaded){
    console.log("KP Plugin уже загружен");
    return;
  }
  window.KPPluginLoaded = true;
  
  'use strict';
  console.log("KP Plugin script loaded");

  // -------------------- Константы и переменные --------------------
  const SOURCE_NAME = 'KP';
  const SOURCE_TITLE = 'KP';
  const CACHE_SIZE = 100;
  const CACHE_TIME = 1000 * 60 * 60; // 1 час

  const network = new Lampa.Reguest();
  const cache = {};
  let totalCount = 0, proxyCount = 0, goodCount = 0;
  const menuList = [];
  const genresMap = {};
  const countriesMap = {};

  // -------------------- Утилиты --------------------
  function startsWith(str, search) {
    return str.lastIndexOf(search, 0) === 0;
  }
  function cleanTitle(str) {
    return str.replace(/[\s.,:;’'`!?]+/g, ' ').trim();
  }
  function kpCleanTitle(str) {
    return cleanTitle(str).replace(/^[ \/\\]+/, '').replace(/[ \/\\]+$/, '');
  }
  function normalizeTitle(str) {
    return cleanTitle(str.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, '-').replace(/ё/g, 'е'));
  }
  function containsTitle(str, title) {
    return typeof str === 'string' && typeof title === 'string' &&
           normalizeTitle(str).includes(normalizeTitle(title));
  }

  // -------------------- Кэширование --------------------
  function getCache(key) {
    const res = cache[key];
    if(res){
      const limit = new Date().getTime() - CACHE_TIME;
      if(res.timestamp > limit) return res.value;
      Object.keys(cache).forEach(id => {
        if(cache[id].timestamp <= limit) delete cache[id];
      });
    }
    return null;
  }
  function setCache(key, value) {
    const timestamp = new Date().getTime();
    if(Object.keys(cache).length >= CACHE_SIZE){
      const limit = timestamp - CACHE_TIME;
      Object.keys(cache).forEach(id => {
        if(cache[id].timestamp <= limit) delete cache[id];
      });
      if(Object.keys(cache).length >= CACHE_SIZE){
        const times = Object.values(cache).map(entry => entry.timestamp).sort((a, b) => a - b);
        const mid = times[Math.floor(times.length/2)];
        Object.keys(cache).forEach(id => {
          if(cache[id].timestamp <= mid) delete cache[id];
        });
      }
    }
    cache[key] = { timestamp, value };
  }
  function getFromCache(method, onComplite, onError) {
    const json = getCache(method);
    if(json){
      setTimeout(() => onComplite(json, true), 10);
    } else {
      get(method, onComplite, onError);
    }
  }
  function clearCache() {
    network.clear();
  }

  // -------------------- Сетевые запросы --------------------
  function get(method, onComplite, onError) {
    let useProxy = totalCount >= 10 && goodCount > totalCount/2;
    if(!useProxy) totalCount++;
    const kpProxy = 'https://cors.kp556.workers.dev:8443/';
    const url = 'https://kinopoiskapiunofficial.tech/' + method;
    network.timeout(15000);
    network.silent((useProxy ? kpProxy : '') + url, function(json){
      onComplite(json);
    }, function(a, c){
      useProxy = !useProxy && (proxyCount < 10 || goodCount > proxyCount/2);
      if(useProxy && (a.status === 429 || (a.status === 0 && a.statusText !== 'timeout'))){
        proxyCount++;
        network.timeout(15000);
        network.silent(kpProxy + url, function(json){
          goodCount++;
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
  function getComplite(method, onComplite) {
    get(method, onComplite, () => onComplite(null));
  }
  function getCompliteIf(condition, method, onComplite) {
    if(condition){
      getComplite(method, onComplite);
    } else {
      setTimeout(() => onComplite(null), 10);
    }
  }

  // -------------------- Преобразование данных --------------------
  function convertElem(elem) {
    const type = (!elem.type || elem.type === 'FILM' || elem.type === 'VIDEO') ? 'movie' : 'tv';
    const kinopoiskId = elem.kinopoiskId || elem.filmId || 0;
    const kpRating = +elem.rating || +elem.ratingKinopoisk || 0;
    const title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
    const originalTitle = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
    let adult = false;
    const result = {
      source: SOURCE_NAME,
      type,
      adult: false,
      id: SOURCE_NAME + '_' + kinopoiskId,
      title,
      original_title: originalTitle,
      overview: elem.description || elem.shortDescription || '',
      img: elem.posterUrlPreview || elem.posterUrl || '',
      background_image: elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
      genres: elem.genres ? elem.genres.map(e => {
        if(e.genre === 'для взрослых') adult = true;
        return { id: (e.genre && genresMap[e.genre]) || 0, name: e.genre, url: '' };
      }) : [],
      production_companies: [],
      production_countries: elem.countries ? elem.countries.map(e => ({ name: e.country })) : [],
      vote_average: kpRating,
      vote_count: elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
      kinopoisk_id: kinopoiskId,
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
      result.seasons = seasons.map(s => convertSeason(s));
      let episodesCount = 0;
      result.seasons.forEach(s => { episodesCount += s.episode_count; });
      result.number_of_episodes = episodesCount;
    }
    if(elem.staff_obj){
      const staff = elem.staff_obj || [];
      const cast = [];
      const crew = [];
      staff.forEach(s => {
        const person = convertPerson(s);
        if(s.professionKey === 'ACTOR') cast.push(person);
        else crew.push(person);
      });
      result.persons = { cast, crew };
    }
    if(elem.sequels_obj){
      const sequels = elem.sequels_obj || [];
      result.collection = { results: sequels.map(s => convertElem(s)) };
    }
    if(elem.similars_obj){
      const similars = elem.similars_obj.items || [];
      result.simular = { results: similars.map(s => convertElem(s)) };
    }
    return result;
  }
  
  function convertSeason(season) {
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
  }
  
  function convertPerson(person) {
    return {
      id: person.staffId,
      name: person.nameRu || person.nameEn || '',
      url: '',
      img: person.posterUrl || '',
      character: person.description || '',
      job: Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
    };
  }

  // -------------------- Функции получения данных --------------------
  function getListData(method, params = {}, onComplite, onError) {
    let url = method;
    if(params.query){
      const cleanTitleStr = params.query && kpCleanTitle(decodeURIComponent(params.query));
      if(!cleanTitleStr){ onError(); return; }
      url = Lampa.Utils.addUrlComponent(url, 'keyword=' + encodeURIComponent(cleanTitleStr));
    }
    const page = params.page || 1;
    url = Lampa.Utils.addUrlComponent(url, 'page=' + page);
    getFromCache(url, (json, cached) => {
      let items = [];
      if(json.items && json.items.length) items = json.items;
      else if(json.films && json.films.length) items = json.films;
      else if(json.releases && json.releases.length) items = json.releases;
      if(!cached && items.length) setCache(url, json);
      const results = items.map(elem => convertElem(elem)).filter(elem => !elem.adult);
      const total_pages = json.pagesCount || json.totalPages || 1;
      onComplite({ results, url: method, page, total_pages, total_results: 0, more: total_pages > page });
    }, onError);
  }
  
  function _getById(id, params = {}, onComplite, onError) {
    const url = 'api/v2.2/films/' + id;
    const film = getCache(url);
    if(film){
      setTimeout(() => onComplite(convertElem(film)), 10);
    } else {
      get(url, film => {
        if(film.kinopoiskId){
          const type = (!film.type || film.type === 'FILM' || film.type === 'VIDEO') ? 'movie' : 'tv';
          getCompliteIf(type === 'tv', 'api/v2.2/films/' + id + '/seasons', seasons => {
            film.seasons_obj = seasons;
            getComplite('api/v2.2/films/' + id + '/distributions', distributions => {
              film.distributions_obj = distributions;
              getComplite('/api/v1/staff?filmId=' + id, staff => {
                film.staff_obj = staff;
                getComplite('api/v2.1/films/' + id + '/sequels_and_prequels', sequels => {
                  film.sequels_obj = sequels;
                  getComplite('api/v2.2/films/' + id + '/similars', similars => {
                    film.similars_obj = similars;
                    setCache(url, film);
                    onComplite(convertElem(film));
                  });
                });
              });
            });
          });
        } else {
          onError();
        }
      }, onError);
    }
  }
  
  function getById(id, params = {}, onComplite, onError) {
    // Перед запросом ждём, пока меню загрузится (для перехода в карточку)
    menu({}, () => {
      _getById(id, params, onComplite, onError);
    });
  }
  
  function main(params = {}, onComplite, onError) {
    const partsLimit = 5;
    const partsData = [
      cb => { getListData('api/v2.2/films/top?type=TOP_100_POPULAR_FILMS', params, json => { json.title = Lampa.Lang.translate('title_now_watch'); cb(json); }, cb); },
      cb => { getListData('api/v2.2/films/top?type=TOP_250_BEST_FILMS', params, json => { json.title = Lampa.Lang.translate('title_top_movie'); cb(json); }, cb); },
      cb => { getListData('api/v2.2/films?order=NUM_VOTE&type=FILM', params, json => { json.title = 'Популярные фильмы'; cb(json); }, cb); },
      cb => { getListData('api/v2.2/films?order=NUM_VOTE&type=TV_SERIES', params, json => { json.title = 'Популярные сериалы'; cb(json); }, cb); },
      cb => { getListData('api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES', params, json => { json.title = 'Популярные мини-сериалы'; cb(json); }, cb); },
      cb => { getListData('api/v2.2/films?order=NUM_VOTE&type=TV_SHOW', params, json => { json.title = 'Популярные телешоу'; cb(json); }, cb); }
    ];
  
    function loadPart(loaded, empty) {
      Lampa.Api.partNext(partsData, partsLimit, loaded, empty);
    }
  
    menu({}, () => {
      const rusId = countriesMap['Россия'];
      if(rusId){
        partsData.splice(3, 0, cb => {
          getListData('api/v2.2/films?order=NUM_VOTE&countries=' + rusId + '&type=FILM', params, json => { json.title = 'Популярные российские фильмы'; cb(json); }, cb);
        });
        partsData.splice(5, 0, cb => {
          getListData('api/v2.2/films?order=NUM_VOTE&countries=' + rusId + '&type=TV_SERIES', params, json => { json.title = 'Популярные российские сериалы'; cb(json); }, cb);
        });
        partsData.splice(7, 0, cb => {
          getListData('api/v2.2/films?order=NUM_VOTE&countries=' + rusId + '&type=MINI_SERIES', params, json => { json.title = 'Популярные российские мини-сериалы'; cb(json); }, cb);
        });
      }
      loadPart(onComplite, onError);
    });
    return loadPart;
  }
  
  function category(params = {}, onComplite, onError) {
    const show = ['movie','tv'].includes(params.url) && !params.genres;
    let books = show ? Lampa.Favorite.continues(params.url) : [];
    books.forEach(elem => { if(!elem.source) elem.source = 'tmdb'; });
    books = books.filter(elem => [SOURCE_NAME, 'tmdb', 'cub'].includes(elem.source));
    let recomend = show ? Lampa.Arrays.shuffle(Lampa.Recomends.get(params.url)).slice(0, 19) : [];
    recomend.forEach(elem => { if(!elem.source) elem.source = 'tmdb'; });
    recomend = recomend.filter(elem => [SOURCE_NAME, 'tmdb', 'cub'].includes(elem.source));
  
    const partsLimit = 5;
    const partsData = [
      cb => { cb({ results: books, title: params.url === 'tv' ? Lampa.Lang.translate('title_continue') : Lampa.Lang.translate('title_watched') }); },
      cb => { cb({ results: recomend, title: Lampa.Lang.translate('title_recomend_watch') }); }
    ];
  
    function loadPart(loaded, empty) {
      Lampa.Api.partNext(partsData, partsLimit, loaded, empty);
    }
  
    menu({}, () => {
      const priority = ['семейный','детский','короткометражка','мультфильм','аниме'];
      priority.forEach(g => {
        const id = genresMap[g];
        if(id){
          partsData.push(cb => {
            getListData('api/v2.2/films?order=NUM_VOTE&genres=' + id + '&type=' + (params.url === 'tv' ? 'TV_SERIES' : 'FILM'), params, json => {
              json.title = Lampa.Utils.capitalizeFirstLetter(g);
              cb(json);
            }, cb);
          });
        }
      });
      menuList.forEach(g => {
        if(!g.hide && !g.separator && !priority.includes(g.title)){
          partsData.push(cb => {
            getListData('api/v2.2/films?order=NUM_VOTE&genres=' + g.id + '&type=' + (params.url === 'tv' ? 'TV_SERIES' : 'FILM'), params, json => {
              json.title = Lampa.Utils.capitalizeFirstLetter(g.title);
              cb(json);
            }, cb);
          });
        }
      });
      loadPart(onComplite, onError);
    });
    return loadPart;
  }
  
  function full(params = {}, onComplite, onError) {
    let kinopoisk_id = '';
    if(params.card && params.card.source === SOURCE_NAME){
      if(params.card.kinopoisk_id){
        kinopoisk_id = params.card.kinopoisk_id;
      } else if(startsWith(params.card.id + '', SOURCE_NAME + '_')){
        kinopoisk_id = (params.card.id + '').substring(SOURCE_NAME.length + 1);
        params.card.kinopoisk_id = kinopoisk_id;
      }
    }
    if(kinopoisk_id){
      getById(kinopoisk_id, params, json => {
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
  }
  
  function list(params = {}, onComplite, onError) {
    let method = params.url;
    if(method === '' && params.genres){
      method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
    }
    getListData(method, params, onComplite, onError);
  }
  
  function search(params = {}, onComplite) {
    const title = decodeURIComponent(params.query || '');
    const status = new Lampa.Status(1);
    status.onComplite = function(data) {
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
    getListData('api/v2.1/films/search-by-keyword', params, json => {
      status.append('query', json);
    }, status.error.bind(status));
  }
  
  function discovery() {
    return {
      title: SOURCE_TITLE,
      search: search,
      params: { align_left: true, object: { source: SOURCE_NAME } },
      onMore: function(params) {
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
  
  function person(params = {}, onComplite) {
    const status = new Lampa.Status(1);
    status.onComplite = function(data) {
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
              directorFilms.push(convertElem(f));
            } else if(f.professionKey === 'ACTOR' && !actorMap[f.filmId]){
              actorMap[f.filmId] = true;
              actorFilms.push(convertElem(f));
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
    getFromCache(url, (json, cached) => {
      if(!cached && json.personId) setCache(url, json);
      status.append('query', json);
    }, status.error.bind(status));
  }
  
  // -------------------- Объединяем объект KP для Lampa --------------------
  const KP = {
    SOURCE_NAME,
    SOURCE_TITLE,
    main: main,
    menu: menu,
    full: full,
    list: list,
    category: category,
    clear: clearCache,
    person: person,
    seasons: seasons,           // функция seasons должна быть определена, если не нужна – верните пустой массив через menuCategory
    menuCategory: function(params, onComplite){ onComplite([]); },
    discovery: discovery,
    search: search
  };
  
  const ALL_SOURCES = [
    { name: 'tmdb', title: 'TMDB' },
    { name: 'cub', title: 'CUB' },
    { name: 'pub', title: 'PUB' },
    { name: 'filmix', title: 'FILMIX' },
    { name: KP.SOURCE_NAME, title: KP.SOURCE_TITLE }
  ];
  
  // -------------------- Регистрация плагина --------------------
  function startPlugin() {
    window.kp_source_plugin = true;
    function addPlugin() {
      if(Lampa.Api.sources[KP.SOURCE_NAME]){
        Lampa.Noty.show('Установлен плагин несовместимый с kp_source');
        return;
      }
      Lampa.Api.sources[KP.SOURCE_NAME] = KP;
      Object.defineProperty(Lampa.Api.sources, KP.SOURCE_NAME, { get: () => KP });
      let sources;
      if(Lampa.Params.values && Lampa.Params.values['source']){
        sources = Object.assign({}, Lampa.Params.values['source']);
        sources[KP.SOURCE_NAME] = KP.SOURCE_TITLE;
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
  Lampa.Api.sources.KP = KP;
  console.log("KP API интегрирован");
  
  // -------------------- Добавление кнопки "Кинопоиск" в меню --------------------
  function kp_loadCountryId(callback) {
    try {
      get('api/v2.2/films/filters', json => {
        if(json && json.countries){
          json.countries.forEach(c => {
            if(c.country.toLowerCase() === 'россия'){
              countriesMap[c.country] = c.id;
            }
          });
        }
        console.log("ID России:", countriesMap['Россия'] || '225');
        if(callback) callback();
      }, () => { console.error("Не удалось загрузить фильтры для страны"); if(callback) callback(); });
    } catch(e) {
      console.error("Ошибка в kp_loadCountryId:", e);
      if(callback) callback();
    }
  }
  
  function addKPButton() {
    const menuEl = Lampa.Menu.render();
    if(!menuEl || !menuEl.length){
      console.error("Меню не найдено, повторная попытка через 1000 мс");
      setTimeout(addKPButton, 1000);
      return;
    }
    if(menuEl.find('[data-action="kp"]').length){
      console.log('Кнопка "Кинопоиск" уже добавлена');
      return;
    }
    console.log("Меню найдено, добавляем кнопку Кинопоиск");
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
    kpButton.on('click', () => {
      console.log("Нажата кнопка Кинопоиск");
      kp_loadCountryId(() => {
        if(typeof Lampa.Select !== 'undefined' && typeof Lampa.Select.show === 'function'){
          Lampa.Select.show({
            title: "Кинопоиск",
            items: [
              { title: 'Популярные Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_100_POPULAR_FILMS' } },
              { title: 'Топ Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS' } },
              { title: 'Российские Фильмы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=FILM&countries=' + (countriesMap['Россия'] || '225') } },
              { title: 'Российские Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES&countries=' + (countriesMap['Россия'] || '225') } },
              { title: 'Популярные Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES' } },
              { title: 'Популярные Телешоу', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW' } }
            ],
            onSelect: item => {
              console.log("Выбран пункт:", item);
              Lampa.Activity.push({
                url: item.data.url,
                title: item.title,
                component: "category_full",
                source: SOURCE_NAME,
                card_type: true,
                page: 1,
                onBack: () => {
                  if(originalSource) Lampa.Params.select("source", originalSource);
                  Lampa.Controller.toggle("menu");
                }
              });
            },
            onBack: () => {
              if(originalSource) Lampa.Params.select("source", originalSource);
              Lampa.Controller.toggle("menu");
            }
          });
          console.log("Окно выбора категорий открыто");
        } else {
          console.error("Lampa.Select.show недоступен");
        }
      });
    });
    const tvItem = menuEl.find('[data-action="tv"]');
    if(tvItem.length){
      tvItem.after(kpButton);
      console.log("Кнопка Кинопоиск добавлена после элемента TV");
    } else {
      menuEl.append(kpButton);
      console.log("Кнопка Кинопоиск добавлена в конец меню");
    }
  }
  Lampa.Listener.follow('app', e => { if(e.type === 'ready') addKPButton(); });
  
  // -------------------- Сохранение исходного источника --------------------
  const originalSource = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ?
    Object.assign({}, Lampa.Params.values.source) : { tmdb: 'TMDB' };
  console.log("Исходный источник сохранён:", originalSource);
  
  // -------------------- Регистрация плагина --------------------
  function startPlugin() {
    window.kp_source_plugin = true;
    function addPlugin() {
      if(Lampa.Api.sources[SOURCE_NAME]){
        Lampa.Noty.show("Установлен плагин несовместимый с kp_source");
        return;
      }
      Lampa.Api.sources[SOURCE_NAME] = KP;
      Object.defineProperty(Lampa.Api.sources, SOURCE_NAME, { get: () => KP });
      let sources;
      if(Lampa.Params.values && Lampa.Params.values['source']){
        sources = Object.assign({}, Lampa.Params.values['source']);
        sources[SOURCE_NAME] = SOURCE_TITLE;
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
  Lampa.Api.sources[SOURCE_NAME] = KP;
  console.log("KP API интегрирован");

  // -------------------- Функции-контейнеры для Lampa --------------------
  // (main, full, list, category, search, discovery, person, menu, seasons, menuCategory)
  // В данном примере функции main, full, list, category, search, discovery и person определены выше.
  // Если какая-либо функция (например, seasons или menuCategory) не требуется, можно вернуть пустой результат.
  
  // Объект плагина для регистрации в Lampa:
  const KP = {
    SOURCE_NAME,
    SOURCE_TITLE,
    main,
    menu,
    full,
    list,
    category,
    clear: clearCache,
    person,
    seasons: seasons, // если функция seasons не нужна, можно заменить на: () => { },
    menuCategory: function(params, onComplite){ onComplite([]); },
    discovery,
    search
  };
  
  const ALL_SOURCES = [
    { name: 'tmdb', title: 'TMDB' },
    { name: 'cub', title: 'CUB' },
    { name: 'pub', title: 'PUB' },
    { name: 'filmix', title: 'FILMIX' },
    { name: KP.SOURCE_NAME, title: KP.SOURCE_TITLE }
  ];
  
  // Функции main, category, full, list, search, discovery, person и т.д. определены выше (см. соответствующие блоки)
  
})();
