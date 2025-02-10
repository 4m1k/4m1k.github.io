(function () {
  'use strict';
  Lampa.Platform.tv();

  (function () {
    function _0x743d45() {
      {
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
      } else {
        Lampa.Noty.show("Ошибка доступа");
      }
    }

    function addOriginalSwitchServerButton() {
      const buttonHtml = `
        <div id="SWITCH_SERVER" class="switch-server-button">
          Сменить сервер
        </div>
      `;

      $("#app > div.head > div > div.head__actions").append(buttonHtml);
      $("#SWITCH_SERVER").insertAfter("div[class='head__action selector open--settings']");

      $("#SWITCH_SERVER").on("hover:enter hover:click hover:touch", function () {
        Lampa.Noty.show("TorrServer изменён");
        _0x743d45();
      });
    }

    function manageSwitchServerVisibility() {
      if (Lampa.Storage.get("switch_server_button") == 0x1) {
        setTimeout(() => $("#SWITCH_SERVER").hide(), 10);
      }

      if (Lampa.Storage.get("switch_server_button") == 0x2) {
        hideShowSwitchServerOnTorrents();
      }

      if (Lampa.Storage.get("switch_server_button") == 0x3) {
        $("#SWITCH_SERVER").show();
      }
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

    let waitForLampaInterval = setInterval(() => {
      if (typeof Lampa !== 'undefined') {
        clearInterval(waitForLampaInterval);
        initializeLampa();
      }
    }, 200);

    function initializeLampa() {
      addOriginalSwitchServerButton();
      manageSwitchServerVisibility();

      if (localStorage.getItem("torrserv") === null || localStorage.getItem("torrserv") == 0x1) {
        Lampa.Storage.set("torrserver_url_two", '');
        setTimeout(() => {
          _0x743d45();
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
  })();
})();
