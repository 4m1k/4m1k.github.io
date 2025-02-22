(function () {
  'use strict';

  // Устанавливаем тип парсера для торрентов по умолчанию на "jackett", если не задан
  if (!Lampa.Storage.get("parser_torrent_type")) {
    Lampa.Storage.set("parser_torrent_type", "jackett");
  }

  Lampa.Platform.tv();

  // --- Функции проверки парсера ---
  function checkParser(parser) {
    return new Promise((resolve) => {
      const protocol = location.protocol === "https:" ? "https://" : "http://";
      const apiUrl = protocol + parser.url + "/api/v2.0/indexers/status:healthy/results?apikey=" + parser.apiKey;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", apiUrl, true);
      xhr.timeout = 3000;
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

  function checkAllParsers() {
    // Список стандартных парсеров (без ByLampa Jackett, Jacred Maxvol Pro, Spawn Jackett)
    const parsers = [
      { title: "Lampa32",           url: "79.137.204.8:2601",        apiKey: "" },
      { title: "Jacred.xyz",        url: "jacred.xyz",               apiKey: "" },
      { title: "Jacred Pro",        url: "jacred.pro",               apiKey: "" },
      { title: "Viewbox",           url: "jacred.viewbox.dev",       apiKey: "viewbox" },
      { title: "JAOS My To Jacred",  url: "trs.my.to:9117",            apiKey: "" },
      { title: "Johnny Jacred",     url: "altjacred.duckdns.org",     apiKey: "" }
    ];
    return Promise.all(parsers.map(parser => checkParser(parser)));
  }

  // --- Формирование меню выбора парсера ---
  function showParserSelectionMenu() {
    checkAllParsers().then(results => {
      // Добавляем пункт "Свой вариант" в начало
      results.unshift({
        title: "Свой вариант",
        url: "",
        apiKey: "",
        status: null // статус для "Свой вариант" не проверяется
      });

      const currentSelected = Lampa.Storage.get('selected_parser');

      // Формируем элементы меню:
      // — Если парсер не "Свой вариант", его название окрашивается: зелёным (#64e364) если рабочий, красным (#ff2121) если нет.
      // — Если парсер совпадает с текущим выбранным, перед названием выводится синяя галочка (&#10004; с цветом #4285f4).
      // — Для "Свой вариант" если он не выбран – без маркера.
      const items = results.map(parser => {
        let color = "inherit";
        if (parser.title !== "Свой вариант") {
          color = parser.status ? "#64e364" : "#ff2121";
        }
        let activeMark = "";
        if (parser.title === currentSelected) {
          activeMark = '<span style="color: #4285f4; margin-right: 5px;">&#10004;</span>';
        }
        const titleHTML = activeMark + `<span style="color: ${color};">${parser.title}</span>`;
        return {
          title: titleHTML,
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
          if (item.parser.title === "Свой вариант") {
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
          // При выборе, если выбран не "Свой вариант", скрываем поля "ссылка" и "Api-ключ"
          if (item.parser.title !== "Свой вариант") {
            $("div[data-name='jackett_url']").hide();
            $("div[data-name='jackett_key']").hide();
          } else {
            $("div[data-name='jackett_url']").show();
            $("div[data-name='jackett_key']").show();
          }
        }
      });
    });
  }

  // Обновление отображения выбранного парсера в настройках
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
        jacred_xyz: "Jacred.xyz",
        jacred_my_to: "Jacred Pro",
        jacred_viewbox_dev: "Viewbox",
        spawn_jacred: "JAOS My To Jacred",
        altjacred_duckdns_org: "Johnny Jacred"
      },
      default: 'jacred_xyz'
    },
    field: {
      name: `<div class="settings-folder" style="padding:0!important">
                <div style="width:1.3em;height:1.3em;padding-right:.1em">
                  <!-- SVG-иконка -->
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
        // Если включён режим использования парсера и тип парсера для торрентов не равен "jackett"
        // (т.е. если torrent type равен "jackett", мы скрываем меню выбора парсера)
        if (Lampa.Storage.field("parser_use") && Lampa.Storage.field("parser_torrent_type") !== "jackett") {
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
        // Дополнительно: если выбран вариант не "Свой вариант", скрываем поля "ссылка" и "Api-ключ"
        if (Lampa.Storage.get("jackett_urltwo") !== "no_parser") {
          $("div[data-name='jackett_url']").hide();
          $("div[data-name='jackett_key']").hide();
        } else {
          $("div[data-name='jackett_url']").show();
          $("div[data-name='jackett_key']").show();
        }
      }, 5);
    }
  });

})();
