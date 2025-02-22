(function () {
  'use strict';

  Lampa.Platform.tv();

  // --- Функции проверки парсера ---

  // Функция для проверки одного парсера.
  // Отправляет запрос к URL:
  // protocol + parser.url + "/api/v2.0/indexers/status:healthy/results?apikey=" + parser.apiKey
  // Если сервер отвечает статусом 200 – parser.status=true, иначе false.
  function checkParser(parser) {
    return new Promise((resolve) => {
      const protocol = location.protocol === "https:" ? "https://" : "http://";
      const apiUrl = protocol + parser.url + "/api/v2.0/indexers/status:healthy/results?apikey=" + parser.apiKey;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", apiUrl, true);
      xhr.timeout = 1000; // таймаут 3 секунды
      xhr.onload = function () {
        parser.status = (xhr.status === 200);
        resolve(parser);
      };
      xhr.onerror = function () {
        parser.status = false;
        resolve(parser);
      };
      xhr.ontimeout = function () {
        parser.status = false;
        resolve(parser);
      };
      xhr.send();
    });
  }

  // Функция проверки всех парсеров.
  function checkAllParsers() {
    // Список стандартных парсеров.
    const parsers = [
      { title: "Lampa32",             url: "79.137.204.8:2601", apiKey: "" },
      { title: "ByLampa Jackett",      url: "79.137.204.8:9117", apiKey: "777" },
      { title: "Jacred.xyz",           url: "jacred.xyz",        apiKey: "" },
      { title: "Jacred Maxvol Pro",    url: "jr.maxvol.pro",       apiKey: "" },
      { title: "Jacred Pro",           url: "jacred.pro",         apiKey: "" },
      { title: "Viewbox",              url: "jacred.viewbox.dev", apiKey: "viewbox" },
      { title: "JAOS My To Jacred",     url: "trs.my.to:9117",      apiKey: "" },
      { title: "Spawn Jackett",        url: "spawn.pp.ua:59117",   apiKey: "2" },
      { title: "Johnny Jacred",        url: "altjacred.duckdns.org", apiKey: "" }
    ];
    return Promise.all(parsers.map(parser => checkParser(parser)));
  }

  // --- Формирование меню выбора парсера ---
  function showParserSelectionMenu() {
    checkAllParsers().then(results => {
      // Добавляем в начало список дополнительный пункт "Свой вариант"
      results.unshift({
        title: "Свой вариант",
        url: "",
        apiKey: "",
        status: true // по умолчанию считаем его рабочим
      });

      // Формируем элементы меню с подсветкой:
      // Если parser.status===true – зелёная галочка, иначе – красный крестик.
      const items = results.map(parser => {
        const statusIcon = parser.status
          ? '<span style="color: #64e364;">&#10004;</span>'
          : '<span style="color: #ff2121;">&#10008;</span>';
        return {
          title: statusIcon + " " + parser.title,
          parser: parser
        };
      });

      Lampa.Select.show({
        title: "Меню смены парсера",
        items: items,
        onBack: function () {
          Lampa.Controller.toggle("settings_component");
        },
        onSelect: function (item) {
          // Если выбран пункт "Свой вариант", сохраняем специальное значение "no_parser"
          if(item.parser.title === "Свой вариант") {
            Lampa.Storage.set('jackett_url', "");
            Lampa.Storage.set('jackett_key', "");
            Lampa.Storage.set('selected_parser', "Свой вариант");
          } else {
            Lampa.Storage.set('jackett_url', item.parser.url);
            Lampa.Storage.set('jackett_key', item.parser.apiKey);
            Lampa.Storage.set('selected_parser', item.parser.title);
          }
          console.log("Выбран парсер:", item.parser);
          updateParserField(item.title);
          Lampa.Controller.toggle("settings_component");
          Lampa.Settings.update();
        }
      });
    });
  }

  // Функция обновления отображения пункта "Выбрать парсер" в настройках
  function updateParserField(text) {
    $("div[data-name='jackett_urltwo']").html(
      `<div class="settings-folder" style="padding:0!important">
         <div style="width:1.3em;height:1.3em;padding-right:.1em">
           <!-- SVG-иконка при необходимости -->
         </div>
         <div style="font-size:1.0em">
           <div style="padding: 0.3em 0.3em; padding-top: 0;">
             <div style="background: #d99821; padding: 0.5em; border-radius: 0.4em;">
               <div style="line-height: 0.3;">${text}</div>
             </div>
           </div>
         </div>
       </div>`
    );
  }

  // --- Интеграция в настройки ---
  Lampa.SettingsApi.addParam({
    component: "parser",
    param: {
      name: "jackett_urltwo",
      type: "select",
      values: {
        no_parser: "Свой вариант",
        jac_lampa32_ru: "Lampa32",
        bylampa_jackett: "ByLampa Jackett",
        jacred_xyz: "Jacred.xyz",
        jr_maxvol_pro: "Jacred Maxvol Pro",
        jacred_my_to: "Jacred Pro",
        jacred_viewbox_dev: "Viewbox",
        spawn_jacred: "JAOS My To Jacred",
        spawn_jackett: "Spawn Jackett",
        altjacred_duckdns_org: "Johnny Jacred"
      },
      default: 'jacred_xyz'
    },
    field: {
      name: `<div class="settings-folder" style="padding:0!important">
                <div style="width:1.3em;height:1.3em;padding-right:.1em">
                  <!-- SVG-иконка при необходимости -->
                </div>
                <div style="font-size:1.0em">
                  <div style="padding: 0.3em 0.3em; padding-top: 0;">
                    <div style="background: #d99821; padding: 0.5em; border-radius: 0.4em;">
                      <div style="line-height: 0.3;">Выбрать парсер</div>
                    </div>
                  </div>
                </div>
              </div>`,
      description: "Нажмите для выбора парсера из списка"
    },
    onChange: function (value) {
      Lampa.Settings.update();
    },
    onRender: function (elem) {
      setTimeout(function () {
        $("div[data-children='parser']").on("hover:enter", function () {
          Lampa.Settings.update();
        });
        if (Lampa.Storage.field("parser_use") && Lampa.Storage.field("parser_torrent_type") === "jackett") {
          elem.show();
          $('.settings-param__name', elem).css("color", "ffffff");
          $("div[data-name='jackett_urltwo']").insertAfter("div[data-name='parser_torrent_type']");
          elem.off("click").on("click", function () {
            showParserSelectionMenu();
          });
          const current = Lampa.Storage.get('selected_parser');
          if (current) {
            updateParserField(current);
          }
        } else {
          elem.hide();
        }
      }, 5);
    }
  });

})();
