(function () {
  "use strict";

  // Инициализация режима TV для платформы Lampa
  Lampa.Platform.tv();

  /**
   * Возвращает строку из массива обфусцированных строк.
   */
  function getString(index) {
    const strings = getObfuscationArray();
    return strings[index];
  }

  /**
   * Массив обфусцированных строк.
   * Добавьте в этот массив все необходимые строки, используемые в коде.
   */
  function getObfuscationArray() {
    return [
      "table",                // 0
      "79.137.204.8:9117",     // 1
      "Ошибка",               // 2
      "Error:",               // 3
      "Jacred.xyz",           // 4
      "jacred_viewbox_dev",   // 5
      "change",               // 6
      "field",                // 7
      "ff2121",               // 8
      "src",                  // 9
      "no_parser",            // 10
      // … остальные строки
      // Пример: вместо getString(0x1fc) вернём закрывающую скобку
      ")",                    // допустим, индекс 30
      // И так далее для всех используемых индексов (например, 0x223, 0x200, 0x1f7, 0x205, 0x226, 0x215, 0x26f, 0x258, 0x1ff, 0x1f1, 0x20a, 0x253, 0x204, 0x238, 0x229, 0x212, 0x270, 0x1f4, 0x211, 0x236, 0x24b и т.д.)
    ];
  }

  // Первичная перестановка массива для динамической инициализации
  (function (arrayFunc, targetValue) {
    var arr = arrayFunc();
    while (true) {
      try {
        let result =
          parseInt(getString(0x261)) / 1 +
          (parseInt(getString(0x1fa)) / 2) * (-parseInt(getString(0x241)) / 3) +
          parseInt(getString(0x266)) / 4 +
          -parseInt(getString(0x216)) / 5 +
          (-parseInt(getString(0x259)) / 6 * (parseInt(getString(0x230)) / 7)) +
          parseInt(getString(0x246)) / 8 +
          (-parseInt(getString(0x24c)) / 9 * (parseInt(getString(0x1e6)) / 10));
        if (result === targetValue) break;
        else arr.push(arr.shift());
      } catch (e) {
        arr.push(arr.shift());
      }
    }
  })(getObfuscationArray, 0xd3c06);

  // Переменная observer вынесена в область видимости основного блока
  var observer = null;

  // Основной функционал
  (function () {
    "use strict";

    Lampa.Platform.tv();
    Lampa.Settings.set("jackett_enabled", true);
    var baseUrl = location.protocol === "https:" ? "https:" : "http:";

    var parserServers = [
      getString(0x258),          // убедитесь, что этот индекс определён
      "79.137.204.8:9117",
      getString(0x1ff),
      getString(0x1f1),
      "jacred.pro",
      getString(0x20a),
      "trs.my.to:9117",
      getString(0x253),
      getString(0x204),
    ];

    var parserDisplayNames = [
      getString(0x238),
      "ByLampa Jackett",
      getString(0x229),
      getString(0x212),
      getString(0x270),
      getString(0x1f4),
      getString(0x211),
      "Spawn Jackett",
      getString(0x236),
    ];

    function testParserServer(index) {
      setTimeout(function () {
        var statusMessage = "";
        if (parserServers[index] === getString(0x253))
          statusMessage = getString(0x205);
        if (parserServers[index] === getString(0x226))
          statusMessage = getString(0x215);

        var nextChildIndex = index + 2;
        if (parserServers[index] === "jr.maxvol.pro")
          baseUrl = "https:";
        else baseUrl = getString(0x26f);

        // Добавляем закрывающую скобку вручную, если getString(0x1fc) не определён
        var selector =
          "body > div.selectbox > div.selectbox__content.layer--height > div.selectbox__body.layer--wheight > div > div > div > div:nth-child(" +
          nextChildIndex +
          ")" ; // заменили getString(0x1fc) на ")"

        if ($(getString(0x223)).text() !== getString(0x200)) return;

        var testUrl = baseUrl + parserServers[index] + getString(0x1f7) + statusMessage;
        var xhr = new XMLHttpRequest();
        xhr.timeout = 3000;
        xhr.open("GET", testUrl, true);
        xhr.send();

        xhr.onerror = xhr.ontimeout = function () {
          if ($(selector).text() === parserDisplayNames[index])
            $(selector)
              .html(getString(0x218) + $(selector).text())
              .css(getString(0x277), getString(0x22d));
        };

        xhr.onload = function () {
          if (xhr.status === 200) {
            if ($(selector).text() === parserDisplayNames[index])
              $(selector)
                .html(getString(0x1f6) + $(selector).text())
                .css(getString(0x277), "64e364");
          } else {
            if ($(selector).text() === parserDisplayNames[index])
              $(selector)
                .html(getString(0x218) + $(selector).text())
                .css(getString(0x277), "ff2121");
          }
          if (xhr.status === 401) {
            if ($(selector).text() === parserDisplayNames[index])
              $(selector)
                .html(getString(0x218) + $(selector).text())
                .css(getString(0x277), getString(0x1f3));
          }
        };
      }, 1000);
    }

    function testAllParserServers() {
      for (var i = 0; i < parserServers.length; i++) {
        testParserServer(i);
      }
    }

    function updateParserSettings() {
      var parser = Lampa.Storage.get("parser_type");
      if (parser === "default") {
        Lampa.Storage.set("jackett_url", "");
        Lampa.Storage.set("jackett_key", "");
        Lampa.Storage.set("jackett_interview", "default_interview");
        Lampa.Storage.set("some_flag", false);
        Lampa.Storage.set("jackett_lang", "lg");
      }
      // Другие условия по необходимости...
    }

    Lampa.Settings.addComponent({
      component: "parser_selector",
      param: {
        name: "parser_type",
        type: "select",
        values: {
          no_parser: "Без парсера",
          jac_lampa32_ru: getString(0x238),
          bylampa_jackett: "bylampa_jackett",
          jacred_xyz: getString(0x229),
          jr_maxvol_pro: getString(0x212),
          jacred_my_to: getString(0x270),
          jacred_viewbox_dev: getString(0x1f4),
          spawn_jacred: getString(0x211),
          spawn_jackett: "Spawn Jackett",
          altjacred_duckdns_org: "Johnny Jacred",
        },
        default: "jacred_xyz",
      },
      field: {
        name: "Парсер",
        description: "Выберите парсер для поиска",
      },
      onChange: function (value) {
        updateParserSettings();
        Lampa.Controller.reload();
      },
      onRender: function (container) {
        setTimeout(function () {
          $("div[data-children='parser']").on("click", function () {
            Lampa.Controller.update();
          });
          if (localStorage.getItem("jackett_urltwo") !== "2")
            $("div[data-name='jackett_urltwo']").hide();
          else $("div[data-name='jackett_urltwo']").show();
        }, 5);
      },
    });

    Lampa.Settings.on("change", function (event) {
      if (event.type === "parser_selector") {
        event.container.find('[data-name="jackett_url_two"]').remove();
      }
    });

    var initInterval = setInterval(function () {
      if (typeof Lampa !== "undefined") {
        clearInterval(initInterval);
        if (!Lampa.Storage.get("jackett_url")) resetDefaultSettings();
      }
    }, 100);

    function resetDefaultSettings() {
      Lampa.Storage.set("jackett_url", "default_value");
      Lampa.Storage.set("jackett_urltwo", "default_two");
      Lampa.Storage.set("some_flag", true);
      Lampa.Storage.set("jackett_key", "");
      Lampa.Storage.set("jackett_state", "healthy");
      Lampa.Storage.set("jackett_lang", "lg");
    }

    function buildParserList() {
      var currentComponent = Lampa.Activity.enabled().component;
      var parserList = [];

      parserList.push({
        title: getString(0x238),
        url: "79.137.204.8:2601",
        url_two: getString(0x23d),
        jac_key: "",
        jac_int: "all",
        jac_lang: "lg",
      });
      parserList.push({
        title: getString(0x25d),
        url: getString(0x226),
        url_two: getString(0x252),
        jac_key: getString(0x215),
        jac_int: "healthy",
        jac_lang: "df",
      });
      // Другие парсеры добавляются аналогично

      _fetchParserStatus(parserList)
        .then(function (statusList) {
          Lampa.Activity.show({
            title: "Список парсеров",
            items: statusList.map(function (item) {
              return {
                title: item.title,
                url: item.url,
                url_two: item.url_two,
                jac_key: item.jac_key,
                jac_int: item.jac_int,
                jac_lang: item.jac_lang,
              };
            }),
            onBack: function () {
              Lampa.Activity.back(currentComponent);
            },
            onSelect: function (item) {
              Lampa.Storage.set("jackett_url", item.url);
              Lampa.Storage.set("jackett_urltwo", item.url_two);
              Lampa.Storage.set("jackett_key", item.jac_key);
              Lampa.Storage.set("jackett_state", item.jac_int);
              Lampa.Storage.set("jackett_lang", item.jac_lang);
              Lampa.Storage.set("some_flag", true);
              Lampa.Activity.back(currentComponent);
              setTimeout(function () {
                window.history.back();
              }, 1000);
              setTimeout(function () {
                Lampa.Controller.update(item);
              }, 2000);
            },
          });
        })
        .catch(function (error) {
          console.warn("Ошибка при получении статуса парсеров", error);
        });
    }

    function _fetchParserStatus(parsers) {
      var requests = [];
      for (var i = 0; i < parsers.length; i++) {
        requests.push(_checkParser(parsers[i].url, parsers[i].title, parsers[i]));
      }
      return Promise.all(requests);
    }

    function _checkParser(url, title, parserItem) {
      return new Promise(function (resolve, reject) {
        var protocol = location.protocol === "https:" ? "https:" : "http:";
        var additionalParam = "";
        if (url === getString(0x253)) additionalParam = "2";
        if (url === getString(0x226)) additionalParam = getString(0x215);
        if (url === getString(0x1f1)) protocol = "https:";
        else protocol = "http://";
        var fullUrl = protocol + url + getString(0x1f7) + additionalParam;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", fullUrl, true);
        xhr.timeout = 3000;
        xhr.onload = function () {
          if (xhr.status === 200) {
            parserItem.title =
              '<span style="color:#64e364;">✔  ' + title + "</span>";
            resolve(parserItem);
          } else {
            parserItem.title =
              '<span style="
