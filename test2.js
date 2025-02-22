(function () {
  'use strict';

  Lampa.Platform.tv();
  (function () {
    // Обёртки для выполнения кода один раз
    var readyOnce = function () {
      var flag = true;
      return function (context, callback) {
        var inner = flag
          ? function () {
              if (callback) {
                var result = callback.apply(context, arguments);
                callback = null;
                return result;
              }
            }
          : function () {};
        flag = false;
        return inner;
      };
    }();
    var oneTime = function () {
      var flag = true;
      return function (context, callback) {
        var inner = flag
          ? function () {
              if (callback) {
                var result = callback.apply(context, arguments);
                callback = null;
                return result;
              }
            }
          : function () {};
        flag = false;
        return inner;
      };
    }();

    'use strict';
    Lampa.Platform.tv();
    Lampa.Storage.set("parser_use", true);

    Lampa.Controller.listener.follow("toggle", function (e) {
      if (e.name == 'select') {
        setTimeout(function () {}, 10);
      }
    });

    function initParserSettings() {
      if (Lampa.Storage.get("jackett_urltwo") == "no_parser") {
        Lampa.Storage.set("jackett_url", '');
        Lampa.Storage.set("jackett_key", '');
        Lampa.Storage.set("jackett_interview", "all");
        Lampa.Storage.set("parse_in_search", false);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get("jackett_urltwo") == "jac_lampa32_ru") {
        Lampa.Storage.set("jackett_url", "79.137.204.8:2601");
        Lampa.Storage.set("jackett_key", '');
        Lampa.Storage.set("jackett_interview", "all");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get("jackett_urltwo") == 'spawn_jacred') {
        Lampa.Storage.set("jackett_url", "trs.my.to:9117");
        Lampa.Storage.set("jackett_key", '');
        Lampa.Storage.set("jackett_interview", "all");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get("jackett_urltwo") == "jacred_xyz") {
        Lampa.Storage.set("jackett_url", 'jacred.xyz');
        Lampa.Storage.set("jackett_key", '');
        Lampa.Storage.set("jackett_interview", "healthy");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get('jackett_urltwo') == "spawn_jackett") {
        Lampa.Storage.set("jackett_url", "spawn.pp.ua:59117");
        Lampa.Storage.set("jackett_key", '2');
        Lampa.Storage.set("jackett_interview", "healthy");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'df');
      }
      if (Lampa.Storage.get("jackett_urltwo") == "jr_maxvol_pro") {
        Lampa.Storage.set("jackett_url", "jr.maxvol.pro");
        Lampa.Storage.set("jackett_key", '');
        Lampa.Storage.set("jackett_interview", "healthy");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get("jackett_urltwo") == "altjacred_duckdns_org") {
        Lampa.Storage.set("jackett_url", "altjacred.duckdns.org");
        Lampa.Storage.set("jackett_key", '');
        Lampa.Storage.set("jackett_interview", "all");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get("jackett_urltwo") == "jacred_my_to") {
        Lampa.Storage.set("jackett_url", "jacred.pro");
        Lampa.Storage.set("jackett_key", '');
        Lampa.Storage.set("jackett_interview", "all");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get("jackett_urltwo") == "jacred_viewbox_dev") {
        Lampa.Storage.set("jackett_url", "jacred.viewbox.dev");
        Lampa.Storage.set("jackett_key", "viewbox");
        Lampa.Storage.set("jackett_interview", "all");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'lg');
      }
      if (Lampa.Storage.get("jackett_urltwo") == 'bylampa_jackett') {
        Lampa.Storage.set("jackett_url", "79.137.204.8:9117");
        Lampa.Storage.set("jackett_key", "777");
        Lampa.Storage.set("jackett_interview", "healthy");
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Storage.set("parse_lang", 'df');
      }
      return;
    }

    Lampa.SettingsApi.addParam({
      'component': "parser",
      'param': {
        'name': "jackett_urltwo",
        'type': "select",
        'values': {
          'no_parser': "Свой вариант",
          'jac_lampa32_ru': "Lampa32",
          'bylampa_jackett': "ByLampa Jackett",
          'jacred_xyz': "Jacred.xyz",
          'jr_maxvol_pro': "Jacred Maxvol Pro",
          'jacred_my_to': "Jacred Pro ",
          'jacred_viewbox_dev': "Viewbox",
          'spawn_jacred': "JAOS My To Jacred",
          'spawn_jackett': "Spawn Jackett",
          'altjacred_duckdns_org': "Johnny Jacred"
        },
        'default': 'jacred_xyz'
      },
      'field': {
        'name': "<div class=\"settings-folder\" style=\"padding:0!important\"><div style=\"width:1.3em;height:1.3em;padding-right:.1em\"><svg ...></svg></div><div style=\"font-size:1.0em\"><div style=\"padding: 0.3em 0.3em; padding-top: 0;\"><div style=\"background: #d99821; padding: 0.5em; border-radius: 0.4em;\"><div style=\"line-height: 0.3;\">Выбрать парсер</div></div></div></div></div>",
        'description': "Нажмите для выбора парсера из списка"
      },
      'onChange': function (value) {
        initParserSettings();
        Lampa.Settings.update();
      },
      'onRender': function (elem) {
        setTimeout(function () {
          $("div[data-children=\"parser\"]").on("hover:enter", function () {
            Lampa.Settings.update();
          });
          if (localStorage.getItem('jackett_urltwo') !== "no_parser") {
            $("div[data-name=\"jackett_url\"]").hide();
            $("div[data-name=\"jackett_key\"]").hide();
            Lampa.Controller.toggle("settings_component");
          }
          if (Lampa.Storage.field("parser_use") && Lampa.Storage.field("parser_torrent_type") == "jackett") {
            elem.show();
            $('.settings-param__name', elem).css("color", "ffffff");
            $("div[data-name=\"jackett_urltwo\"]").insertAfter("div[data-name=\"parser_torrent_type\"]");
          } else {
            elem.hide();
          }
        }, 5);
      }
    });

    Lampa.Settings.listener.follow("open", function (panel) {
      if (panel.name == "parser") {
        panel.body.find("[data-name=\"jackett_url2\"]").remove();
        panel.body.find("[data-name=\"jackett_url_two\"]").remove();
      }
    });

    Lampa.Storage.listener.follow('change', function (change) {
      if (Lampa.Storage.field("parser_torrent_type") !== "jackett") {
        $("div[data-name=\"jackett_urltwo\"]").hide();
      } else {
        $("div[data-name=\"jackett_urltwo\"]").show();
        $("div[data-name=\"jackett_urltwo\"]").insertAfter("div[data-name=\"parser_torrent_type\"]");
      }
    });

    var observerInterval = setInterval(function () {
      if (typeof Lampa !== "undefined") {
        clearInterval(observerInterval);
        if (!Lampa.Storage.get("jack", "false")) {
          setDefaults();
        }
      }
    }, 100);

    function setDefaults() {
      Lampa.Storage.set("jack", "true");
      Lampa.Storage.set('jackett_url', "jacred.xyz");
      Lampa.Storage.set('jackett_urltwo', "jacred_xyz");
      Lampa.Storage.set("parse_in_search", true);
      Lampa.Storage.set('jackett_key', '');
      Lampa.Storage.set("jackett_interview", 'healthy');
      Lampa.Storage.set("parse_lang", 'lg');
    }

    function showParserMenu() {
      var current = Lampa.Controller.enabled().name;
      var parsers = [];
      parsers.push({
        'title': "Lampa32",
        'url': '79.137.204.8:2601',
        'url_two': "jac_lampa32_ru",
        'jac_key': '',
        'jac_int': 'all',
        'jac_lang': 'lg'
      });
      parsers.push({
        'title': "ByLampa Jackett",
        'url': "79.137.204.8:9117",
        'url_two': "bylampa_jackett",
        'jac_key': "777",
        'jac_int': 'healthy',
        'jac_lang': 'df'
      });
      parsers.push({
        'title': "Jacred.xyz",
        'url': "jacred.xyz",
        'url_two': "jacred_xyz",
        'jac_key': '',
        'jac_int': "healthy",
        'jac_lang': 'lg'
      });
      parsers.push({
        'title': "Jacred Maxvol Pro",
        'url': "jr.maxvol.pro",
        'url_two': "jr_maxvol_pro",
        'jac_key': '',
        'jac_int': "healthy",
        'jac_lang': 'lg'
      });
      parsers.push({
        'title': "Jacred Pro ",
        'url': "jacred.pro",
        'url_two': "jacred_my_to",
        'jac_key': '',
        'jac_int': 'all',
        'jac_lang': 'lg'
      });
      parsers.push({
        'title': 'Viewbox',
        'url': "jacred.viewbox.dev",
        'url_two': 'jacred_viewbox_dev',
        'jac_key': "viewbox",
        'jac_int': "all",
        'jac_lang': 'lg'
      });
      parsers.push({
        'title': "JAOS My To Jacred",
        'url': "trs.my.to:9117",
        'url_two': "spawn_jacred",
        'jac_key': '',
        'jac_int': 'all',
        'jac_lang': 'lg'
      });
      parsers.push({
        'title': "Spawn Jackett",
        'url': "spawn.pp.ua:59117",
        'url_two': "spawn_jackett",
        'jac_key': '2',
        'jac_int': "healthy",
        'jac_lang': 'df'
      });
      parsers.push({
        'title': "Johnny Jacred",
        'url': "altjacred.duckdns.org",
        'url_two': "altjacred_duckdns_org",
        'jac_key': '',
        'jac_int': "all",
        'jac_lang': 'lg'
      });
      selectParsers(parsers).then(function (result) {
        Lampa.Select.show({
          'title': "Меню смены парсера",
          'items': result.map(function (item) {
            return {
              'title': item.title,
              'url': item.url,
              'url_two': item.url_two,
              'jac_key': item.jac_key,
              'jac_int': item.jac_int,
              'jac_lang': item.jac_lang
            };
          }),
          'onBack': function () {
            Lampa.Controller.toggle(current);
          },
          'onSelect': function (selected) {
            Lampa.Storage.set('jackett_url', selected.url);
            Lampa.Storage.set('jackett_urltwo', selected.url_two);
            Lampa.Storage.set("jackett_key", selected.jac_key);
            Lampa.Storage.set("jackett_interview", selected.jac_int);
            Lampa.Storage.set("parse_lang", selected.jac_lang);
            Lampa.Storage.set("parse_in_search", true);
            Lampa.Controller.toggle(current);
            var activity = Lampa.Storage.get('activity');
            setTimeout(function () {
              window.history.back();
            }, 1000);
            setTimeout(function () {
              Lampa.Activity.push(activity);
            }, 2000);
          }
        });
      }).catch(function (error) {
        console.error("Error:", error);
      });
    }

    function selectParsers(parsers) {
      var promises = [];
      for (var i = 0; i < parsers.length; i++) {
        promises.push(checkParser(parsers[i].url, parsers[i].title, parsers[i]));
      }
      return Promise.all(promises);
    }

  function checkParser(url, title, parserObj) {
  return new Promise(function (resolve, reject) {
    let protocol = location.protocol === "https:" ? "https://" : "http://";
    let apiKey = '';
    if (url === "spawn.pp.ua:59117") {
      apiKey = '2';
    }
    if (url === "79.137.204.8:9117") {
      apiKey = "777";
    }
    if (url === "jr.maxvol.pro") {
      protocol = "https://";
    } else {
      protocol = "http://";
    }
    let apiUrl = protocol + url + "/api/v2.0/indexers/status:healthy/results?apikey=" + apiKey;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.timeout = 3000;
    xhr.onload = function () {
      if (xhr.status === 200) {
        parserObj.title = `<span style="color: #64e364;">&#10004;&nbsp;&nbsp;${title}</span>`;
      } else {
        parserObj.title = `<span style="color: #ff2121;">&#10008;&nbsp;&nbsp;${title}</span>`;
      }
      resolve(parserObj);
    };
    xhr.onerror = function () {
      parserObj.title = `<span style="color: #ff2121;">&#10008;&nbsp;&nbsp;${title}</span>`;
      resolve(parserObj);
    };
    xhr.ontimeout = function () {
      parserObj.title = `<span style="color: #ff2121;">&#10008;&nbsp;&nbsp;${title}</span>`;
      resolve(parserObj);
    };
    xhr.send();
  });
}

function selectParsers(parsers) {
  let promises = [];
  for (let i = 0; i < parsers.length; i++) {
    promises.push(checkParser(parsers[i].url, parsers[i].title, parsers[i]));
  }
  return Promise.all(promises);
}

function showParserMenu() {
  let current = Lampa.Controller.enabled().name;
  let parsers = [];
  parsers.push({
    'title': "Lampa32",
    'url': '79.137.204.8:2601',
    'url_two': "jac_lampa32_ru",
    'jac_key': '',
    'jac_int': 'all',
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "ByLampa Jackett",
    'url': "79.137.204.8:9117",
    'url_two': "bylampa_jackett",
    'jac_key': "777",
    'jac_int': 'healthy',
    'jac_lang': 'df'
  });
  parsers.push({
    'title': "Jacred.xyz",
    'url': "jacred.xyz",
    'url_two': "jacred_xyz",
    'jac_key': '',
    'jac_int': "healthy",
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "Jacred Maxvol Pro",
    'url': "jr.maxvol.pro",
    'url_two': "jr_maxvol_pro",
    'jac_key': '',
    'jac_int': "healthy",
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "Jacred Pro",
    'url': "jacred.pro",
    'url_two': "jacred_my_to",
    'jac_key': '',
    'jac_int': 'all',
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': 'Viewbox',
    'url': "jacred.viewbox.dev",
    'url_two': 'jacred_viewbox_dev',
    'jac_key': "viewbox",
    'jac_int': "all",
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "JAOS My To Jacred",
    'url': "trs.my.to:9117",
    'url_two': "spawn_jacred",
    'jac_key': '',
    'jac_int': 'all',
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "Spawn Jackett",
    'url': "spawn.pp.ua:59117",
    'url_two': "spawn_jackett",
    'jac_key': '2',
    'jac_int': "healthy",
    'jac_lang': 'df'
  });
  parsers.push({
    'title': "Johnny Jacred",
    'url': "altjacred.duckdns.org",
    'url_two': "altjacred_duckdns_org",
    'jac_key': '',
    'jac_int': "all",
    'jac_lang': 'lg'
  });
  
  selectParsers(parsers).then(function (result) {
    Lampa.Select.show({
      'title': "Меню смены парсера",
      'items': result.map(function (item) {
        return {
          'title': item.title,
          'url': item.url,
          'url_two': item.url_two,
          'jac_key': item.jac_key,
          'jac_int': item.jac_int,
          'jac_lang': item.jac_lang
        };
      }),
      'onBack': function () {
        Lampa.Controller.toggle(current);
      },
      'onSelect': function (selected) {
        Lampa.Storage.set('jackett_url', selected.url);
        Lampa.Storage.set('jackett_urltwo', selected.url_two);
        Lampa.Storage.set("jackett_key", selected.jac_key);
        Lampa.Storage.set("jackett_interview", selected.jac_int);
        Lampa.Storage.set("parse_lang", selected.jac_lang);
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Controller.toggle(current);
        let activity = Lampa.Storage.get('activity');
        setTimeout(function () {
          window.history.back();
        }, 1000);
        setTimeout(function () {
          Lampa.Activity.push(activity);
        }, 2000);
      }
    });
  }).catch(function (error) {
    console.error("Error:", error);
  });
}

        var apiUrl = protocol + url + "/api/v2.0/indexers/status:healthy/results?apikey=" + key;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);
        xhr.timeout = 3000;
        xhr.onload = function () {
          if (xhr.status === 200) {
            parserObj.title = "<span style=\"color: #64e364;\">&#10004;&nbsp;&nbsp;" + title + "</span>";
            resolve(parserObj);
          } else {
            parserObj.title = "<span style=\"color: #ff2121;\">&#10008;&nbsp;&nbsp;" + title + "</span>";
            resolve(parserObj);
          }
        };
        xhr.onerror = function () {
          parserObj.title = "<span style=\"color: #ff2121;\">&#10008;&nbsp;&nbsp;" + title + "</span>";
          resolve(parserObj);
        };
        xhr.ontimeout = function () {
          parserObj.title = "<span style=\"color: #ff2121;\">&#10008;&nbsp;&nbsp;" + title + "</span>";
          resolve(parserObj);
        };
        xhr.send();
      });
    }

    var observer;
    Lampa.Storage.listener.follow("change", function (change) {
      if (change.name == "activity") {
        if (Lampa.Activity.active().component == "torrents") {
          startObserver();
        } else {
          stopObserver();
        }
      }
    });

    function startObserver() {
      stopObserver();
      var target = document.body;
      var config = {
        childList: true,
        subtree: true
      };
      observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if ($('.empty__title').length && Lampa.Storage.field('parser_torrent_type') == 'jackett') {
            showParserMenu();
            stopObserver();
          }
        });
      });
      observer.observe(target, config);
    }

    function stopObserver() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }

    // Здесь ранее располагался код Яндекс.Метрики – он полностью удалён.
  })();
})();
