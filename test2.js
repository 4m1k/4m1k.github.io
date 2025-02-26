(function(){
  'use strict';

  // Основной объект плагина Filmix
  var Filmix = {
    SOURCE_NAME: "filmix",
    SOURCE_TITLE: "Filmix",
    // Базовый URL API Filmix – замените на реальный адрес, если требуется
    apiUrl: "https://filmix.ac/api/",
    // Токен для доступа к API (можно сохранить в localStorage)
    token: localStorage.getItem("filmix_token") || "",
    // Идентификатор устройства или версия клиента (если нужно)
    userDevice: localStorage.getItem("filmix_device") || "default",
    // Объект для отправки HTTP-запросов (на основе Lampa.Reguest)
    network: new Lampa.Reguest(),

    // Универсальный метод для отправки запросов к API Filmix
    request: function(endpoint, onComplete, onError, extraHeaders) {
      var url = this.apiUrl + endpoint;
      // Заголовки запроса: обязательно передаём токен и информацию об устройстве
      var headers = {
        "X-API-KEY": this.token,
        "User-Agent": "Lampa/FilmixPlugin"
      };
      if (extraHeaders) {
        Object.assign(headers, extraHeaders);
      }
      this.network.clear();
      this.network.timeout(15000);
      this.network.silent(url, function(response) {
        try {
          var json = JSON.parse(response);
          onComplete(json);
        } catch (e) {
          if (onError) onError(e);
        }
      }, function(error, status) {
        if (onError) onError(error, status);
      }, false, { headers: headers });
    },

    // Получение списка фильмов – здесь можно задать сортировку, фильтры и т.д.
    list: function(params, onComplete, onError) {
      var page = params.page || 1;
      // Пример: получение популярных фильмов (endpoint может быть другим)
      var endpoint = "movies?sort=popular&page=" + page;
      // Если передан жанр или другие параметры, их можно добавить
      if(params.genre) {
        endpoint += "&genre=" + encodeURIComponent(params.genre);
      }
      this.request(endpoint, function(json) {
        var results = [];
        if(json && json.films && json.films.length) {
          results = json.films.map(function(film){
            return Filmix.convertFilm(film);
          });
        }
        onComplete({
          results: results,
          page: page,
          total_pages: json.total_pages || 1,
          more: page < (json.total_pages || 1)
        });
      }, onError);
    },

    // Поиск фильмов по ключевому слову
    search: function(params, onComplete, onError) {
      var query = params.query || "";
      var page = params.page || 1;
      // Предположим, для поиска используется endpoint "search"
      var endpoint = "search?query=" + encodeURIComponent(query) + "&page=" + page;
      this.request(endpoint, function(json) {
        var results = [];
        if(json && json.films && json.films.length) {
          results = json.films.map(function(film){
            return Filmix.convertFilm(film);
          });
        }
        onComplete({
          results: results,
          page: page,
          total_pages: json.total_pages || 1,
          more: page < (json.total_pages || 1)
        });
      }, onError);
    },

    // Получение полной информации о фильме/сериале по ID
    full: function(params, onComplete, onError) {
      var id = params.id;
      if(!id) {
        if(onError) onError("Filmix.full: id не указан");
        return;
      }
      // Предположим, для деталей используется endpoint "films/{id}"
      var endpoint = "films/" + id;
      this.request(endpoint, function(json) {
        onComplete(Filmix.convertFilm(json));
      }, onError);
    },

    // Получение информации о персоне
    person: function(params, onComplete, onError) {
      var id = params.id;
      if(!id) {
        if(onError) onError("Filmix.person: id не указан");
        return;
      }
      var endpoint = "persons/" + id;
      this.request(endpoint, function(json) {
        var person = {
          id: json.id,
          name: json.name,
          img: json.photo || "",
          biography: json.biography || "",
          birthday: json.birthday || "",
          deathday: json.deathday || ""
        };
        onComplete(person);
      }, onError);
    },

    // Функция преобразования данных фильма из API Filmix в стандартную структуру Lampa
    convertFilm: function(film) {
      return {
        id: Filmix.SOURCE_NAME + "_" + film.id,
        source: Filmix.SOURCE_NAME,
        type: (film.type && film.type.toLowerCase() === "series") ? "tv" : "movie",
        title: film.title || "",
        original_title: film.original_title || "",
        overview: film.description || "",
        img: film.poster || "",
        background_image: film.cover || film.poster || "",
        vote_average: film.rating || 0,
        vote_count: film.votes || 0,
        release_date: film.release_date || "",
        genres: film.genres || []
      };
    },

    // Функция для интеграции плагина в настройки интерфейса Lampa
    setupSettings: function() {
      Lampa.SettingsApi.addParam({
        component: "interface",
        param: { name: "filmix_source", type: "toggle", default: true },
        field: {
          name: "Источник Filmix",
          description: "Включить источник Filmix для поиска и просмотра контента"
        },
        onRender: function(element) {
          // Обработка изменения переключателя источника
          setTimeout(function() {
            element.find("input").on("change", function() {
              var state = element.find("input").prop("checked");
              localStorage.setItem("filmix_enabled", state);
              Lampa.Noty.show("Источник Filmix " + (state ? "включен" : "выключен"));
            });
          }, 0);
        }
      });
    },

    // Функция для создания секции Discovery
    discovery: function() {
      return {
        title: Filmix.SOURCE_TITLE,
        search: Filmix.search.bind(Filmix),
        params: {
          align_left: true,
          object: { source: Filmix.SOURCE_NAME }
        },
        onMore: function(params) {
          Lampa.Activity.push({
            url: "search?query=" + encodeURIComponent(params.query),
            title: "Поиск – " + params.query,
            component: "category_full",
            page: 1,
            source: Filmix.SOURCE_NAME
          });
        },
        onCancel: Filmix.network.clear.bind(Filmix.network)
      };
    },

    // Функция получения фильмов по категориям (например, по жанру)
    category: function(params, onComplete, onError) {
      var page = params.page || 1;
      var endpoint = "movies?sort=popular&page=" + page;
      if (params.genre) {
        endpoint += "&genre=" + encodeURIComponent(params.genre);
      }
      this.request(endpoint, function(json) {
        var results = [];
        if(json && json.films && json.films.length) {
          results = json.films.map(Filmix.convertFilm);
        }
        onComplete({
          results: results,
          page: page,
          total_pages: json.total_pages || 1,
          more: page < (json.total_pages || 1)
        });
      }, onError);
    },

    // Метод для очистки текущих запросов
    clear: function() {
      this.network.clear();
    }
  };

  // Интеграция плагина в Lampa: регистрируем Filmix как источник
  Lampa.Api.sources["filmix"] = Filmix;
  Object.defineProperty(Lampa.Api.sources, "filmix", {
    get: function() {
      return Filmix;
    }
  });
  
  // Обновляем настройки источников
  var sources = Lampa.Params.values["source"] || {};
  sources["filmix"] = Filmix.SOURCE_TITLE;
  Lampa.Params.select("source", sources, "tmdb");

  // Инициализация настроек плагина, если приложение уже готово
  if (window.appready) {
    Filmix.setupSettings();
  } else {
    Lampa.Listener.follow("ready", function(e) {
      if (e.type === "ready") Filmix.setupSettings();
    });
  }
  
  // Регистрируем плагин через Lampa.Plugin.add, чтобы его можно было использовать глобально
  Lampa.Plugin.add("filmix", Filmix);
  
  console.log("Filmix plugin source for Lampa loaded.");
})();
