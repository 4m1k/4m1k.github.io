(function () {
    'use strict';

    function translate() {
      Lampa.Lang.add({
        lme_parser: {
          ru: 'Каталог парсеров',
          en: 'Parsers catalog',
          uk: 'Каталог парсерів',
          zh: '解析器目录'
        },
        lme_parser_description: {
          ru: 'Нажмите для выбора парсера из ',
          en: 'Click to select a parser from the ',
          uk: 'Натисніть для вибору парсера з ',
          zh: '单击以从可用的 '
        }
      });
    }
    
    var Lang = {
      translate: translate
    };

    var parsersInfo = [
      { base: 'jacred_xyz', name: 'Jacred.xyz', settings: { url: 'jacred.xyz', key: '', parser_torrent_type: 'jackett' } },
      { base: 'jacred_pro', name: 'Jacred.pro', settings: { url: 'jacred.pro', key: '', parser_torrent_type: 'jackett' } },
      { base: 'jacred_viewbox_dev', name: 'Viewbox', settings: { url: 'jacred.viewbox.dev', key: 'viewbox', parser_torrent_type: 'jackett' } }
    ];

    var proto = location.protocol === "https:" ? 'https://' : 'http://';
    var cache = {};

    function checkAlive() {
      var requests = parsersInfo.map(function (parser) {
        var myLink = proto + parser.settings.url + "/api/v2.0/indexers/status:healthy/results?apikey=" + parser.settings.key;

        var mySelector = $('div.selectbox-item__title').filter(function () {
          return $(this).text().trim() === parser.name;
        });

        if (cache[myLink]) {
          $(mySelector).css('color', cache[myLink].color);
          return Promise.resolve();
        }
        
        return new Promise(function (resolve) {
          $.ajax({
            url: myLink,
            method: 'GET',
            success: function (response, textStatus, xhr) {
              var color = xhr.status === 200 ? '1aff00' : 'ff2e36';
              $(mySelector).css('color', color);
              cache[myLink] = { color: color };
            },
            error: function () {
              $(mySelector).css('color', 'ff2e36');
            },
            complete: function () {
              resolve();
            }
          });
        });
      });
      return Promise.all(requests);
    }

    function changeParser(value) {
      var selectedParser = parsersInfo.find(function (parser) {
        return parser.base === value;
      });
      if (selectedParser) {
        Lampa.Storage.set("jackett_url", selectedParser.settings.url);
        Lampa.Storage.set("jackett_key", selectedParser.settings.key);
        Lampa.Storage.set("parser_torrent_type", selectedParser.settings.parser_torrent_type);
        console.log("Выбранный парсер:", selectedParser);
      } else {
        console.warn("Парсер не найден");
      }
    }

    Lampa.Controller.listener.follow('toggle', function (e) {
      if (e.name === 'select') {
        checkAlive();
      }
    });
    
    function parserSetting() {
      var s_values = parsersInfo.reduce(function (prev, _ref) {
        var base = _ref.base, name = _ref.name;
        prev[base] = name;
        return prev;
      }, { no_parser: 'Не выбран' });

      Lampa.SettingsApi.addParam({
        component: 'parser',
        param: {
          name: 'lme_url_two',
          type: 'select',
          values: s_values,
          "default": 'no_parser'
        },
        field: {
          name: "<div class=\"settings-folder\" style=\"padding:0!important\"><div style=\"font-size:1.0em\">".concat(Lampa.Lang.translate('lme_parser'), "</div></div>"),
          description: "".concat(Lampa.Lang.translate('lme_parser_description'), " ").concat(parsersInfo.length)
        },
        onChange: function onChange(value) {
          changeParser(value);
          Lampa.Settings.update();
        },
        onRender: function onRender(item) {
          setTimeout(function () {
            $('div[data-children="parser"]').on('hover:enter', function () {
              Lampa.Settings.update();
            });
            if (Lampa.Storage.field('parser_use')) {
              item.show();
              $('div[data-name="lme_url_two"]').insertAfter('div[data-children="parser"]');
            } else {
              item.hide();
            }
          });
        }
      });
    }

    var Parser = {
      parserSetting: parserSetting
    };

    function add() {
      Lang.translate();
      Parser.parserSetting();
    }
    
    function startPlugin() {
      window.plugin_lme_ready = true;
      if (window.appready) add(); else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type === 'ready') add();
        });
      }
    }
    
    if (!window.plugin_lme_ready) startPlugin();
})();
