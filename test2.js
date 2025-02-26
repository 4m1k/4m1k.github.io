(function(){
  'use strict';

  // Инициализация платформы для ТВ
  Lampa.Platform.tv();

  // Отключаем вывод в консоль (можно убрать для отладки)
  (function(){
      var methods = ["log", "warn", "info", "error"];
      methods.forEach(function(method){
          console[method] = function(){};
      });
  }());

  // Объект для выполнения HTTP-запросов и кэширования результатов
  var network = new Lampa.Reguest();
  var cache = {};

  // Функция запроса с кэшированием
  function getFromCache(query, onComplete, onError) {
      var key = query;
      if(cache[key]){
          // Если результат уже в кэше – возвращаем его через 10 мс
          setTimeout(function(){
              onComplete(cache[key], true);
          }, 10);
          return;
      }
      var fullUrl = Filmix.buildUrl(query);
      network.timeout(15000);
      network.silent(fullUrl, function(response){
          try {
              var json = JSON.parse(response);
              // Кэшируем результат (здесь можно добавить логику очистки по времени)
              cache[key] = json;
              onComplete(json);
          } catch(e) {
              onError(e);
          }
      }, onError);
  }

  // Функция очистки кэша и отмены запросов
  function clearCache(){
      cache = {};
      network.clear();
  }

  // Основной объект плагина Filmix с настройками
  var Filmix = {
      // Базовый URL API
      api_url: "http://filmixapp.cyou/api/v2/",
      // Параметры устройства (значения, взятые из консоли)
      user_dev: "app_lang=ru_RU&user_dev_apk=2.2.0&user_dev_id=HQaP2piPG5s2NLRP&user_dev_name=Xiaomi&user_dev_os=11&user_dev_vendor=Xiaomi&user_dev_token=",
      // Формирует полный URL запроса, добавляя параметры устройства
      buildUrl: function(query) {
          var sep = query.indexOf('?') === -1 ? '?' : '&';
          return this.api_url + query + sep + this.user_dev;
      },
      // Пример нативного запроса (если потребуется использовать другой метод запроса)
      nativeRequest: function(query, onComplete, onError) {
          var url = this.buildUrl(query);
          network.native(url, function(response){
              response.url = query;
              onComplete(response);
          }, onError);
      }
  };

  // Функция преобразования элемента (фильм/сериал) из формата API Filmix в формат Lampa
  function convertElem(item) {
      // Если объект last_episode пустой, считаем, что это фильм; иначе – сериал
      var type = (item.last_episode && Object.keys(item.last_episode).length) ? "tv" : "movie";
      return {
          source: "Filmix",
          type: type,
          id: "FMX_" + item.id,
          title: item.title || "",
          original_title: item.original_title || "",
          overview: item.additional || "",
          img: item.poster ? item.poster.replace("http://", "https://") : "",
          vote_average: item.rating || 0,
          year: item.year || "",
          countries: item.countries || [],
          genres: item.categories || []
      };
  }

  // Метод для получения «топовых просмотров»
  function listTopViews(params, onComplete, onError) {
      var page = params.page || 1;
      var query = "top_views?page=" + page;
      getFromCache(query, function(json, cached){
          var items = json instanceof Array ? json : [];
          var results = items.map(convertElem);
          onComplete({
              results: results,
              page: page,
              more: results.length > 0
          });
      }, onError);
  }

  // Метод для получения каталога с сортировкой и фильтром
  function listCatalog(params, onComplete, onError) {
      var page = params.page || 1;
      var orderby = params.orderby || "date";
      var orderdir = params.orderdir || "desc";
      var query = "catalog?orderby=" + orderby + "&orderdir=" + orderdir + "&page=" + page;
      if(params.filter) query += "&filter=" + params.filter;
      getFromCache(query, function(json, cached){
          // API может возвращать либо массив, либо объект с полем items
          var items = json instanceof Array ? json : (json.items || []);
          var results = items.map(convertElem);
          var total_pages = json.pagesCount || 1;
          onComplete({
              results: results,
              page: page,
              total_pages: total_pages,
              more: total_pages > page
          });
      }, onError);
  }

  // Пример метода для поиска фильмов
  function searchFilms(params, onComplete, onError) {
      var queryText = encodeURIComponent(params.search || "");
      var page = params.page || 1;
      var query = "search?query=" + queryText + "&page=" + page;
      getFromCache(query, function(json, cached){
          var items = json instanceof Array ? json : (json.items || []);
          var results = items.map(convertElem);
          var total_pages = json.pagesCount || 1;
          onComplete({
              results: results,
              page: page,
              total_pages: total_pages,
              more: total_pages > page
          });
      }, onError);
  }

  // Пример метода получения подробной информации о фильме
  function filmDetails(id, onComplete, onError) {
      // Убираем префикс "FMX_" из id
      var filmId = id.replace("FMX_", "");
      // Предположим, что подробная информация доступна по endpoint "post?id="
      var query = "post?id=" + filmId;
      getFromCache(query, function(json, cached){
          // json содержит подробные данные; дополняем данные элементом
          var data = convertElem(json);
          data.actors = json.actors || [];
          data.overview = json.description || "";
          // Можно добавить обработку дополнительных полей
          onComplete(data);
      }, onError);
  }

  // Объект источника Filmix для Lampa
  var FilmixSource = {
      // Метод main возвращает «топовые просмотры»
      main: function(params, onComplete, onError) {
          listTopViews(params, onComplete, onError);
      },
      // Метод list возвращает каталог с сортировками и фильтрами
      list: function(params, onComplete, onError) {
          listCatalog(params, onComplete, onError);
      },
      // Метод search для поиска фильмов
      search: function(params, onComplete, onError) {
          searchFilms(params, onComplete, onError);
      },
      // Метод full возвращает подробную информацию о фильме
      full: function(params, onComplete, onError) {
          filmDetails(params.id, onComplete, onError);
      },
      // Метод очистки кэша и запросов
      clear: clearCache
  };

  // Регистрируем источник Filmix в системе Lampa
  Lampa.Api.sources.filmix = FilmixSource;
  Object.defineProperty(Lampa.Api.sources, "filmix", {
      get: function(){ return FilmixSource; }
  });

  // Добавляем источник в настройки (если нужно выбрать источник по умолчанию)
  var sources = Lampa.Params.values && Lampa.Params.values.source ?
                Object.assign({}, Lampa.Params.values.source) : {};
  sources.filmix = "FILMIX";
  Lampa.Params.select("source", sources, "tmdb");

  console.log("Filmix plugin for Lampa loaded.");

  // Если требуется выполнить дополнительные действия после готовности приложения
  Lampa.Listener.follow("app", function(e){
      if(e.type === "ready"){
          // Здесь можно добавить инициализацию, если нужно
      }
  });

})();
