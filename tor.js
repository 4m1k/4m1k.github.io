(function () {
  'use strict';
  Lampa.Platform.tv();

  (function () {
    // Функция для получения случайного IP-адреса TorrServer
    function fetchRandomTorrServer() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://185.87.48.42:8090/random_torr", true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const ip = xhr.responseText;
          Lampa.Storage.set('torrserver_url_two', `http://${ip}:8090`);
        } else {
          console.error("Ошибка при получении IP-адреса:", xhr.status);
          Lampa.Noty.show("Ошибка запроса");
        }
      };
      xhr.onerror = function () {
        console.error("Ошибка при получении IP-адреса:", xhr.status);
        Lampa.Noty.show("Ошибка запроса");
      };
      xhr.send();
    }

    // Добавление SVG-кнопки для смены сервера
    function addSwitchServerButton() {
      const svgButton = `
        <svg id="SWITCH_SERVER" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" style="cursor: pointer; fill: white;">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c-.79 0-1.4-.61-1.4-1.4V7c0-.79.61-1.4 1.4-1.4h1.4c.79 0 1.4.61 1.4 1.4v2.1c0 .79-.61 1.4-1.4 1.4h-1.4zM7.9 7h1.4c.79 0 1.4.61 1.4 1.4v2.1c0 .79-.61 1.4-1.4 1.4h-1.4c-.79 0-1.4-.61-1.4-1.4V8.4c0-.79.61-1.4 1.4-1.4z"/>
        </svg>
      `;

      $("#app > div.head > div > div.head__actions").append(svgButton);

      if (Lampa.Storage.get("switch_server_button") === 1) { // Не показывать
        setTimeout(() => $("#SWITCH_SERVER").hide(), 500);
      }

      if (Lampa.Storage.get("switch_server_button") === 2) { // Показывать только в торрентах
        hideShowSwitchServerOnTorrents();
      }

      if (Lampa.Storage.get("switch_server_button") === 3) { // Показывать всегда
        $("#SWITCH_SERVER").show();
      }

      if (Lampa.Storage.get("torrserv") === 0) { // Свой вариант
        hideSwitchServerButton();
      }

      // Обработчик клика на SVG-кнопку
      $("#SWITCH_SERVER").on("click", function () {
        Lampa.Noty.show("TorrServer изменён");
        fetchRandomTorrServer();
      });
    }

    // Управление видимостью кнопки
    function manageSwitchServerVisibility() {
      if (Lampa.Storage.get("switch_server_button") === 1) { // Не показывать
        hideSwitchServerButton();
      }

      if (Lampa.Storage.get("switch_server_button") === 2) { // Показывать только в торрентах
        hideShowSwitchServerOnTorrents();
      }

      if (Lampa.Storage.get("switch_server_button") === 3) { // Показывать всегда
        alwaysShowSwitchServer();
      }
    }

    function hideSwitchServerButton() {
      setTimeout(() => $("#SWITCH_SERVER").hide(), 10);
      Lampa.Storage.listener.follow("change", function (event) {
        if (event.name === "activity") {
          if (Lampa.Activity.active().component !== "torrents") {
            setTimeout(() => $("#SWITCH_SERVER").hide(), 10);
          }
          if (Lampa.Activity.active().component === "torrents") {
            setTimeout(() => $("#SWITCH_SERVER").hide(), 10);
          }
        }
      });
    }

    function hideShowSwitchServerOnTorrents() {
      setTimeout(() => $("#SWITCH_SERVER").hide(), 10);
      Lampa.Storage.listener.follow("change", function (event) {
        if (event.name === "activity") {
          if (Lampa.Activity.active().component !== "torrents") {
            setTimeout(() => $("#SWITCH_SERVER").hide(), 10);
          }
          if (Lampa.Activity.active().component === "torrents") {
            setTimeout(() => $("#SWITCH_SERVER").show(), 10);
          }
        }
      });
    }

    function alwaysShowSwitchServer() {
      setTimeout(() => $("#SWITCH_SERVER").show(), 10);
      Lampa.Storage.listener.follow("change", function (event) {
        if (event.name === "activity") {
          if (Lampa.Activity.active().component !== "torrents") {
            setTimeout(() => $("#SWITCH_SERVER").show(), 10);
          }
          if (Lampa.Activity.active().component === "torrents") {
            setTimeout(() => $("#SWITCH_SERVER").show(), 10);
          }
        }
      });
    }

    // Ожидание загрузки Lampa
    let waitForLampaInterval = setInterval(() => {
      if (typeof Lampa !== 'undefined') {
        clearInterval(waitForLampaInterval);
        initializeLampa();
      }
    }, 200);

    function initializeLampa() {
      if (localStorage.getItem("torrserv") === null || localStorage.getItem("torrserv") === "1") {
        Lampa.Storage.set("torrserver_url_two", '');
        setTimeout(() => {
          fetchRandomTorrServer();
          Lampa.Storage.set("torrserver_use_link", "two");
        }, 3000);
      }

      if (localStorage.getItem("switch_server_button") === null) {
        hideShowSwitchServerOnTorrents();
      }

      if (Lampa.Platform.is("android")) {
        Lampa.Storage.set("internal_torrclient", true);
      }
    }

    // Настройки параметров
    Lampa.SettingsApi.addParam({
      component: "server",
      param: {
        name: "torrserv",
        type: "select",
        values: {
          0: "Свой вариант",
          1: "Автовыбор"
        },
        default: 1
      },
      field: {
        name: "Free TorrServer",
        description: "Нажмите для смены сервера"
      },
      onChange: function (value) {
        if (value === "0") {
          Lampa.Storage.set("torrserver_use_link", "one");
          Lampa.Storage.set("torrserver_url_two", '');
          if (Lampa.Storage.get("switch_server_button") !== 1) {
            hideSwitchServerButton();
          }
          Lampa.Settings.update();
          return;
        }

        if (value === "1") {
          Lampa.Noty.show("TorrServer изменён");
          Lampa.Storage.set("torrserver_use_link", "two");
          fetchRandomTorrServer();
          manageSwitchServerVisibility();
          Lampa.Settings.update();
          return;
        }
      },
      onRender: function (element) {
        setTimeout(() => {
          if ($("div[data-name='torrserv']").length > 1) {
            element.hide();
          }
          $(".settings-param__name", element).css("color", "ffffff");
          $("div[data-name='torrserv']").insertAfter("div[data-name='torrserver_use_link']");
          if (Lampa.Storage.field("torrserv") === "1") {
            const focusElement = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(focusElement);
            Lampa.Controller.toggle("settings_component");
            $("div[data-name='torrserver_url_two']").hide();
            $("div[data-name='torrserver_url']").hide();
            $("div[data-name='torrserver_use_link']").hide();
            $("div > span:contains('Ссылки')").remove();
          }
          if (Lampa.Storage.field("torrserv") === "0") {
            const focusElement = document.querySelector("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div:nth-child(2)");
            Lampa.Controller.focus(focusElement);
            Lampa.Controller.toggle("settings_component");
            $("div[data-name='torrserver_url_two']").hide();
            $("div[data-name='torrserver_use_link']").hide();
            $("div[data-name='switch_server_button']").hide();
          }
        }, 0);
      }
    });

    Lampa.SettingsApi.addParam({
      component: "server",
      param: {
        name: "switch_server_button",
        type: "select",
        values: {
          1: "Не показывать",
          2: "Показывать только в торрентах",
          3: "Показывать всегда"
        },
        default: "2"
      },
      field: {
        name: "Кнопка для смены сервера",
        description: "Параметр включает отображение кнопки в верхнем баре для быстрой смены сервера"
      },
      onChange: function (value) {
        manageSwitchServerVisibility();
      },
      onRender: function (element) {
        setTimeout(() => {
          $("div[data-name='switch_server_button']").insertAfter("div[data-name='torrserver_url']");
        }, 0);
      }
    });

    // Запуск кода
    if (window.appready) {
      addSwitchServerButton();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type === "ready") {
          addSwitchServerButton();
        }
      });
    }
  })();
})();
