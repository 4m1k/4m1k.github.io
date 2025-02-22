(function () {
  'use strict';

  Lampa.Platform.tv();

  (function () {
    // Функция для однократного выполнения (once)
    var once = function () {
      var flag = true;
      return function (context, func) {
        var inner = flag
          ? function () {
              if (func) {
                var result = func.apply(context, arguments);
                func = null;
                return result;
              }
            }
          : function () {};
        flag = false;
        return inner;
      };
    }();

    // Альтернативная функция однократного выполнения
    var onceAlt = function () {
      var flag = true;
      return function (context, func) {
        var inner = flag
          ? function () {
              if (func) {
                var result = func.apply(context, arguments);
                func = null;
                return result;
              }
            }
          : function () {};
        flag = false;
        return inner;
      };
    }();

    'use strict';

    // Функция инициализации шаблонов и стилей (пример)
    function initTemplate() {
      // Если платформа не TV – выходим
      if (!Lampa.Platform.screen('tv')) {
        console.log('Cardify: not a TV platform');
        return;
      }
      // Добавляем шаблон (содержимое сокращено для примера)
      Lampa.Template.add("full_start_new", "<div class=\"full-start-new cardify\">\n  <!-- содержимое шаблона -->\n</div>");
      // Добавляем CSS-стили
      Lampa.Template.add("cardify_css", "\n <style>\n  /* CSS-правила для cardify */\n </style>\n ");
      $("body").append(Lampa.Template.get("cardify_css", {}, true));
      Lampa.Listener.follow('full', function (event) {
        if (event.type === "complite") {
          event.object.activity.render().find(".full-start__background").addClass("cardify__background");
        }
      });
    }

    if (window.appready) {
      initTemplate();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type === "ready") {
          initTemplate();
        }
      });
    }

    // Блок подключения и инициализации Яндекс.Метрики удалён.

  })();
})();
