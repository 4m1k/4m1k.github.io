(function () {
  'use strict';

  if (!Lampa.Storage.get("parser_torrent_type")) {
    Lampa.Storage.set("parser_torrent_type", "jackett");
  }

  async function checkParser(parser) {
    const protocol = location.protocol === "https:" ? "https://" : "http://";
    const apiUrl = `${protocol}${parser.url}/api/v2.0/indexers/status:healthy/results?apikey=${parser.apiKey}`;
    
    try {
      const response = await fetch(apiUrl, { method: "GET" });
      parser.status = response.ok;
      console.log("Проверка парсера:", parser.url, "Статус:", parser.status);
    } catch (error) {
      parser.status = false;
      console.log("Ошибка проверки парсера:", parser.url, error);
    }
    return parser;
  }

  async function checkAllParsers() {
    const parsers = [
      { title: "79.137.204.8:2601", url: "79.137.204.8:2601", apiKey: "" },
      { title: "jacred.xyz", url: "jacred.xyz", apiKey: "" },
      { title: "jacred.pro", url: "jacred.pro", apiKey: "" },
      { title: "jacred.viewbox.dev", url: "jacred.viewbox.dev", apiKey: "viewbox" },
      { title: "trs.my.to:9117", url: "trs.my.to:9117", apiKey: "" },
      { title: "altjacred.duckdns.org", url: "altjacred.duckdns.org", apiKey: "" }
    ];
    return Promise.all(parsers.map(parser => checkParser(parser)));
  }

  function showParserSelectionMenu() {
    checkAllParsers().then(results => {
      results.unshift({ title: "Свой вариант", url: "", apiKey: "", status: null });

      const currentSelected = Lampa.Storage.get('selected_parser');
      const items = results.map(parser => {
        let color = parser.status ? "#64e364" : "#ff2121";
        let activeMark = parser.title === currentSelected ? '<span style="color: #4285f4; margin-right: 5px;">✔</span>' : "";
        const titleHTML = `${activeMark}<span style="color: ${color};">${parser.title}</span>`;
        return { title: titleHTML, parser: parser };
      });

      Lampa.Select.show({
        title: "Меню смены парсера",
        items: items,
        onBack: () => Lampa.Controller.toggle("settings_component"),
        onSelect: (item) => {
          console.log("Выбор парсера:", item.parser);
          Lampa.Storage.set('jackett_url', item.parser.url);
          Lampa.Storage.set('jackett_key', item.parser.apiKey);
          Lampa.Storage.set('selected_parser', item.parser.title);
          Lampa.Storage.set("parser_torrent_type", "jackett");
          
          setTimeout(() => {
            updateParserField(item.parser.url);
            Lampa.Controller.toggle("settings_component");
            Lampa.Settings.update();
          }, 300);
        }
      });
    });
  }

  function updateParserField(url) {
    const inputField = document.querySelector("div[data-name='jackett_url'] input");
    if (inputField) {
      inputField.value = url;
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.warn("Поле jackett_url не найдено");
    }
    console.log("Обновлено поле ссылки:", url);
  }

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
      name: "Выбрать парсер",
      description: "Нажмите для выбора парсера из списка"
    },
    onChange: () => Lampa.Settings.update(),
    onRender: (elem) => {
      setTimeout(() => {
        document.querySelector("div[data-children='parser']").addEventListener("mouseenter", () => Lampa.Settings.update());
        if (Lampa.Storage.field("parser_use")) {
          elem.style.display = "block";
          document.querySelector("div[data-name='jackett_urltwo']").insertAdjacentElement("afterend", document.querySelector("div[data-name='parser_torrent_type']"));
          elem.addEventListener("click", () => showParserSelectionMenu());
          const current = Lampa.Storage.get('selected_parser');
          if (current) {
            updateParserField(Lampa.Storage.get('jackett_url'));
          }
        } else {
          elem.style.display = "none";
        }
      }, 5);
    }
  });
})();
