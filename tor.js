(function () {
  'use strict';
  Lampa.Platform.tv();
  (function () {
    var _0x116626 = function () {
      var _0x3e6549 = true;
      return function (_0x33090e, _0x5937a2) {
        var _0x1e1c87 = _0x3e6549 ? function () {
          if (_0x5937a2) {
            var _0x12e2c8 = _0x5937a2.apply(_0x33090e, arguments);
            _0x5937a2 = null;
            return _0x12e2c8;
          }
        } : function () {};
        _0x3e6549 = false;
        return _0x1e1c87;
      };
    }();
    var _0x2c5489 = function () {
      var _0x148e35 = true;
      return function (_0x5a785e, _0x4b307c) {
        var _0x52dbb4 = _0x148e35 ? function () {
          if (_0x4b307c) {
            var _0x37b9c5 = _0x4b307c.apply(_0x5a785e, arguments);
            _0x4b307c = null;
            return _0x37b9c5;
          }
        } : function () {};
        _0x148e35 = false;
        return _0x52dbb4;
      };
    }();
    var _0x268054 = function () {
      var _0x1a43c8 = true;
      return function (_0x27370d, _0x26828d) {
        var _0x1be5c0 = _0x1a43c8 ? function () {
          if (_0x26828d) {
            var _0x7a7e04 = _0x26828d.apply(_0x27370d, arguments);
            _0x26828d = null;
            return _0x7a7e04;
          }
        } : function () {};
        _0x1a43c8 = false;
        return _0x1be5c0;
      };
    }();
    'use strict';
    var _0x33ab8c = [];
    var _0x1dd014 = [
      "85.192.40.156", "91.103.252.89", "91.103.253.2", "91.108.241.197", "77.232.142.220",
      "91.108.241.143", "77.105.146.29", "217.196.107.186", "77.232.142.174", "217.196.107.0",
      "92.246.137.159", "92.246.137.4", "77.232.142.10", "46.226.160.12", "147.45.74.199", "46.226.160.78"
    ];

    function _0x4e1902(_0x47f002, _0x50253e) {
      if (_0x47f002) {
        return _0x1dd014[_0x50253e];
      }
      if (_0x33ab8c.length === 0) {
        return _0x1dd014[Math.floor(Math.random() * _0x1dd014.length)];
      }
      var _0x1cdb9c = Math.floor(Math.random() * _0x33ab8c.length);
      var _0x215018 = _0x33ab8c[_0x1cdb9c];
      return _0x215018;
    }

    function _0x2b8740(_0x25a56e) {
      setTimeout(function () {
        var _0x404ba0 = "http://" + _0x1dd014[_0x25a56e] + ":8090";
        var _0x117f97 = new XMLHttpRequest();
        _0x117f97.timeout = 2000;
        _0x117f97.open("GET", _0x404ba0, true);
        _0x117f97.send();
        _0x117f97.onload = function () {
          if (_0x117f97.status == 200) {
            _0x33ab8c.push(_0x1dd014[_0x25a56e]);
          }
        };
        _0x117f97.ontimeout = function () {};
        _0x117f97.onerror = function () {};
      }, 1000);
    }

    function _0x4a258a() {
      for (var _0x13e0a5 = 0; _0x13e0a5 < _0x1dd014.length; _0x13e0a5++) {
        _0x2b8740(_0x13e0a5);
      }
    }

    function _0x38e1e5() {
      var _0xd8af6a = _0x116626(this, function () {
        return _0xd8af6a.toString().search("(((.+)+)+)+$").toString().constructor(_0xd8af6a).search("(((.+)+)+)+$");
      });
      _0xd8af6a();
      (function () {
        _0x2c5489(this, function () {
          var _0x3702e5 = new RegExp("function *\\( *\\)");
          var _0x1f8d51 = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", 'i');
          var _0x12f223 = _0x596edb("init");
          if (!_0x3702e5.test(_0x12f223 + "chain") || !_0x1f8d51.test(_0x12f223 + "input")) {
            _0x12f223('0');
          } else {
            _0x596edb();
          }
        })();
      })();
      $("#app > div.head > div > div.head__actions").append("<button id=\"SWITCH_SERVER\">Сменить сервер</button>");
      $("#SWITCH_SERVER").insertAfter("div[class=\"head__action selector open--settings\"]");
      if (Lampa.Storage.get("switch_server_button") == 1) {
        setTimeout(function () {
          $("#SWITCH_SERVER").hide();
        }, 500);
      }
      if (Lampa.Storage.get("switch_server_button") == 2) {
        _0x56a742();
      }
      if (Lampa.Storage.get("switch_server_button") == 3) {
        $("#SWITCH_SERVER").show();
      }
      $("#SWITCH_SERVER").on("hover:enter hover:click hover:touch", function () {
        console.log("Кнопка нажата");
        Lampa.Storage.set("torrserver_url_two", "http://" + _0x4e1902() + ":8090");
        console.log("URL установлен: " + Lampa.Storage.get("torrserver_url_two"));
        Lampa.Noty.show("TorrServer изменён");
      });
    }

    function _0x56a742() {
      setTimeout(function () {
        $("#SWITCH_SERVER").hide();
      }, 500);
      Lampa.Storage.listener.follow("change", function (_0x1bd169) {
        if (_0x1bd169.name == "activity") {
          if (Lampa.Activity.active().component !== "torrents") {
            setTimeout(function () {
              $("#SWITCH_SERVER").hide();
            }, 10);
          }
          if (Lampa.Activity.active().component === "torrents") {
            $("#SWITCH_SERVER").show();
          }
        }
      });
    }

    var _0x29cb14 = setInterval(function () {
      if (typeof Lampa !== "undefined") {
        clearInterval(_0x29cb14);
        _0x1c52c5();
      }
    }, 200);

    function _0x1c52c5() {
      if (localStorage.getItem("torrserv") === null || localStorage.getItem("torrserv") == 1) {
        Lampa.Storage.set("torrserver_url_two", '');
        setTimeout(function () {
          Lampa.Storage.set("torrserver_use_link", "two");
          var _0x5f53bc = _0x4e1902();
          if (_0x5f53bc !== "undefined") {
            Lampa.Storage.set("torrserver_url_two", "http://" + _0x5f53bc + ":8090");
          }
        }, 4000);
      }
      if (localStorage.getItem("switch_server_button") === null) {
        _0x56a742();
      }
      if (Lampa.Platform.is("android")) {
        Lampa.Storage.set("internal_torrclient", true);
      }
    }

    Lampa.SettingsApi.addParam({
      'component': "server",
      'param': {
        'name': "torrserv",
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
      'onChange': function (_0x23c8d8) {
        if (_0x23c8d8 == '0') {
          Lampa.Storage.set("torrserver_use_link", "one");
          Lampa.Storage.set("torrserver_url_two", '');
          Lampa.Settings.update();
          return;
        }
        if (_0x23c8d8 == '1') {
          Lampa.Noty.show("TorrServer изменён");
          Lampa.Storage.set("torrserver_use_link", "two");
          Lampa.Storage.set("torrserver_url_two", "http://" + _0x4e1902() + ":8090");
          Lampa.Settings.update();
          return;
        }
      },
      'onRender': function (_0x29c1ba) {
        setTimeout(function () {
          if ($("div[data-name=\"torrserv\"]").length > 1) {
            _0x29c1ba.hide();
          }
          $(".settings-param__name", _0x29c1ba).css("color", "ffffff");
          $("div[data-name=\"torrserv\"]").insertAfter("div[data-name=\"torrserver_use_link\"]");
          if (Lampa.Storage.field("torrserv") == '1') {
            var _0x3e806d = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(_0x3e806d);
            Lampa.Controller.toggle("settings_component");
            $("div[data-name=\"torrserver_url_two\"]").hide();
            $("div[data-name=\"torrserver_url\"]").hide();
            $("div[data-name=\"torrserver_use_link\"]").hide();
            $("div > span:contains(\"Ссылки\")").remove();
          }
          if (Lampa.Storage.field("torrserv") == '0') {
            var _0x3e806d = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(_0x3e806d);
            Lampa.Controller.toggle("settings_component");
            $("div[data-name=\"torrserver_url_two\"]").hide();
            $("div[data-name=\"torrserver_use_link\"]").hide();
          }
        }, 0);
      }
    });

    Lampa.SettingsApi.addParam({
      'component': "server",
      'param': {
        'name': "switch_server_button",
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
      'onChange': function (_0x1dfebb) {
        if (_0x1dfebb == '1') {
          setTimeout(function () {
            $("#SWITCH_SERVER").hide();
          }, 10);
          Lampa.Storage.listener.follow("change", function (_0x97b7ac) {
            if (_0x97b7ac.name == "activity") {
              if (Lampa.Activity.active().component !== "torrents") {
                setTimeout(function () {
                  $("#SWITCH_SERVER").hide();
                }, 10);
              }
              if (Lampa.Activity.active().component === "torrents") {
                setTimeout(function () {
                  $("#SWITCH_SERVER").show();
                }, 10);
              }
            }
          });
        }
        if (_0x1dfebb == '2') {
          _0x56a742();
        }
        if (_0x1dfebb == '3') {
          setTimeout(function () {
            $("#SWITCH_SERVER").show();
          }, 10);
          Lampa.Storage.listener.follow("change", function (_0x1c9885) {
            if (_0x1c9885.name == "activity") {
              if (Lampa.Activity.active().component !== "torrents") {
                setTimeout(function () {
                  $("#SWITCH_SERVER").show();
                }, 10);
              }
              if (Lampa.Activity.active().component === "torrents") {
                setTimeout(function () {
                  $("#SWITCH_SERVER").show();
                }, 10);
              }
            }
          });
        }
      },
      'onRender': function (_0x5ce5c1) {
        setTimeout(function () {
          $("div[data-name=\"switch_server_button\"]").insertAfter("div[data-name=\"torrserver_url\"]");
        }, 0);
      }
    });

    if (window.appready) {
      _0x38e1e5();
      _0x4a258a();
    } else {
      Lampa.Listener.follow("app", function (_0x296d2c) {
        if (_0x296d2c.type == "ready") {
          _0x38e1e5();
          _0x4a258a();
        }
      });
    }
  })();

  function _0x596edb(_0x1579d0) {
    function _0x217155(_0x161ef4) {
      if (typeof _0x161ef4 === "string") {
        return function (_0x7ce708) {}.constructor("while (true) {}").apply("counter");
      } else if (('' + _0x161ef4 / _0x161ef4).length !== 1 || _0x161ef4 % 20 === 0) {
        (function () {
          return true;
        }).constructor("debugger").call("action");
      } else {
        (function () {
          return false;
        }).constructor("debugger").apply("stateObject");
      }
      _0x217155(++_0x161ef4);
    }
    try {
      if (_0x1579d0) {
        return _0x217155;
      } else {
        _0x217155(0);
      }
    } catch (_0x79d4c) {}
  }
})();
