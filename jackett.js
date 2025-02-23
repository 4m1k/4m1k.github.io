(function () {
  "use strict";

  // Инициализация телевизионной платформы Lampa
  Lampa.Platform.tv();

  // Функция для получения строки из массива строк
  function getDecodedString(index, offset) {
    var stringArray = getStringArray();
    return getDecodedString = function (i, j) {
      return stringArray[i - 0x1dd];
    }, getDecodedString(index, offset);
  }

  // Механизм перемешивания массива строк (антиотладка)
  (function (stringArrayFunc, expectedSum) {
    var decode = getDecodedString,
        stringArray = stringArrayFunc();
    while (true) {
      try {
        var calculated =
          parseInt(decode(0x261)) / 1 +
          parseInt(decode(0x1fa)) / 2 * (-parseInt(decode(0x241)) / 3) +
          parseInt(decode(0x266)) / 4 -
          parseInt(decode(0x216)) / 5 -
          parseInt(decode(0x259)) / 6 * (-parseInt(decode(0x230)) / 7) +
          parseInt(decode(0x246)) / 8 -
          parseInt(decode(0x24c)) / 9 * (parseInt(decode(0x1e6)) / 10);
        if (calculated === expectedSum) break;
        else stringArray.push(stringArray.shift());
      } catch (e) {
        stringArray.push(stringArray.shift());
      }
    }
  }(getStringArray, 0xd3c06));

  // Основной модуль приложения
  (function () {
    "use strict";

    // Псевдоним функции декодирования
    var decode = getDecodedString;

    // Обёртки для вызова функций с единичным выполнением (аналог debounce)
    var onceWrapper1 = (function () {
      var executed = true;
      return function (fn, context) {
        var result;
        if (executed) {
          result = function () {
            if (fn) {
              var temp = fn.apply(context, arguments);
              fn = null;
              return temp;
            }
          };
          executed = false;
        }
        return result;
      };
    }());
    var onceWrapper2 = (function () {
      var executed = true;
      return function (fn, context) {
        var result;
        if (executed) {
          result = function () {
            if (fn) {
              var temp = fn.apply(context, arguments);
              fn = null;
              return temp;
            }
          };
          executed = false;
        }
        return result;
      };
    }());

    // Повторная инициализация телевизионной платформы
    Lampa.Platform.tv();
    // Устанавливаем настройку "jackett_enabled" в true (код обфусцирован – строка берётся из массива)
    Lampa.Settings.set("jackett_enabled", true);

    // Определяем протокол в зависимости от текущего URL
    var currentProtocol = location.protocol === "https:" ? "https:" : "http:";
    // Массив адресов серверов (значения зашифрованы)
    var serverAddresses = [
      decode(0x258),
      "79.137.204.8:9117",
      decode(0x1ff),
      decode(0x1f1),
      "jacred.pro",
      decode(0x20a),
      "trs.my.to:9117",
      decode(0x253),
      decode(0x204)
    ];
    // Массив названий серверов/парсеров
    var serverNames = [
      decode(0x238),
      "ByLampa Jackett",
      decode(0x229),
      decode(0x212),
      decode(0x270),
      decode(0x1f4),
      decode(0x211),
      "Spawn Jackett",
      decode(0x236)
    ];

    // Функция проверки доступности сервера по индексу
    function checkServer(index) {
      setTimeout(function () {
        var localDecode = getDecodedString;
        var extraParam = "";
        // Если адрес сервера равен определённому значению, установить параметр extraParam
        if (serverAddresses[index] == decode(0x253))
          extraParam = decode(0x205);
        if (serverAddresses[index] == decode(0x226))
          extraParam = decode(0x215);

        var nthChild = index + 2;
        // Если сервер равен 'jr.maxvol.pro', используем https, иначе оставляем протокол по умолчанию
        if (serverAddresses[index] == 'jr.maxvol.pro')
          currentProtocol = "https:";
        else
          currentProtocol = decode(0x26f);

        // Формируем селектор для элемента в интерфейсе
        var elementSelector = 'body > div.selectbox > div.selectbox__content.layer--height > div.selectbox__body.layer--wheight > div > div > div > div:nth-child(' + nthChild + decode(0x1fc);
        // Если данный элемент не в нужном состоянии – выходим
        if ($(decode(0x223)).text() !== decode(0x200)) return;

        // Формируем URL для запроса
        var requestUrl = currentProtocol + serverAddresses[index] + decode(0x1f7) + extraParam;
        var xhr = new XMLHttpRequest();
        xhr.timeout = 3000;
        xhr.open("GET", requestUrl, true);
        xhr.send();
        xhr.onload = function () {
          if (xhr.status == 200) {
            if ($(elementSelector).text() == serverNames[index])
              $(elementSelector).html(decode(0x1f6) + $(elementSelector).text()).css(decode(0x277), "64e364");
          } else {
            if ($(elementSelector).text() == serverNames[index])
              $(elementSelector).html(decode(0x218) + $(elementSelector).text()).css(decode(0x277), "ff2121");
          }
          if (xhr.status == 0x191) {
            if ($(elementSelector).text() == serverNames[index])
              $(elementSelector).html(decode(0x218) + $(elementSelector).text()).css(decode(0x277), decode(0x1f3));
          }
        };
        xhr.onerror = function () {
          if ($(elementSelector).text() == serverNames[index])
            $(elementSelector).html(decode(0x218) + $(elementSelector).text()).css(decode(0x277), "ff2121");
        };
      }, 1000);
    }

    // Функция для последовательной проверки всех серверов
    function checkAllServers() {
      for (var i = 0; i < serverAddresses.length; i++) {
        checkServer(i);
      }
    }

    // При выборе (select) в контроллере – запускаем проверку серверов
    Lampa.Controller.on("select", function (event) {
      if (event.type == "select") {
        setTimeout(function () {
          checkAllServers();
        }, 10);
      }
    });

    // Функция обновления настроек в зависимости от выбранного парсера
    function updateParserSettings() {
      var currentParser = Lampa.Settings.get("parser");
      if (currentParser == decode(0x22f)) {
        Lampa.Storage.set("jackett_url", "");
        Lampa.Settings.set("jackett_key", "");
        Lampa.Settings.set("jackett_interview", decode(0x21d));
        Lampa.Settings.set("jackett_enabled", false);
        Lampa.Settings.set("jackett_lang", "lg");
      }
      if (Lampa.Storage.get("parser") == decode(0x23d)) {
        Lampa.Settings.set("jackett_url", decode(0x258));
        Lampa.Settings.set("some_other_setting", "");
        Lampa.Storage.set("jackett_interview", decode(0x21d));
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Settings.set("jackett_lang", "lg");
      }
      // Дополнительные условия для других вариантов парсера...
    }

    // Отслеживание изменений в настройках
    Lampa.Settings.follow("jackett", function (param) {
      if (param.name == "jackett") {
        param.container.find("[data-name='jackett_url']").remove();
        param.container.find("[data-name='jackett_url_two']").remove();
      }
    });
    Lampa.Settings.on("change", function (e) {
      if (Lampa.Settings.get("jackett_enabled") != decode(0x240))
        $("div[data-name='jackett_urltwo']").show();
      else {
        $("div[data-name='jackett_urltwo']").hide();
        $("div[data-name='parser_torrent_type']");
      }
    });

    // Запускаем периодическую проверку и при обнаружении Lampa вызываем сброс настроек, если необходимо
    var settingsInterval = setInterval(function () {
      if (typeof Lampa !== "undefined") {
        clearInterval(settingsInterval);
        if (!Lampa.Storage.get("jackett_default", "default"))
          resetParserSettings();
      }
    }, 100);

    // Функция сброса настроек парсера к значениям по умолчанию
    function resetParserSettings() {
      Lampa.Settings.set("jackett_default", decode(0x255));
      Lampa.Settings.set("jackett_url", decode(0x1ff));
      Lampa.Settings.set("jackett_urltwo", decode(0x244));
      Lampa.Settings.set("jackett_enabled", true);
      Lampa.Settings.set("jackett_key", "");
      Lampa.Settings.set("jackett_interview", "healthy");
      Lampa.Settings.set("jackett_lang", "lg");
    }

    // Функция для формирования списка доступных парсеров
    function showParserMenu() {
      var currentScreen = Lampa.Controller.enabled().screen,
          parserList = [];

      parserList.push({
        title: decode(0x238),
        url: "79.137.204.8:2601",
        url_two: decode(0x23d),
        jac_key: "",
        jac_int: "all",
        jac_lang: "lg"
      });
      parserList.push({
        title: decode(0x25d),
        url: decode(0x226),
        url_two: decode(0x252),
        jac_key: decode(0x215),
        jac_int: "healthy",
        jac_lang: "df"
      });
      parserList.push({
        title: decode(0x229),
        url: decode(0x1ff),
        url_two: decode(0x244),
        jac_key: "",
        jac_int: decode(0x1f2),
        jac_lang: "lg"
      });
      // … добавляются и другие элементы

      parseParsers(parserList).then(function (parsedList) {
        Lampa.Activity.push({
          title: "Выбрать парсер",
          items: parsedList.map(function (item) {
            return {
              title: item.title,
              url: item.url,
              url_two: item.url_two,
              jac_key: item.jac_key,
              jac_int: item.jac_int,
              jac_lang: item.jac_lang
            };
          }),
          onBack: function () {
            Lampa.Controller.activate(currentScreen);
          },
          onSelect: function (item) {
            Lampa.Settings.set("jackett_url", item.url);
            Lampa.Settings.set("jackett_urltwo", item.url_two);
            Lampa.Settings.set("jackett_key", item.jac_key);
            Lampa.Settings.set("jackett_interview", item.jac_int);
            Lampa.Settings.set("jackett_lang", item.jac_lang);
            Lampa.Settings.set("jackett_enabled", true);
            Lampa.Controller.activate(currentScreen);
            setTimeout(function () {
              window.history.back();
            }, 1000);
            setTimeout(function () {
              Lampa.Activity.start(item.activity);
            }, 2000);
          }
        });
      }).catch(function (error) {
        console.error("Ошибка при загрузке парсеров:", error);
      });
    }

    // Функция, возвращающая промисы для проверки состояния каждого сервера
    function parseParsers(servers) {
      var promises = [];
      for (var i = 0; i < servers.length; i++) {
        var serverUrl = servers[i].url;
        promises.push(getServerStatus(serverUrl, servers[i].title, servers[i]));
      }
      return Promise.all(promises);
    }

    // Функция проверки состояния конкретного сервера
    function getServerStatus(serverUrl, title, serverObj) {
      return new Promise(function (resolve, reject) {
        var protocolToUse = location.protocol === "https:" ? "https:" : "http:";
        var queryParam = "";
        if (serverUrl == decode(0x253)) queryParam = "2";
        if (serverUrl == decode(0x226)) queryParam = decode(0x215);
        if (serverUrl == decode(0x1f1))
          protocolToUse = "https:";
        else
          protocolToUse = "http:";
        var fullUrl = protocolToUse + serverUrl + decode(0x1f7) + queryParam;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", fullUrl, true);
        xhr.timeout = 3000;
        xhr.send();
        xhr.onload = function () {
          if (xhr.status === 200) {
            serverObj.title = '<span style="color: #64e364;">&#10004;&nbsp;&nbsp;' + title + "</span>";
            resolve(serverObj);
          } else {
            serverObj.title = '<span style="color: #ff2121;">&#10008;&nbsp;&nbsp;' + title + "</span>";
            resolve(serverObj);
          }
        };
        xhr.onerror = function () {
          serverObj.title = "Error: " + title;
          resolve(serverObj);
        };
        xhr.ontimeout = function () {
          serverObj.title = "Error: " + title;
          resolve(serverObj);
        };
      });
    }

    // Наблюдатель за изменениями в DOM для вызова меню парсера
    var mutationObserver;
    Lampa.Settings.on("select", function (param) {
      if (param.type == "select" && param.name == "jackett_url") {
        if (Lampa.Activity.current().component == "jackett_menu")
          observeForEmptyTitle();
        else
          disconnectObserver();
      }
    });

    function observeForEmptyTitle() {
      disconnectObserver();
      var targetNode = document.body;
      var config = { childList: true, subtree: true };
      mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if ($(".empty__title").length && Lampa.Settings.field("parser_torrent_type") == "jackett") {
            showParserMenu();
            disconnectObserver();
          }
        });
      });
      mutationObserver.observe(targetNode, config);
    }
    function disconnectObserver() {
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
    }

    // Подключение скрипта Яндекс Метрики
    (function (global, document, tag, src, ymFuncName) {
      var decode = getDecodedString;
      // Вызов обёртки (можно добавить дополнительную логику здесь)
      var initializeAnalytics = onceWrapper2(this, function () {
        try {
          var func = Function("return function(){ /* analytics hook */ };");
          return func();
        } catch (e) {
          return window;
        }
      });
      initializeAnalytics();

      // Динамическое создание тега <script>
      var scriptElem = document.createElement(tag);
      scriptElem.async = true;
      scriptElem.src = src;
      var firstScript = document.getElementsByTagName(tag)[0];
      firstScript.parentNode.insertBefore(scriptElem, firstScript);
    }(window, document, 'script', "https://mc.yandex.ru/metrika/tag.js", "ym"));
    ym(0x59973eb, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true
    });
    var noscriptHTML = decode(0x24b);
    $("body").append(noscriptHTML);
  }());

  // Функция, возвращающая массив строк для декодирования (исходные значения обфусцированы)
  function getStringArray() {
    var strings = [
      "table",
      "79.137.204.8:9117",
      "Ошибка",
      "Error:",
      "Jacred.xyz",
      "jacred_viewbox_dev",
      "change",
      "field",
      "ff2121",
      "src",
      "no_parser",
      "4613BUMGIV",
      "catch",
      "push",
      "toString",
      "div[data-name=\"jackett_urltwo\"]",
      "error",
      "Johnny Jacred",
      "jac_key",
      "Lampa32",
      "bind",
      "remove",
      "show",
      "back",
      "jac_lampa32_ru",
      "https:",
      "Storage",
      "jackett",
      "3174225mkEAFZ",
      "parse_in_search",
      "follow",
      "jacred_xyz",
      "hover:enter",
      "8335528CfztFt",
      "constructor",
      "text",
      "trace",
      "Spawn Jackett",
      "<noscript><div><img src=\"https://mc.yandex.ru/watch/93942763\" style=\"position:absolute; left:-9999px;\" alt=\"\" /></div></noscript>",
      "9WZOpLP",
      "title",
      "async",
      "Activity",
      "bylampa",
      "getItem",
      "bylampa_jackett",
      "spawn.pp.ua:59117",
      "jac_lang",
      "true",
      "</span>",
      "info",
      "79.137.204.8:2601",
      "11406LHEqYK",
      "onerror",
      "exception",
      "insertAfter",
      "ByLampa Jackett",
      "[data-name=\"jackett_url2\"]",
      "disconnect",
      "parse_lang",
      "1394849EwzdLK",
      "find",
      "toggle",
      "jackett_key",
      "scripts",
      "1371592PAjDfY",
      "GET",
      "parser",
      "css",
      "spawn_jacred",
      "return (function() ",
      "jacred.pro",
      "search",
      "parser_use",
      "http://",
      "Jacred Pro ",
      "activity",
      "hide",
      "get",
      "origin",
      "div[data-name=\"parser_torrent_type\"]",
      "spawn_jackett",
      "color",
      "warn",
      "set",
      "Platform",
      "insertBefore",
      "Нажмите для выбора парсера из списка",
      "protocol",
      "ffffff",
      "viewbox",
      "open",
      "{}.constructor(\"return this\")( )",
      "Controller",
      "https://mc.yandex.ru/metrika/tag.js",
      "select",
      "11534350xbvvXu",
      "update",
      "torrents",
      "forEach",
      "settings_component",
      "altjacred_duckdns_org",
      "jackett_interview",
      "url_two",
      "parser_torrent_type",
      "console",
      "onload",
      "jr.maxvol.pro",
      "healthy",
      "000",
      "Viewbox",
      "<span style=\"color: #ff2121;\">&#10008;&nbsp;&nbsp;",
      "&#10004;&nbsp;&nbsp;",
      "/api/v2.0/indexers/status:healthy/results?apikey=",
      "jr_maxvol_pro",
      "active",
      "2wGOvxg",
      "jackett_url",
      ") > div",
      "div[data-name=\"jackett_key\"]",
      "html",
      "jacred.xyz",
      "Свой вариант",
      "url",
      "send",
      "(((.+)+)+)+$",
      "altjacred_duckdns.org",
      "2&Query=Rebel Moon - Part One: A Child of Fire&title=Мятежная Луна, час 1: Дитя огня&title_original=Rebel Moon - Part One: A Child of Fire&year=2023&is_serial=1&genres=фантастика,боевик,приключения&Category[]=2000",
      "SettingsApi",
      "parentNode",
      "<div class=\"settings-folder\" style=\"padding:0!important\"><div style=\"width:1.3em;height:1.3em;padding-right:.1em\"><svg height=\"256px\" width=\"256px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 512 512\" xml:space=\"preserve\" fill=\"#000000\"><g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g><g id=\"SVGRepo_tracerCarrier\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></g><g id=\"SVGRepo_iconCarrier\"> <polygon style=\"fill:#074761;\" points=\"187.305,27.642 324.696,27.642 256,236.716 \"></polygon> <polygon style=\"fill:#10BAFC;\" points=\"187.305,27.642 256,236.716 163.005,151.035 196.964,151.035 110.934,49.96 \"></polygon> <g> <polygon style=\"fill:#0084FF;\" points=\"66.917,62.218 10.45,434.55 66.917,451.922 117.726,217.908 \"></polygon> <polygon style=\"fill:#0084FF;\" points=\"163.005,151.035 196.964,151.035 110.934,49.96 66.917,62.218 117.726,217.908 117.726,484.356 256,484.356 256,236.716 \"></polygon> </g> <polygon style=\"fill:#10BAFC;\" points=\"324.696,27.642 256,236.716 348.996,151.035 315.037,151.035 401.067,49.96 \"></polygon> <g> <polygon style=\"fill:#0084FF;\" points=\"445.084,62.218 501.551,434.55 445.084,451.922 394.275,217.908 \"></polygon> <polygon style=\"fill:#0084FF;\" points=\"348.996,151.035 315.037,151.035 401.067,49.96 445.084,62.218 394.275,217.908 394.275,484.356 256,484.356 256,236.716 \"></polygon> </g> <path d=\"M291.559,308.803c-7.49,0-13.584-6.094-13.584-13.584c0-7.49,6.094-13.584,13.584-13.584s13.584,6.094,13.584,13.584 C305.143,302.71,299.049,308.803,291.559,308.803z\"></path> <path d=\"M291.559,427.919c-7.49,0-13.584-6.094-13.584-13.584s6.094-13.584,13.584-13.584s13.584,6.094,13.584,13.584 S299.049,427.919,291.559,427.919z\"></path> <path d=\"M291.559,368.405c-7.49,0-13.584-6.094-13.584-13.584s6.094-13.584,13.584-13.584s13.584,6.094,13.584,13.584 S299.049,368.405,291.559,368.405z\"></path> <path d=\"M225.677,424.785h-4.678c-5.77,0-10.449-4.679-10.449-10.449s4.679-10.449,10.449-10.449h4.678 c5.771,0,10.449,4.679,10.449,10.449S231.448,424.785,225.677,424.785z\"></path> <path d=\"M384.063,220.125c8.948-1.219,5.008,7.842,10.646,6.617c5.637-1.225,8.551-16.691,9.775-11.052\"></path> <path d=\"M511.881,432.984L455.414,60.652c-0.004-0.001-0.008-0.001-0.013-0.002c-0.178-1.166-0.541-2.306-1.109-3.367 c-1.346-2.513-3.66-4.367-6.407-5.131L327.627,17.613c-0.976-0.284-1.961-0.416-2.931-0.416c0-0.001-137.391-0.001-137.391-0.001 c-0.97,0.001-1.955,0.132-2.931,0.417L64.114,52.152c-2.747,0.766-5.061,2.619-6.407,5.131c-0.569,1.064-0.933,2.208-1.11,3.377 c-0.004-0.002-0.007-0.006-0.011-0.009L0.119,432.984c-0.776,5.117,2.311,10.032,7.258,11.553l56.467,17.371 c1.005,0.309,2.041,0.462,3.072,0.462c1.836,0,3.659-0.484,5.276-1.429c2.524-1.476,4.315-3.943,4.936-6.802l30.149-138.858v169.075 c0,5.771,4.679,10.449,10.449,10.449h276.548c5.77,0,10.449-4.678,10.449-10.449V315.281l30.148,138.858 c0.621,2.858,2.412,5.326,4.936,6.802c1.616,0.946,3.44,1.429,5.276,1.429c1.031,0,2.067-0.154,3.072-0.462l56.467-17.371 C509.571,443.015,512.658,438.101,511.881,432.984z M331.467,40.507l51.19,14.959l-75.578,88.795 c-2.64,3.102-3.237,7.457-1.529,11.155c1.709,3.698,5.411,6.067,9.486,6.067h7.198l-43.765,40.324L331.467,40.507z M180.533,40.507 l52.998,161.3l-43.765-40.324h7.198c4.074,0,7.776-2.369,9.486-6.067c1.708-3.698,1.112-8.053-1.529-11.155l-75.578-88.795 L180.533,40.507z M59.119,438.59l-36.987-11.379l48.512-319.89l36.269,111.136L59.119,438.59z M245.552,473.907H128.175v-49.123 h59.02c5.77,0,10.449-4.679,10.449-10.449s-4.679-10.449-10.449-10.449h-59.02V217.908c0-1.101-0.174-2.195-0.515-3.242 L80.238,69.355l27.068-7.539l67.043,78.769h-11.343c-4.304,0-8.168,2.638-9.733,6.649c-1.565,4.009-0.512,8.568,2.653,11.484 l89.627,82.578L245.552,473.907L245.552,473.907z M201.736,38.092h108.528L256,203.243L201.736,38.092z M384.341,214.666 c-0.341,1.047-0.515,2.141-0.515,3.242v255.999H266.449V241.297l89.627-82.578c3.165-2.916,4.218-7.475,2.653-11.484 c-1.565-4.01-5.429-6.649-9.733-6.649h-11.343l67.043-78.769l27.068,7.539L384.341,214.666z M452.882,438.59l-47.795-220.132 l36.268-111.136l48.515,319.89L452.882,438.59z M353.197,262.86h-61.637c-5.77,0-10.449-4.679-10.449-10.449c0-5.771,4.679-10.449,10.449-10.449h61.637 c5.77,0,10.449,4.678,10.449,10.449C363.646,258.182,358.968,262.86,353.197,262.86z </path> </g></svg></div><div style=\"font-size:1.0em\"><div style=\"padding: 0.3em 0.3em; padding-top: 0;\"><div style=\"background: #d99821; padding: 0.5em; border-radius: 0.4em;\"><div style=\"line-height: 0.3;\">Выбрать парсер</div></div></div></div></div>",
      "jacred_my_to",
      "jacred.viewbox.dev",
      "trs.my.to:9117",
      "Меню смены парсера",
      "https://",
      "ontimeout",
      "jac_int",
      "listener",
      "JAOS My To Jacred",
      "Jacred Maxvol Pro",
      "body",
      "undefined",
      "777",
      "4768015AZVlBa",
      "apply",
      "&#10008;&nbsp;&nbsp;",
      "addParam",
      "log",
      "jackett_urltwo",
      "jack",
      "all",
      "Select",
      "false",
      "name",
      "Settings",
      "Manifest",
      "body > div.selectbox > div.selectbox__content.layer--height > div.selectbox__body.layer--wheight > div > div > div > div:nth-child(1) > div",
      "length"
    ];
    return strings;
  }
}());
