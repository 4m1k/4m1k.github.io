(function(){
  'use strict';

  // Инициализация платформы для ТВ
  Lampa.Platform.tv();

  // Защита консоли (антиотладка)
  (function(func){
    var globalObj;
    try {
      globalObj = Function("return (function() {}.constructor('return this')());")();
    } catch(e) {
      globalObj = window;
    }
    var consoleMethods = ["log", "warn", "info", "error", "exception", "table", "trace"];
    for(var i=0;i<consoleMethods.length;i++){
      var method = consoleMethods[i];
      var original = globalObj.console[method] || function(){};
      globalObj.console[method] = function(){
        original.apply(globalObj.console, arguments);
      };
    }
  }());

  // Объявление объекта для HTTP-запросов и кэширования
  var network = new Lampa.Reguest();
  var cache = {};
  var totalRequests = 0;
  var proxyRequests = 0;
  var goodProxyRequests = 0;

  // Функция get – выполняет запрос с использованием прокси при необходимости
  function get(method, onComplete, onError) {
    var useProxy = totalRequests >= 10 && goodProxyRequests > totalRequests/2;
    if(!useProxy) totalRequests++;
    var baseUrl = "https://kinopoiskapiunofficial.tech/" + method;
    network.timeout(15000);
    network.silent((useProxy ? "https://cors.kp556.workers.dev:8443/" : "") + baseUrl, function(response){
      onComplete(response);
    }, function(error, status){
      useProxy = !useProxy && (proxyRequests < 10 || goodProxyRequests > proxyRequests/2);
      if(useProxy && (error.status == 429 || (error.status == 0 && error.statusText !== "timeout"))){
        proxyRequests++;
        network.timeout(15000);
        network.silent("https://cors.kp556.workers.dev:8443/" + baseUrl, function(response){
          goodProxyRequests++;
          onComplete(response);
        }, onError, false, {
          headers: {
            'X-API-KEY': "2a4a0808-81a3-40ae-b0d3-e11335ede616"
          }
        });
      } else {
        onError(error, status);
      }
    }, false, {
      headers: {
        'X-API-KEY': "2a4a0808-81a3-40ae-b0d3-e11335ede616"
      }
    });
  }

  // Вспомогательные функции для кэширования запросов
  function getCache(key) {
    var entry = cache[key];
    if(entry) {
      var validTime = new Date().getTime() - 3600000; // 1 час
      if(entry.timestamp > validTime) return entry.value;
      // Если запись устарела, очищаем весь кэш
      for(var k in cache) {
        if(!(cache[k] && cache[k].timestamp > validTime))
          delete cache[k];
      }
    }
    return null;
  }
  function setCache(key, value) {
    cache[key] = {
      timestamp: new Date().getTime(),
      value: value
    };
  }
  function getFromCache(key, onComplete, onError) {
    var value = getCache(key);
    if(value) {
      setTimeout(function(){ onComplete(value, true); }, 10);
    } else {
      get(key, onComplete, onError);
    }
  }
  function clear() {
    network.clear();
  }

  // Функция для преобразования объекта фильма/сериала из API Кинопоиска
  // (В данном плагине для Filmix структура данных может быть схожей, поэтому функция convertElem используется для приведения данных к единому виду)
  function convertElem(item) {
    var type = (!item.type || item.type === "FILM" || item.type === "VIDEO") ? "movie" : "tv";
    var kp_id = item.kinopoiskId || item.filmId || 0;
    var rating = +item.rating || +item.ratingKinopoisk || 0;
    var title = item.nameRu || item.nameEn || item.nameOriginal || '';
    var original_title = item.nameOriginal || item.nameEn || item.nameRu || '';
    var adult = false;
    var result = {
      source: "KP",
      type: type,
      adult: false,
      id: "KP_" + kp_id,
      title: title,
      original_title: original_title,
      overview: item.description || item.shortDescription || '',
      img: item.posterUrlPreview || item.posterUrl || '',
      background_image: item.coverUrl || item.posterUrl || item.posterUrlPreview || '',
      genres: item.genres && item.genres.map(function(g){
        if(g.genre === "для взрослых") adult = true;
        return { id: g.genre && genres_map[g.genre] || 0, name: g.genre, url: '' };
      }) || [],
      production_companies: [],
      production_countries: item.countries && item.countries.map(function(c){ return { name: c.country }; }) || [],
      vote_average: rating,
      vote_count: item.ratingVoteCount || item.ratingKinopoiskVoteCount || 0,
      kinopoisk_id: kp_id,
      kp_rating: rating,
      imdb_id: item.imdbId || '',
      imdb_rating: item.ratingImdb || 0
    };
    result.adult = adult;
    var release_date = item.year && item.year !== "null" ? item.year : '';
    if(type === 'tv'){
      if(item.startYear && item.startYear !== "null") release_date = item.startYear;
      if(item.endYear && item.endYear !== "null") result.last_air_date = item.endYear;
      result.first_air_date = release_date;
    } else {
      result.release_date = release_date;
    }
    if(item.seasons_obj) {
      var seasons = item.seasons_obj.items || [];
      result.number_of_seasons = item.seasons_obj.total || seasons.length || 1;
      result.seasons = seasons.map(convertSeason);
      var episodes = 0;
      result.seasons.forEach(function(s){ episodes += s.episode_count; });
      result.number_of_episodes = episodes;
    }
    if(item.staff_obj) {
      var staff = item.staff_obj || [];
      var cast = [];
      var crew = [];
      staff.forEach(function(s){
        var person = {
          id: s.staffId,
          name: s.nameRu || s.nameEn || '',
          url: '',
          img: s.posterUrl || '',
          character: s.description || '',
          job: Lampa.Utils.capitalizeFirstLetter((s.professionKey || '').toLowerCase())
        };
        if(s.professionKey === "ACTOR") cast.push(person); else crew.push(person);
      });
      result.persons = { cast: cast, crew: crew };
    }
    if(item.sequels_obj) {
      result.collection = { results: item.sequels_obj.map(convertElem) };
    }
    if(item.similars_obj) {
      result.simular = { results: item.similars_obj.items.map(convertElem) };
    }
    return result;
  }
  function convertSeason(season) {
    var episodes = season.episodes || [];
    episodes = episodes.map(function(e){
      return {
        season_number: e.seasonNumber,
        episode_number: e.episodeNumber,
        name: e.nameRu || e.nameEn || ("S" + season.number + " / " + Lampa.Lang.translate("torrent_serial_episode") + " " + e.episodeNumber),
        overview: e.synopsis || '',
        air_date: e.releaseDate
      };
    });
    return {
      season_number: season.number,
      episode_count: episodes.length,
      episodes: episodes,
      name: Lampa.Lang.translate("torrent_serial_season") + " " + season.number,
      overview: ""
    };
  }

  // -----------------------------------------------------------------------------------
  // Плагин Filmix
  // -----------------------------------------------------------------------------------
  var Filmix = {
    network: new Lampa.Reguest(),
    // Базовый URL API Filmix – здесь взят дословно из обфусцированного кода
    api_url: "http://filmixapp.cyou/api/v2/",
    // Токен хранится в хранилище, по умолчанию пустая строка
    token: Lampa.Storage.get("filmix_token", ''),
    // Формируем строку с информацией об устройстве и клиенте; здесь добавляем uid
    user_dev: "app_lang=ru_RU&user_dev_apk=2.1.2&user_dev_id=" + Lampa.Utils.uid(16) + "&user_dev_name=Xiaomi&user_dev_os=11&user_dev_vendor=Xiaomi&user_dev_token=",

    // Функция запроса нового кода для авторизации (метод add_new)
    add_new: function(){
      var userCode = "";
      var deviceCode = "";
      var modal_html = $("<div><div class=\"broadcast__text\">" + Lampa.Lang.translate("filmix_modal_text") + "</div><div class=\"broadcast__device selector\" style=\"text-align: center\">Ожидаем код...</div><br><div class=\"broadcast__scan\"><div></div></div></div>");
      Lampa.Modal.open({
        title: "",
        html: modal_html,
        onBack: function(){
          Lampa.Modal.close();
          Lampa.Controller.toggle("settings_component");
          clearInterval(ping_auth);
        },
        onSelect: function(){
          Lampa.Utils.copyTextToClipboard(userCode, function(){
            Lampa.Noty.show(Lampa.Lang.translate("filmix_copy_secuses"));
          }, function(){
            Lampa.Noty.show(Lampa.Lang.translate("filmix_copy_fail"));
          });
        }
      });
      var ping_auth = setInterval(function(){
        Filmix.checkPro(deviceCode, function(resp){
          if(resp && resp.user_data){
            Lampa.Modal.close();
            clearInterval(ping_auth);
            Lampa.Storage.set("filmix_token", deviceCode);
            Filmix.token = deviceCode;
            $("[data-name=\"filmix_token\"] .settings-param__value").text(deviceCode);
            Lampa.Controller.toggle("settings_component");
          }
        });
      }, 2000);
      this.network.clear();
      this.network.timeout(10000);
      this.network.quiet(this.api_url + "token_request?" + this.user_dev, function(response){
        if(response.status === 'ok'){
          deviceCode = response.code;
          userCode = response.user_code;
          modal_html.find(".selector").text(userCode);
        } else {
          Lampa.Noty.show(response);
        }
      }, function(error, status){
        Lampa.Noty.show(Filmix.network.errorDecode(error, status));
      });
    },

    // Функция для построения полного URL запроса к API Filmix с учётом параметров
    buildUrl: function(query) {
      var url = query;
      // Добавляем параметры пользователя и токен в запрос
      url += (this.user_dev + Lampa.Storage.get("filmix_token", "aaaabbbbccccddddeeeeffffaaaabbbb"));
      return this.api_url + url;
    },

    // Функция, выполняющая запрос через native-метод (без обёрток Reguest.silent)
    nativeRequest: function(query, onComplete, onError) {
      var fullUrl = this.buildUrl(query);
      this.network.native(fullUrl, function(response){
        response.url = query;
        onComplete(response);
      }, onError);
    }
  };

  // Дополнительный объект для работы с источниками Pub (если требуется)
  var Pub = {
    network: new Lampa.Reguest()
  };

  // Функция инициализации плагина Filmix
  function startFilmixPlugin() {
    window.plugin_lmp = true;
    var manifest = {};
    Lampa.Manifest.plugins = manifest;

    // Если Lampa.Lang ещё не инициализирован, создаём простой модуль языка
    if (!Lampa.Lang) {
      var lang_data = {};
      Lampa.Lang = {
        add: function(data){ lang_data = data; },
        translate: function(key){ return lang_data[key] ? lang_data[key].ru : key; }
      };
    }

    // Добавляем переводы для плагина Filmix (пример, можно расширять)
    Lampa.Lang.add({
      filmix_modal_text: { ru: "Для авторизации введите код, который будет показан на устройстве." },
      filmix_copy_secuses: { ru: "Код успешно скопирован" },
      filmix_copy_fail: { ru: "Не удалось скопировать код" },
      search: { ru: "Поиск" }
    });

    // Функция инициализации настроек плагина – обновляем список источников
    function initPlugin() {
      Lmp.init();
    }
    if (window.appready) {
      initPlugin();
    } else {
      Lampa.Listener.follow("app", function(e){
        if(e.type === "ready") initPlugin();
      });
    }
    // Регистрируем Filmix как источник
    function addPlugin() {
      if (Lampa.Api.sources.filmix) {
        Lampa.Noty.show("Установлен плагин несовместимый с filmix");
        return;
      }
      Lampa.Api.sources.filmix = Filmix;
      Object.defineProperty(Lampa.Api.sources, "filmix", {
        get: function(){ return Filmix; }
      });
      var sources;
      if (Lampa.Params.values && Lampa.Params.values.source) {
        sources = Object.assign({}, Lampa.Params.values.source);
        sources.filmix = "FILMIX";
      } else {
        sources = { filmix: "FILMIX" };
      }
      Lampa.Params.select("source", sources, "tmdb");
    }
    if (window.appready) {
      addPlugin();
    } else {
      Lampa.Listener.follow("app", function(e){
        if(e.type === "ready") addPlugin();
      });
    }
  }
  if (!window.plugin_lmp) {
    startFilmixPlugin();
  }
  
  // Ниже можно добавить реализацию методов для получения списка фильмов, поиска, получения полной информации и т.д.
  // Например, реализуем метод list, аналогичный плагину KP:
  
  function listFilmix(params, onComplete, onError) {
    // Если передан параметр query, добавляем его в URL
    var endpoint = "films?sort=popular";
    if (params.query) {
      var cleanQuery = decodeURIComponent(params.query).trim();
      endpoint = Lampa.Utils.addUrlComponent(endpoint, "keyword=" + encodeURIComponent(cleanQuery));
    }
    var page = params.page || 1;
    endpoint = Lampa.Utils.addUrlComponent(endpoint, "page=" + page);
    // Выполняем запрос через getFromCache (функции get и setCache уже описаны выше)
    getFromCache(endpoint, function(json, cached){
      var items = [];
      if (json.items && json.items.length) items = json.items;
      else if (json.films && json.films.length) items = json.films;
      // Кэшируем результат, если не из кэша
      if (!cached && items.length) setCache(endpoint, json);
      var results = items.map(convertElem).filter(function(item){ return !item.adult; });
      var totalPages = json.pagesCount || json.totalPages || 1;
      onComplete({
        results: results,
        page: page,
        total_pages: totalPages,
        total_results: 0,
        more: totalPages > page
      });
    }, onError);
  }
  
  // Можно реализовать и другие методы (search, full, person, category, discovery) аналогично,
  // адаптируя URL и параметры для API Filmix.
  
  // Регистрируем дополнительные методы в источнике Filmix
  var FilmixSource = {
    main: function(params, onComplete, onError) {
      listFilmix(params, onComplete, onError);
    },
    menu: function(params, onComplete) {
      // Реализуйте получение фильтров/категорий, например:
      get("films/filters", function(json){
        var menuList = [];
        if (json.genres) {
          json.genres.forEach(function(g){
            menuList.push({
              id: g.id,
              title: g.genre,
              url: '',
              hide: g.genre === "для взрослых",
              separator: !g.genre
            });
            genres_map[g.genre] = g.id;
          });
        }
        if (json.countries) {
          json.countries.forEach(function(c){
            countries_map[c.country] = c.id;
          });
        }
        onComplete(menuList);
      }, function(){
        onComplete([]);
      });
    },
    full: function(params, onComplete, onError) {
      if (params.card && params.card.source === "KP" && params.card.kinopoisk_id) {
        getById(params.card.kinopoisk_id, params, function(json){
          var status = new Lampa.Status(4);
          status.onComplite = onComplete;
          status.append("movie", json);
          status.append("persons", json && json.persons);
          status.append("collection", json && json.collection);
          status.append("simular", json && json.simular);
        }, onError);
      } else {
        onError();
      }
    },
    search: function(params, onComplete, onError) {
      // Пример: поиск по ключевому слову через endpoint search-by-keyword
      get("films/search-by-keyword", params, function(json){
        onComplete(json);
      }, onError);
    },
    person: function(params, onComplete, onError) {
      var url = "persons/" + params.id;
      getFromCache(url, function(json){
        onComplete(json);
      }, onError);
    },
    list: listFilmix,
    category: function(params, onComplete, onError) {
      // Реализуйте получение контента по категории (например, жанр)
      var endpoint = params.url;
      if (endpoint === '' && params.genres) {
        endpoint = "films?sort=popular&genres=" + params.genres;
      }
      getList(endpoint, params, onComplete, onError);
    },
    clear: clear,
    seasons: function(card, seasons, onComplete) {
      // Если есть данные о сезонах, возвращаем их
      var status = new Lampa.Status(seasons.length);
      status.onComplite = onComplete;
      seasons.forEach(function(season){
        var s = card.seasons.filter(function(s){ return s.season_number === season; });
        if (s.length) status.append(""+season, s[0]);
        else status.error();
      });
    },
    discovery: function() {
      return {
        title: "FILMIX",
        search: FilmixSource.search,
        params: { align_left: true, object: { source: "filmix" } },
        onMore: function(params) {
          Lampa.Activity.push({
            url: "films/search-by-keyword",
            title: Lampa.Lang.translate("search") + " - " + params.query,
            component: "category_full",
            page: 1,
            query: encodeURIComponent(params.query),
            source: "filmix"
          });
        },
        onCancel: network.clear.bind(network)
      };
    }
  };

  // Регистрируем источник Filmix в системе Lampa
  Lampa.Api.sources.filmix = FilmixSource;
  Object.defineProperty(Lampa.Api.sources, "filmix", {
    get: function(){ return FilmixSource; }
  });
  var sources = Lampa.Params.values && Lampa.Params.values.source ? Object.assign({}, Lampa.Params.values.source) : {};
  sources.filmix = "FILMIX";
  Lampa.Params.select("source", sources, "tmdb");

  console.log("Filmix plugin source for Lampa loaded.");
})();
