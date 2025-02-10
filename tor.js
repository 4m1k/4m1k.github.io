
(function () {
  'use strict';
  Lampa.Platform.tv();
  (function () {
    var _0x5917a9 = function () {
      var _0x11496a = true;
      return function (_0xea7a1e, _0x2010e7) {
        var _0x5d9f34 = _0x11496a ? function () {
          if (_0x2010e7) {
            var _0x4d469c = _0x2010e7.apply(_0xea7a1e, arguments);
            _0x2010e7 = null;
            return _0x4d469c;
          }
        } : function () {};
        _0x11496a = false;
        return _0x5d9f34;
      };
    }();
    var _0xb30c98 = function () {
      var _0x2c4c75 = true;
      return function (_0x50a8c4, _0xbfb8ab) {
        var _0x304586 = _0x2c4c75 ? function () {
          if (_0xbfb8ab) {
            var _0x51df26 = _0xbfb8ab.apply(_0x50a8c4, arguments);
            _0xbfb8ab = null;
            return _0x51df26;
          }
        } : function () {};
        _0x2c4c75 = false;
        return _0x304586;
      };
    }();
    'use strict';
    function _0x743d45() {
      var _0x23f3da = new XMLHttpRequest();
      _0x23f3da.open("GET", "http://185.87.48.42:8090/random_torr", true);
      _0x23f3da.onload = function () {
        if (_0x23f3da.status === 0xc8) {
          var _0x508bce = _0x23f3da.responseText;
          Lampa.Storage.set('torrserver_url_two', "http://" + _0x508bce + ":8090");
        } else {
          console.error("Ошибка при получении IP-адреса:", _0x23f3da.status);
          Lampa.Noty.show("Ошибка запроса");
        }
      };
      _0x23f3da.onerror = function () {
        console.error("Ошибка при получении IP-адреса:", _0x23f3da.status);
        Lampa.Noty.show("Ошибка запроса");
      };
      _0x23f3da.send();
    }
    function _0x4d477a() {
      var _0xa72ed = _0x5917a9(this, function () {
        return _0xa72ed.toString().search("(((.+)+)+)+$").toString().constructor(_0xa72ed).search("(((.+)+)+)+$");
      });
      _0xa72ed();
      var _0xed6aa8 = _0xb30c98(this, function () {
        var _0x30dea7 = function () {
          var _0x9ac59b;
          try {
            _0x9ac59b = Function("return (function() {}.constructor(\"return this\")( ));")();
          } catch (_0x2e4bab) {
            _0x9ac59b = window;
          }
          return _0x9ac59b;
        };
        var _0x2b24d3 = _0x30dea7();
        var _0x916ab4 = _0x2b24d3.console = _0x2b24d3.console || {};
        var _0x500481 = ["log", 'warn', "info", "error", 'exception', "table", 'trace'];
        for (var _0x465809 = 0x0; _0x465809 < _0x500481.length; _0x465809++) {
          var _0x4c259b = _0xb30c98.constructor.prototype.bind(_0xb30c98);
          var _0x31d859 = _0x500481[_0x465809];
          var _0x1622f7 = _0x916ab4[_0x31d859] || _0x4c259b;
          _0x4c259b.__proto__ = _0xb30c98.bind(_0xb30c98);
          _0x4c259b.toString = _0x1622f7.toString.bind(_0x1622f7);
          _0x916ab4[_0x31d859] = _0x4c259b;
        }
      });
      _0xed6aa8();
      $("#app > div.head > div > div.head__actions").append("	");
      $("#SWITCH_SERVER").insertAfter("div[class=\"head__action selector open--settings\"]");
      if (Lampa.Storage.get("switch_server_button") == 0x1) {
        setTimeout(function () {
          $("#SWITCH_SERVER").hide();
        }, 0x1f4);
      }
      if (Lampa.Storage.get("switch_server_button") == 0x2) {
        _0x53bf62();
      }
      if (Lampa.Storage.get("switch_server_button") == 0x3) {
        $("#SWITCH_SERVER").show();
      }
      if (Lampa.Storage.get("torrserv") == 0x0) {
        _0x4f8816();
      }
      $("#SWITCH_SERVER").on("hover:enter hover:click hover:touch", function () {
        Lampa.Noty.show("TorrServer изменён");
        _0x743d45();
      });
    }
    function _0x497abe() {
      if (Lampa.Storage.get("switch_server_button") == 0x1) {
        _0x4f8816();
      }
      if (Lampa.Storage.get('switch_server_button') == 0x2) {
        _0x53bf62();
      }
      if (Lampa.Storage.get("switch_server_button") == 0x3) {
        _0x59bfcb();
      }
    }
    function _0x4f8816() {
      setTimeout(function () {
        $("#SWITCH_SERVER").hide();
      }, 0xa);
      Lampa.Storage.listener.follow("change", function (_0x1b4037) {
        if (_0x1b4037.name == "activity") {
          if (Lampa.Activity.active().component !== "torrents") {
            setTimeout(function () {
              $("#SWITCH_SERVER").hide();
            }, 0xa);
          }
          if (Lampa.Activity.active().component === "torrents") {
            setTimeout(function () {
              $("#SWITCH_SERVER").hide();
            }, 0xa);
          }
        }
      });
    }
    function _0x53bf62() {
      setTimeout(function () {
        $('#SWITCH_SERVER').hide();
      }, 0xa);
      Lampa.Storage.listener.follow("change", function (_0x1fd0d2) {
        if (_0x1fd0d2.name == "activity") {
          if (Lampa.Activity.active().component !== "torrents") {
            setTimeout(function () {
              $("#SWITCH_SERVER").hide();
            }, 0xa);
          }
          if (Lampa.Activity.active().component === "torrents") {
            setTimeout(function () {
              $("#SWITCH_SERVER").show();
            }, 0xa);
          }
        }
      });
    }
    function _0x59bfcb() {
      setTimeout(function () {
        $("#SWITCH_SERVER").show();
      }, 0xa);
      Lampa.Storage.listener.follow('change', function (_0x27cbfd) {
        if (_0x27cbfd.name == 'activity') {
          if (Lampa.Activity.active().component !== "torrents") {
            setTimeout(function () {
              $("#SWITCH_SERVER").show();
            }, 0xa);
          }
          if (Lampa.Activity.active().component === "torrents") {
            setTimeout(function () {
              $("#SWITCH_SERVER").show();
            }, 0xa);
          }
        }
      });
    }
    var _0x4d238c = setInterval(function () {
      if (typeof Lampa !== 'undefined') {
        clearInterval(_0x4d238c);
        _0x41a53f();
      }
    }, 0xc8);
    function _0x41a53f() {
      if (localStorage.getItem("torrserv") === null || localStorage.getItem("torrserv") == 0x1) {
        Lampa.Storage.set("torrserver_url_two", '');
        setTimeout(function () {
          _0x743d45();
          Lampa.Storage.set("torrserver_use_link", "two");
        }, 0xbb8);
      }
      if (localStorage.getItem("switch_server_button") === null) {
        _0x53bf62();
      }
      if (Lampa.Platform.is("android")) {
        Lampa.Storage.set("internal_torrclient", true);
      }
    }
    Lampa.SettingsApi.addParam({
      'component': "server",
      'param': {
        'name': 'torrserv',
        'type': "select",
        'values': {
          0x0: "Свой вариант",
          0x1: "Автовыбор"
        },
        'default': 0x1
      },
      'field': {
        'name': "Free TorrServer",
        'description': "Нажмите для смены сервера"
      },
      'onChange': function (_0x12773f) {
        if (_0x12773f == '0') {
          Lampa.Storage.set("torrserver_use_link", "one");
          Lampa.Storage.set("torrserver_url_two", '');
          if (Lampa.Storage.get("switch_server_button") !== 0x1) {
            _0x4f8816();
          }
          Lampa.Settings.update();
          return;
        }
        if (_0x12773f == '1') {
          Lampa.Noty.show("TorrServer изменён");
          Lampa.Storage.set('torrserver_use_link', "two");
          _0x743d45();
          _0x497abe();
          Lampa.Settings.update();
          return;
        }
      },
      'onRender': function (_0x21d320) {
        setTimeout(function () {
          if ($("div[data-name=\"torrserv\"]").length > 0x1) {
            _0x21d320.hide();
          }
          $(".settings-param__name", _0x21d320).css("color", 'ffffff');
          $("div[data-name=\"torrserv\"]").insertAfter("div[data-name=\"torrserver_use_link\"]");
          if (Lampa.Storage.field("torrserv") == '1') {
            var _0x3a5f6b = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(_0x3a5f6b);
            Lampa.Controller.toggle("settings_component");
            $("div[data-name=\"torrserver_url_two\"]").hide();
            $("div[data-name=\"torrserver_url\"]").hide();
            $("div[data-name=\"torrserver_use_link\"]").hide();
            $("div > span:contains(\"Ссылки\")").remove();
          }
          if (Lampa.Storage.field("torrserv") == '0') {
            var _0x3a5f6b = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(_0x3a5f6b);
            Lampa.Controller.toggle('settings_component');
            $("div[data-name=\"torrserver_url_two\"]").hide();
            $("div[data-name=\"torrserver_use_link\"]").hide();
            $("div[data-name=\"switch_server_button\"]").hide();
          }
        }, 0x0);
      }
    });
    Lampa.SettingsApi.addParam({
      'component': "server",
      'param': {
        'name': 'switch_server_button',
        'type': "select",
        'values': {
          0x1: "Не показывать",
          0x2: "Показывать только в торрентах",
          0x3: "Показывать всегда"
        },
        'default': '2'
      },
      'field': {
        'name': "Кнопка для смены сервера",
        'description': "Параметр включает отображение кнопки в верхнем баре для быстрой смены сервера"
      },
      'onChange': function (_0x574da5) {
        _0x497abe();
      },
      'onRender': function (_0x53f0cd) {
        setTimeout(function () {
          $("div[data-name=\"switch_server_button\"]").insertAfter("div[data-name=\"torrserver_url\"]");
        }, 0x0);
      }
    });
    if (window.appready) {
      _0x4d477a();
    } else {
      Lampa.Listener.follow("app", function (_0x1e18f6) {
        if (_0x1e18f6.type == "ready") {
          _0x4d477a();
        }
      });
    }
  })();
})();
