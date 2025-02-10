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
      // Добавляем отступ (пробел) перед кнопкой
      $("#app > div.head > div > div.head__actions").append("	");

      // Создаем SVG-кнопку для смены сервера
      const svgButton = `
        <svg id="SWITCH_SERVER" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="cursor: pointer; fill: white;">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c-.79 0-1.4-.61-1.4-1.4V7c0-.79.61-1.4 1.4-1.4h1.4c.79 0 1.4.61 1.4 1.4v2.1c0 .79-.61 1.4-1.4 1.4h-1.4zM7.9 7h1.4c.79 0 1.4.61 1.4 1.4v2.1c0 .79-.61 1.4-1.4 1.4h-1.4c-.79 0-1.4-.61-1.4-1.4V8.4c0-.79.61-1.4 1.4-1.4z"/>
        </svg>
      `;

      // Вставляем SVG-кнопку после элемента "open--settings"
      $("#app > div.head > div > div.head__actions").append(svgButton);
      $("#SWITCH_SERVER").insertAfter("div[class='head__action selector open--settings']");

      // Управление видимостью кнопки в зависимости от настроек
      if (Lampa.Storage.get("switch_server_button") === 1) { // Не показывать
        setTimeout(() => $("#SWITCH_SERVER").hide(), 500);
      }
      if (Lampa.Storage.get("switch_server_button") === 2) { // Показывать только в торрентах
        hideShowSwitchServerOnTorrents();
      }
      if (Lampa.Storage.get("switch_server_button") === 3) { // Показывать всегда
        $("#SWITCH_SERVER").show();
      }

      // Обработчик клика на кнопку
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

    // Скрытие кнопки
    function hideSwitchServerButton() {
      setTimeout(() => $("#SWITCH_SERVER").hide(), 10);
    }

    // Показ кнопки только в торрентах
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

    // Всегда показывать кнопку
    function alwaysShowSwitchServer() {
      setTimeout(() => $("#SWITCH_SERVER").show(), 10);
    }

    // Ожидание загрузки Lampa
    let waitForLampaInterval = setInterval(() => {
      if (typeof Lampa !== 'undefined') {
        clearInterval(waitForLampaInterval);
        initializeLampa();
      }
    }, 200);

    // Инициализация приложения
    function initializeLampa() {
      addSwitchServerButton();
      manageSwitchServerVisibility();

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

    // Запуск кода
    if (window.appready) {
      initializeLampa();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type === "ready") {
          initializeLampa();
        }
      });
    }
  })();
})();
