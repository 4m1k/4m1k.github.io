(function () {
  'use strict';

  if (!Lampa.Storage.get("parser_torrent_type")) {
    Lampa.Storage.set("parser_torrent_type", "jackett");
  }
  Lampa.Platform.tv();

  // Функция проверки одного парсера с гарантией разрешения промиса (включая фолбэк)
  function checkParser(parser) {
    return new Promise((resolve) => {
      let resolved = false;
      function resolveOnce() {
        if (!resolved) {
          resolved = true;
          resolve(parser);
        }
      }
      const protocol = location.protocol === "https:" ? "https://" : "http://";
      const apiUrl = protocol + parser.url + "/api/v2.0/indexers/status:healthy/results?apikey=" + parser.apiKey;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", apiUrl, true);
      xhr.timeout = 3000;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // Для jacred.viewbox.dev считаем рабочим при статусе 403
          if (xhr.status === 200 || (parser.url === "jacred.viewbox.dev" && xhr.status === 403)) {
            parser.status = true;
          } else {
            parser.status = false;
          }
          resolveOnce();
        }
      };
      xhr.onerror = function () {
        parser.status = false;
        resolveOnce();
      };
      xhr.ontimeout = function () {
        parser.status = false;
        resolveOnce();
      };
      xhr.send();
      setTimeout(() => {
        if (!resolved) {
          parser.status = false;
          resolveOnce();
        }
      }, 3500);
    });
  }

  // Функция для генерации массива пунктов меню (buildItems)
  function buildItems(parsers, currentSelected) {
    return parsers.map(parser => {
      let color = "#cccccc"; // нейтральный (пока не проверен)
      if (parser.status === true) {
        color = "#64e364";
      } else if (parser.status === false) {
        color = "#ff2121";
      }
      let activeMark = "";
      if (parser.title === currentSelected) {
        activeMark = '<span style="color: #4285f4; margin-right: 5px;">&#10004;</span>';
      }
      return { 
        title: activeMark + `<span style="color: ${color} !important;">${parser.title}</span>`,
        parser: parser 
      };
    });
  }

  // Функция, которая открывает меню сразу и затем запускает асинхронную проверку
  function openParserSelectionMenu() {
    // Начальный массив – все пункты с status = null
    let parsers = [
      { title: "Свой вариант", url: "", apiKey: "", status: null },
      { title: "79.137.204.8:2601", url: "79.137.204.8:2601", apiKey: "", status: null },
      { title: "jacred.xyz",         url: "jacred.xyz",         apiKey: "", status: null },
      { title: "jacred.pro",         url: "jacred.pro",         apiKey: "", status: null },
      { title: "jacred.viewbox.dev", url: "jacred.viewbox.dev", apiKey: "viewbox", status: null },
      { title: "trs.my.to:9117",     url: "trs.my.to:9117",     apiKey: "", status: null },
      { title: "altjacred.duckdns.org", url: "altjacred.duckdns.org", apiKey: "", status: null }
    ];
    const currentSelected = Lampa.Storage.get('selected_parser');

    // Функция обновления DOM элементов меню, используя $el внутри selectInstance
    function updateMenuDOM(selectInstance) {
      var newItems = buildItems(parsers, currentSelected);
      // Если ваш список пунктов имеет другой селектор, измените '.select__item'
      selectInstance.$el.find('.select__item').each(function (index) {
        // Обновляем HTML пункта
        $(this).html(newItems[index].title);
      });
    }

    // Открываем меню сразу с исходными данными
    var selectInstance = Lampa.Select.show({
      title: "Меню смены парсера",
      items: buildItems(parsers, currentSelected),
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
          Lampa.Storage.set("parser_torrent_type", "jackett");
        }
        updateParserField(item.title);
        Lampa.Select.hide();
        setTimeout(function () {
          Lampa.Settings.update();
          $("div[data-name='jackett_urltwo']").attr("tabindex", "0").focus();
        }, 300);
        if (item.parser.title !== "Свой вариант") {
          $("div[data-name='jackett_url']").hide();
          $("div[data-name='jackett_key']").hide();
        } else {
          $("div[data-name='jackett_url']").show();
          $("div[data-name='jackett_key']").show();
        }
      }
    });

    // Для каждого пункта (кроме "Свой вариант") запускаем проверку
    parsers.forEach(function (parser) {
      if (parser.title !== "Свой вариант") {
        checkParser(parser).then(function () {
          // После завершения обновляем меню вручную
          updateMenuDOM(selectInstance);
        });
      }
    });
  }

  // Функция обновления отображаемого выбранного парсера (для заголовка)
  function updateParserField(text) {
    $("div[data-name='jackett_urltwo']").html(
      `<div class="settings-folder" tabindex="0" style="padding:0!important">
         <div style="width:1.3em;height:1.3em;padding-right:.1em"></div>
         <div style="font-size:1.2em; font-weight: bold;">
           <div style="padding: 0.5em 0.5em; padding-top: 0;">
             <div style="background: #d99821; padding: 0.7em; border-radius: 0.5em; border: 4px solid #d99821;">
               <div style="line-height: 0.3; color: black; text-align: center;">${text}</div>
             </div>
           </div>
         </div>
       </div>`
    );
  }

  // Добавляем параметр в настройки – кнопку "Выбрать парсер"
  Lampa.SettingsApi.addParam({
    component: "parser",
    param: {
      name: "jackett_urltwo",
      type: "select",
      values: {
        no_parser: "Свой вариант",
        jac_lampa32_ru: "79.137.204.8:2601",
        jacred_xyz: "jacred.xyz",
        jacred_my_to: "jacred.pro",
        jacred_viewbox_dev: "jacred.viewbox.dev",
        spawn_jacred: "trs.my.to:9117",
        altjacred_duckdns_org: "altjacred.duckdns.org"
      },
      default: 'jacred_xyz'
    },
    field: {
      name: `<div class="settings-folder" style="padding:0!important">
                 <div style="width:1.3em;height:1.3em;padding-right:.1em"></div>
                 <div style="font-size:1.0em">
                   <div style="padding: 0.3em 0.3em; padding-top: 0;">
                     <div style="background: #d99821; padding: 0.5em; border-radius: 0.4em; border: 3px solid #d99821;">
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
        if (Lampa.Storage.field("parser_use")) {
          elem.show();
          $('.settings-param__name', elem).css("color", "ffffff");
          $("div[data-name='jackett_urltwo']").insertAfter("div[data-name='parser_torrent_type']");
          elem.off("click hover:enter keydown").on("click hover:enter keydown", function (e) {
            if (
              e.type === "click" ||
              e.type === "hover:enter" ||
              (e.type === "keydown" && (e.key === "Enter" || e.keyCode === 13))
            ) {
              openParserSelectionMenu();
            }
          });
          const current = Lampa.Storage.get('selected_parser');
          if (current) {
            updateParserField(current);
          }
        } else {
          elem.hide();
        }
        if (Lampa.Storage.get('selected_parser') !== "Свой вариант") {
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
