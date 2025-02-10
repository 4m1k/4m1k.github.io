(function () {
  'use strict';
  Lampa.Platform.tv();
  (function () {
    'use strict';
    var ipAddresses = [
      "85.192.40.156", "91.103.252.89", "91.103.253.2", "91.108.241.197", "77.232.142.220",
      "91.108.241.143", "77.105.146.29", "217.196.107.186", "77.232.142.174", "217.196.107.0",
      "92.246.137.159", "92.246.137.4", "77.232.142.10", "46.226.160.12", "147.45.74.199", "46.226.160.78"
    ];
    var availableIps = [];

    function getIpAddress(useSpecificIndex, index) {
      if (useSpecificIndex) {
        return ipAddresses[index];
      }
      var randomIndex = Math.floor(Math.random() * availableIps.length);
      return availableIps[randomIndex];
    }

    function checkIpAvailability(index) {
      setTimeout(function () {
        var url = "http://" + ipAddresses[index] + ":8090";
        var xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onload = function () {
          if (xhr.status == 200) {
            availableIps.push(ipAddresses[index]);
          }
        };
      }, 1000);
    }

    function checkAllIps() {
      for (var i = 0; i < ipAddresses.length; i++) {
        checkIpAvailability(i);
      }
    }

    function initialize() {
      $("#app > div.head > div > div.head__actions").append(" ");
      $("#SWITCH_SERVER").insertAfter("div[class=\"head__action selector open--settings\"]");

      if (Lampa.Storage.get("switch_server_button") == 1) {
        setTimeout(function () {
          $("#SWITCH_SERVER").hide();
        }, 500);
      }
      if (Lampa.Storage.get("switch_server_button") == 2) {
        toggleServerButtonVisibility();
      }
      if (Lampa.Storage.get("switch_server_button") == 3) {
        $("#SWITCH_SERVER").show();
      }

      $("#SWITCH_SERVER").on("hover:enter hover:click hover:touch", function () {
        Lampa.Storage.set("torrserver_url_two", "http://" + getIpAddress() + ":8090");
        Lampa.Noty.show("TorrServer изменён");
      });
    }

    function toggleServerButtonVisibility() {
      setTimeout(function () {
        $("#SWITCH_SERVER").hide();
      }, 500);
      Lampa.Storage.listener.follow("change", function (event) {
        if (event.name == "activity") {
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

    var intervalId = setInterval(function () {
      if (typeof Lampa !== "undefined") {
        clearInterval(intervalId);
        initializeApp();
      }
    }, 200);

    function initializeApp() {
      if (localStorage.getItem("torrserv") === null || localStorage.getItem("torrserv") == 1) {
        Lampa.Storage.set("torrserver_url_two", '');
        setTimeout(function () {
          Lampa.Storage.set("torrserver_use_link", "two");
          var ipAddress = getIpAddress();
          if (ipAddress !== "undefined") {
            Lampa.Storage.set("torrserver_url_two", "http://" + ipAddress + ":8090");
          }
        }, 4000);
      }
      if (localStorage.getItem("switch_server_button") === null) {
        toggleServerButtonVisibility();
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
          0: "Свой вариант",
          1: "Автовыбор"
        },
        'default': 1
      },
      'field': {
        'name': "Free TorrServer",
        'description': "Нажмите для смены сервера"
      },
      'onChange': function (value) {
        if (value == '0') {
          Lampa.Storage.set("torrserver_use_link", "one");
          Lampa.Storage.set("torrserver_url_two", '');
          Lampa.Settings.update();
        }
        if (value == '1') {
          Lampa.Noty.show("TorrServer изменён");
          Lampa.Storage.set("torrserver_use_link", "two");
          Lampa.Storage.set("torrserver_url_two", "http://" + getIpAddress() + ":8090");
          Lampa.Settings.update();
        }
      },
      'onRender': function (element) {
        setTimeout(function () {
          if ($("div[data-name=\"torrserv\"]").length > 1) {
            element.hide();
          }
          $(".settings-param__name", element).css("color", "ffffff");
          $("div[data-name=\"torrserv\"]").insertAfter("div[data-name=\"torrserver_use_link\"]");
          if (Lampa.Storage.field("torrserv") == '1') {
            var focusElement = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(focusElement);
            Lampa.Controller.toggle("settings_component");
            $("div[data-name=\"torrserver_url_two\"]").hide();
            $("div[data-name=\"torrserver_url\"]").hide();
            $("div[data-name=\"torrserver_use_link\"]").hide();
            $("div > span:contains(\"Ссылки\")").remove();
          }
          if (Lampa.Storage.field("torrserv") == '0') {
            var focusElement = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(focusElement);
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
          1: "Не показывать",
          2: "Показывать только в торрентах",
          3: "Показывать всегда"
        },
        'default': '2'
      },
      'field': {
        'name': "Кнопка для смены сервера",
        'description': "Параметр включает отображение кнопки в верхнем баре для быстрой смены сервера"
      },
      'onChange': function (value) {
        if (value == '1') {
          setTimeout(function () {
            $("#SWITCH_SERVER").hide();
          }, 10);
          Lampa.Storage.listener.follow("change", function (event) {
            if (event.name == "activity") {
              if (Lampa.Activity.active().component !== "torrents") {
                setTimeout(function () {
                  $("#SWITCH_SERVER").hide();
                }, 10);
              }
              if (Lampa.Activity.active().component === "torrents") {
                setTimeout(function () {
                  $("#SWITCH_SERVER").hide();
                }, 10);
              }
            }
          });
        }
        if (value == '2') {
          toggleServerButtonVisibility();
        }
        if (value == '3') {
          setTimeout(function () {
            $("#SWITCH_SERVER").show();
          }, 10);
          Lampa.Storage.listener.follow("change", function (event) {
            if (event.name == "activity") {
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
      'onRender': function (element) {
        setTimeout(function () {
          $("div[data-name=\"switch_server_button\"]").insertAfter("div[data-name=\"torrserver_url\"]");
        }, 0);
      }
    });

    if (window.appready) {
      initialize();
      checkAllIps();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type == "ready") {
          initialize();
          checkAllIps();
        }
      });
    }
  })();
})();
