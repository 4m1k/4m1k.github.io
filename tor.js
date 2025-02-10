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
        <svg id="Layer_1" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path fill="currentColor" d="m55.87184 19.89889c-2.51957-21.44026-31.01766-27.41126-41.90612-8.682-17.52007 3.29285-18.96222 27.59324-2.01854 33.01066l-.00024 4.75864a4.95216 4.95216 0 0 0 1.0277 3.00276c-1.46914 1.59088-.94325 5.02866-1.02768 7.00648a5.01335 5.01335 0 0 0 5.01035 5.00457h30.06222a5.01338 5.01338 0 0 0 5.01037-5.0046c-.08353-1.99477.44019-5.41575-1.02775-7.0064 1.47114-1.58462.94292-5.0802 1.02773-7.05723 13.67458-1.20877 16.54164-19.7683 3.84196-25.03288zm-7.85023 29.0873a1.00249 1.00249 0 0 1 -1.00208 1.00092h-30.06222a1.00248 1.00248 0 0 1 -1.00207-1.00092v-12.011a1.00249 1.00249 0 0 1 1.00207-1.00092h30.06222a1.0025 1.0025 0 0 1 1.00208 1.00092zm0 10.00921a1.0025 1.0025 0 0 1 -1.00208 1.00092h-30.06222a1.00249 1.00249 0 0 1 -1.00207-1.00092v-4.00369a1.00249 1.00249 0 0 1 1.00207-1.00092h30.06222a1.0025 1.0025 0 0 1 1.00208 1.00092zm4.00829-18.07559v-3.94467a5.01338 5.01338 0 0 0 -5.01037-5.0046h-30.06222a5.01339 5.01339 0 0 0 -5.01037 5.0046v2.9983a13.00415 13.00415 0 0 1 3.52292-24.93107 2.0041 2.0041 0 0 0 1.554-1.06934c8.76556-16.658 33.81091-11.29409 34.959 7.5037a2.002 2.002 0 0 0 1.464 1.82275c9.48906 2.76289 8.34895 16.43205-1.41696 17.62033z"></path><path fill="currentColor" d="m32.9905 40.97882a2.002 2.002 0 0 0 .00008 4.00368 2.002 2.002 0 0 0 -.00008-4.00368z"></path><path fill="currentColor" d="m41.00709 40.97882a2.002 2.002 0 0 0 .00008 4.00368 2.002 2.002 0 0 0 -.00008-4.00368z"></path></svg>
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
