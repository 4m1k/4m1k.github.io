(function () {
  'use strict';

  Lampa.Platform.tv();

  function overrideConsole() {
    var globalEnv;
    try {
      globalEnv = Function("return (function() {}.constructor('return this')());")();
    } catch (error) {
      globalEnv = window;
    }
    
    var logMethods = ["log", "warn", "info", "error", "exception", "table", "trace"];
    var logConsole = globalEnv.console = globalEnv.console || {};

    logMethods.forEach(function (method) {
      var defaultLogMethod = logConsole[method] || function () {};
      logConsole[method] = function () {
        return defaultLogMethod.apply(logConsole, arguments);
      };
    });
  }
  
  overrideConsole();

  var menuCategories = [
    { title: "Русские фильмы", url: "?cat=movie&airdate=2023-2025&without_genres=16&language=ru", icon: "<svg viewBox='0 0 48 48'><path d='M12 4h24v40H12z'/></svg>" },
    { title: "Русские сериалы", url: "discover/tv?&with_original_language=ru", icon: "<svg viewBox='0 0 48 48'><circle cx='24' cy='24' r='20'/></svg>" },
    { title: "Русские мультфильмы", url: "?cat=movie&airdate=2020-2025&genre=16&language=ru", icon: "<svg viewBox='0 0 48 48'><polygon points='24,4 44,44 4,44'/></svg>" },
    { title: "Okko", url: "discover/tv?network=3871", icon: "<svg viewBox='0 0 48 48'><path d='M8 8h32v32H8z'/></svg>" },
    { title: "КиноПоиск", url: "discover/tv?network=3502", icon: "<svg viewBox='0 0 48 48'><path d='M24 4L44 24 24 44 4 24z'/></svg>" },
    { title: "Wink", url: "discover/tv?network=5024", icon: "<svg viewBox='0 0 48 48'><path d='M12 4h24v40H12z'/></svg>" },
    { title: "Start", url: "discover/tv?network=2493", icon: "<svg viewBox='0 0 48 48'><circle cx='24' cy='24' r='20'/></svg>" },
    { title: "Premier", url: "discover/tv?network=2859", icon: "<svg viewBox='0 0 48 48'><polygon points='24,4 44,44 4,44'/></svg>" },
    { title: "ИВИ", url: "discover/tv?network=3923", icon: "<svg viewBox='0 0 48 48'><path d='M8 8h32v32H8z'/></svg>" },
    { title: "KION", url: "discover/tv?network=4085", icon: "<svg viewBox='0 0 48 48'><path d='M24 4L44 24 24 44 4 24z'/></svg>" },
    { title: "СТС", url: "discover/tv?network=4009", icon: "<svg viewBox='0 0 48 48'><circle cx='24' cy='24' r='20'/></svg>" },
    { title: "ТНТ", url: "discover/tv?network=4031", icon: "<svg viewBox='0 0 48 48'><polygon points='24,4 44,44 4,44'/></svg>" }
  ];

  Lampa.Select.show({
    title: Lampa.Lang.translate('settings_rest_source'),
    items: menuCategories,
    onSelect: function (chosenCategory) {
      Lampa.Activity.push({
        url: chosenCategory.url,
        title: chosenCategory.title,
        component: 'category_full',
        source: 'cub',
        card_type: 'true',
        page: 1
      });
    }
  });

  function initializeSettings() {
    Lampa.SettingsApi.addParam({
      component: "interface",
      param: {
        name: "rus_movie_main",
        type: "trigger",
        default: true
      },
      field: {
        name: "Русские новинки на главной",
        description: "Показывать подборки русских новинок на главной странице. После изменения параметра приложение нужно перезапустить"
      },
      onRender: function (element) {
        setTimeout(function () {
          $("div[data-name=\"rus_movie_main\"]").insertAfter("div[data-name=\"interface_size\"]");
        }, 0);
      }
    });
  }

  if (window.appready) {
    initializeSettings();
  } else {
    Lampa.Listener.follow("app", function (event) {
      if (event.type == "ready") {
        initializeSettings();
      }
    });
  }
})();
