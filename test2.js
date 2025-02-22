(function () {
  'use strict';

  Lampa.Platform.tv();

  (function () {
    // Создание замыкания для выполнения функции с контекстом
    var createExecutor = function () {
      var isFirstRun = true;
      return function (context, callback) {
        var executor = isFirstRun ? function () {
          if (callback) {
            var result = callback.apply(context, arguments);
            callback = null;
            return result;
          }
        } : function () {};
        isFirstRun = false;
        return executor;
      };
    }();

    // Создание замыкания для переопределения консоли
    var createConsoleOverride = function () {
      var isFirstRun = true;
      return function (context, callback) {
        var executor = isFirstRun ? function () {
          if (callback) {
            var result = callback.apply(context, arguments);
            callback = null;
            return result;
          }
        } : function () {};
        isFirstRun = false;
        return executor;
      };
    }();

    'use strict';
    var isCardProcessed = 0;

    // Удаление элементов при переключении контроллера
    function removeAdsOnToggle() {
      Lampa.Controller.listener.follow('toggle', function (event) {
        if (event.name === 'select') {
          setTimeout(function () {
            if (Lampa.Activity.active().component === "full") {
              if (document.querySelector(".ad-server") !== null) {
                $(".ad-server").remove();
              }
            }
            if (Lampa.Activity.active().component === "modss_online") {
              $(".selectbox-item--icon").remove();
            }
          }, 20);
        }
      });
    }

    // Скрытие заблокированных элементов
    function hideLockedItems() {
      setTimeout(function () {
        $(".selectbox-item__lock").parent().css("display", "none");
        if (!$("[data-name=\"account_use\"]").length) {
          $("div > span:contains(\"Статус\")").parent().remove();
        }
      }, 10);
    }

    // Наблюдение за изменениями DOM для обработки карточек
    function observeDomChanges() {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type === 'childList') {
            var cards = document.getElementsByClassName("card");
            if (cards.length > 0) {
              if (isCardProcessed === 0) {
                isCardProcessed = 1;
                hideLockedItems();
                setTimeout(function () {
                  isCardProcessed = 0;
                }, 500);
              }
            }
          }
        }
      });
      var config = {
        childList: true
      };
      config.subtree = true;
      observer.observe(document.body, config);
    }

    // Основная функция настройки
    function initializeApp() {
      // Проверка на бесконечный цикл (антикод)
      var checkLoop = createExecutor(this, function () {
        return checkLoop.toString().search("(((.+)+)+)+$").toString().constructor(checkLoop).search("(((.+)+)+)+$");
      });
      checkLoop();

      // Переопределение консоли для подавления логов
      var overrideConsole = createConsoleOverride(this, function () {
        var globalObject;
        try {
          var getGlobal = Function("return (function() {}.constructor(\"return this\")( ));");
          globalObject = getGlobal();
        } catch (e) {
          globalObject = window;
        }
        var console = globalObject.console = globalObject.console || {};
        var methods = ['log', "warn", "info", "error", 'exception', "table", "trace"];
        for (var i = 0; i < methods.length; i++) {
          var method = createConsoleOverride.constructor.prototype.bind(createConsoleOverride);
          var methodName = methods[i];
          var originalMethod = console[methodName] || method;
          method.__proto__ = createConsoleOverride.bind(createConsoleOverride);
          method.toString = originalMethod.toString.bind(originalMethod);
          console[methodName] = method;
        }
      });
      overrideConsole();

      // Добавление стилей для скрытия кнопки подписки
      var style = document.createElement("style");
      style.innerHTML = ".button--subscribe { display: none; }";
      document.body.appendChild(style);

      // Удаление отзывов в режиме "full"
      Lampa.Listener.follow("full", function (event) {
        if (event.type === 'build' && event.name === "discuss") {
          setTimeout(function () {
            $(".full-reviews").parent().parent().parent().parent().remove();
          }, 100);
        }
      });

      // Установка региона в localStorage
      $(document).ready(function () {
        var now = new Date();
        var timestamp = now.getTime();
        localStorage.setItem('region', "{\"code\":\"uk\",\"time\":" + timestamp + '}');
      });

      // Удаление рекламы при выборе ТВ
      $("[data-action=\"tv\"]").on("hover:enter hover:click hover:touch", function () {
        var adBotInterval = setInterval(function () {
          if (document.querySelector(".ad-bot") !== null) {
            $(".ad-bot").remove();
            clearInterval(adBotInterval);
            setTimeout(function () {
              Lampa.Controller.toggle("content");
            }, 0);
          }
        }, 50);
        var cardTextInterval = setInterval(function () {
          if (document.querySelector(".card__textbox") !== null) {
            $(".card__textbox").parent().parent().remove();
            clearInterval(cardTextInterval);
          }
        }, 50);
      });

      // Удаление дополнительных элементов через 1 секунду
      setTimeout(function () {
        $(".open--feed").remove();
        $(".open--premium").remove();
        $(".open--notice").remove();
        if ($(".icon--blink").length > 0) {
          $(".icon--blink").remove();
        }
        if ($(".black-friday__button").length > 0) {
          $(".black-friday__button").remove();
        }
        if ($(".christmas__button").length > 0) {
          $(".christmas__button").remove();
        }
      }, 1000);

      // Настройка параметров в меню
      Lampa.Settings.listener.follow('open', function (event) {
        if (event.name === "account") {
          setTimeout(function () {
            $(".settings--account-premium").remove();
            $("div > span:contains(\"CUB Premium\")").remove();
          }, 0);
        }
        if (event.name === "server") {
          if (document.querySelector(".ad-server") !== null) {
            $(".ad-server").remove();
          }
        }
      });

      // Обработка кнопки закладок
      Lampa.Listener.follow("full", function (event) {
        if (event.type === "complite") {
          $(".button--book").on("hover:enter", function () {
            hideLockedItems();
          });
        }
      });

      // Реакция на изменение активности
      Lampa.Storage.listener.follow("change", function (event) {
        if (event.name === "activity") {
          if (Lampa.Activity.active().component === "bookmarks") {
            $(".register:nth-child(4)").hide();
            $(".register:nth-child(5)").hide();
            $(".register:nth-child(6)").hide();
            $(".register:nth-child(7)").hide();
            $(".register:nth-child(8)").hide();
          }
          setTimeout(function () {
            observeDomChanges();
          }, 200);
        }
      });
    }

    // Инициализация при готовности приложения
    if (window.appready) {
      initializeApp();
      observeDomChanges();
      removeAdsOnToggle();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type === "ready") {
          initializeApp();
          observeDomChanges();
          removeAdsOnToggle();
          $("[data-action=feed]").eq(0).remove();
          $("[data-action=subscribes]").eq(0).remove();
          $("[data-action=myperson]").eq(0).remove();
        }
      });
    }
  })();
})();
