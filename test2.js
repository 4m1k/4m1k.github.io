(function() {
  'use strict';

  // Общие переменные и настройки кэша
  var network = new Lampa.Reguest();
  var cache = {};
  var CACHE_SIZE = 100;
  var CACHE_TIME = 1000 * 60 * 60; // 1 час

  // Функция для выполнения HTTP-запроса с выбором источника
  function getRequest(source, method, onComplete, onError) {
    var baseUrl, headers = {};
    // Настраиваем URL и заголовки в зависимости от источника
    if (source === 'KP') {
      baseUrl = 'https://kinopoiskapiunofficial.tech/';
      headers['X-API-KEY'] = '2a4a0808-81a3-40ae-b0d3-e11335ede616';
    } else if (source === 'FILMIX') {
      // Пример – нужно указать настоящий базовый URL и, если требуется, ключ API для Filmix
      baseUrl = 'https://api.filmix.ac/';
    }
    var url = baseUrl + method;
    network.timeout(15000);
    network.silent(url, function(json) {
      onComplete(json);
    }, function(a, c) {
      onError(a, c);
    }, false, {
      headers: headers
    });
  }

  // Простая реализация кэширования
  function getCache(key) {
    var res = cache[key];
    if (res) {
      if (new Date().getTime() - res.timestamp < CACHE_TIME) return res.value;
      else delete cache[key];
    }
    return null;
  }
  function setCache(key, value) {
    cache[key] = {
      timestamp: new Date().getTime(),
      value: value
    };
  }

  // Общая функция, сначала проверяющая кэш, затем выполняющая запрос
  function getFromCache(source, method, onComplete, onError) {
    var cacheKey = method + '_' + source;
    var json = getCache(cacheKey);
    if (json) {
      setTimeout(function() {
        onComplete(json, true);
      }, 10);
    } else {
      getRequest(source, method, function(json) {
        if (json) setCache(cacheKey, json);
        onComplete(json);
      }, onError);
    }
  }

  // Универсальная функция для преобразования полученного элемента в нужный формат
  function convertElem(elem, source) {
    // Определяем тип: если отсутствует или равен FILM/VIDEO – это фильм, иначе tv-сериал
    var type = !elem.type || elem.type === 'FILM' || elem.type === 'VIDEO' ? 'movie' : 'tv';
    // Идентификатор – для KP это может быть kinopoiskId или filmId, для Filmix может быть другое поле
    var id = elem.kinopoiskId || elem.filmId || elem.id || 0;
    var title = elem.nameRu || elem.nameEn || elem.title || '';
    var original_title = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
    var img = elem.posterUrlPreview || elem.posterUrl || elem.image || '';
    return {
      source: source,
      type: type,
      adult: false,
      id: source + '_' + id,
      title: title,
      original_title: original_title,
      overview: elem.description || elem.shortDescription || '',
      img: img,
      background_image: elem.coverUrl || img,
      // Дополнительно можно добавить поля рейтингов, даты выхода и т.д.
      vote_average: +elem.rating || 0,
      kinopoisk_id: id
    };
  }

  // Функция для получения "топ" фильмов – используется в методе main
  function main(source, params, onComplete, onError) {
    var method;
    if (source === 'KP') {
      method = 'api/v2.2/films/top?type=TOP_100_POPULAR_FILMS';
    } else if (source === 'FILMIX') {
      // Пример: условный эндпоинт для Filmix – замените на реальный
      method = 'films/top/popular';
    }
    getFromCache(source, method, function(json, cached) {
      var items = [];
      if (json) {
        if (json.items && json.items.length) items = json.items;
        else if (json.films && json.films.length) items = json.films;
      }
      var results = items.map(function(elem) {
        return convertElem(elem, source);
      });
      onComplete({
        results: results,
        source: source
      });
    }, onError);
  }

  // Функция получения детальной информации о фильме/сериале
  function full(source, id, params, onComplete, onError) {
    var method;
    if (source === 'KP') {
      method = 'api/v2.2/films/' + id;
    } else if (source === 'FILMIX') {
      // Пример: условный эндпоинт для деталей Filmix
      method = 'film/' + id;
    }
    getFromCache(source, method, function(json) {
      if (json) onComplete(convertElem(json, source));
      else onError();
    }, onError);
  }

  // Функция для получения списка фильмов/сериалов (категории)
  function list(source, params, onComplete, onError) {
    var method;
    if (source === 'KP') {
      method = params.url || 'api/v2.2/films?order=NUM_VOTE&type=FILM';
    } else if (source === 'FILMIX') {
      // Пример: условный эндпоинт для списка в Filmix
      method = params.url || 'films/list?sort=rating';
    }
    getFromCache(source, method, function(json) {
      var items = [];
      if (json && json.items && json.items.length) items = json.items;
      var results = items.map(function(elem) {
        return convertElem(elem, source);
      });
      onComplete({
        results: results,
        source: source
      });
    }, onError);
  }

  // Функция поиска по ключевому слову
  function search(source, params, onComplete, onError) {
    var query = encodeURIComponent(params.query || '');
    var method;
    if (source === 'KP') {
      method = 'api/v2.1/films/search-by-keyword?keyword=' + query;
    } else if (source === 'FILMIX') {
      // Пример: условный эндпоинт поиска для Filmix
      method = 'films/search?query=' + query;
    }
    getFromCache(source, method, function(json) {
      var items = [];
      if (json && json.items && json.items.length) items = json.items;
      var results = items.map(function(elem) {
        return convertElem(elem, source);
      });
      onComplete({
        results: results,
        source: source
      });
    }, onError);
  }

  // Функция получения информации о персоне (актере/режиссёре)
  function person(source, params, onComplete, onError) {
    var id = params.id;
    var method;
    if (source === 'KP') {
      method = 'api/v1/staff/' + id;
    } else if (source === 'FILMIX') {
      // Пример: условный эндпоинт для персоны Filmix
      method = 'person/' + id;
    }
    getFromCache(source, method, function(json) {
      onComplete(json); // можно добавить преобразование
    }, onError);
  }

  // Если для ТВ-сериалов требуются сезоны – можно оставить общую реализацию
  function seasons(source, tv, from, onComplete) {
    // Предполагаем, что данные о сезонах уже находятся в объекте tv
    onComplete(tv.seasons || []);
  }

  // Определяем объект для источника Кинопоиска (KP)
  var KP = {
    SOURCE_NAME: 'KP',
    SOURCE_TITLE: 'Кинопоиск',
    main: function(params, onComplete, onError) {
      main('KP', params, onComplete, onError);
    },
    full: function(id, params, onComplete, onError) {
      full('KP', id, params, onComplete, onError);
    },
    list: function(params, onComplete, onError) {
      list('KP', params, onComplete, onError);
    },
    search: function(params, onComplete, onError) {
      search('KP', params, onComplete, onError);
    },
    person: function(params, onComplete, onError) {
      person('KP', params, onComplete, onError);
    },
    seasons: seasons,
    clear: function() {
      network.clear();
    },
    discovery: function() {
      return {
        title: this.SOURCE_TITLE,
        search: this.search,
        onMore: function(params) {
          Lampa.Activity.push({
            url: 'api/v2.1/films/search-by-keyword',
            title: 'Поиск - ' + params.query,
            component: 'category_full',
            page: 1,
            query: encodeURIComponent(params.query),
            source: 'KP'
          });
        },
        onCancel: network.clear.bind(network)
      };
    }
  };

  // Определяем объект для источника Filmix
  var FILMIX = {
    SOURCE_NAME: 'FILMIX',
    SOURCE_TITLE: 'Filmix',
    main: function(params, onComplete, onError) {
      main('FILMIX', params, onComplete, onError);
    },
    full: function(id, params, onComplete, onError) {
      full('FILMIX', id, params, onComplete, onError);
    },
    list: function(params, onComplete, onError) {
      list('FILMIX', params, onComplete, onError);
    },
    search: function(params, onComplete, onError) {
      search('FILMIX', params, onComplete, onError);
    },
    person: function(params, onComplete, onError) {
      person('FILMIX', params, onComplete, onError);
    },
    seasons: seasons,
    clear: function() {
      network.clear();
    },
    discovery: function() {
      return {
        title: this.SOURCE_TITLE,
        search: this.search,
        onMore: function(params) {
          Lampa.Activity.push({
            url: 'films/search',
            title: 'Поиск - ' + params.query,
            component: 'category_full',
            page: 1,
            query: encodeURIComponent(params.query),
            source: 'FILMIX'
          });
        },
        onCancel: network.clear.bind(network)
      };
    }
  };

  // Регистрация обоих источников в Lampa.Api.sources
  if (!window.Lampa) window.Lampa = {};
  if (!Lampa.Api) Lampa.Api = {};
  if (!Lampa.Api.sources) Lampa.Api.sources = {};

  Lampa.Api.sources[KP.SOURCE_NAME] = KP;
  Lampa.Api.sources[FILMIX.SOURCE_NAME] = FILMIX;

  // Обновляем список источников для настроек (если используется Lampa.Params.select)
  var ALL_SOURCES = [
    { name: 'tmdb', title: 'TMDB' },
    { name: 'cub', title: 'CUB' },
    { name: 'pub', title: 'PUB' },
    { name: 'FILMIX', title: 'Filmix' },
    { name: 'KP', title: 'Кинопоиск' }
  ];
  if (Lampa.Params && Lampa.Params.select) {
    var sources = {};
    ALL_SOURCES.forEach(function(s) {
      if (Lampa.Api.sources[s.name]) sources[s.name] = s.title;
    });
    Lampa.Params.select('source', sources, 'tmdb');
  }

  // Автоподключение плагина, если он еще не зарегистрирован
  if (!window.kp_source_plugin) {
    window.kp_source_plugin = true;
    Lampa.Noty.show('Плагин источников (Кинопоиск и Filmix) успешно загружен');
  }
  
})();
