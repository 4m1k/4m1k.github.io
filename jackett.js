(function () {
    'use strict';

    var parsersInfo = [{
      base: 'custom_1',
      name: '79.137.204.8:2601',
      settings: {
        url: '79.137.204.8:2601',
        key: '',
        parser_torrent_type: 'jackett'
      }
    }, {
      base: 'custom_2',
      name: 'jacred.xyz',
      settings: {
        url: 'jacred.xyz',
        key: '',
        parser_torrent_type: 'jackett'
      }
    }, {
      base: 'custom_3',
      name: 'jacred.pro',
      settings: {
        url: 'jacred.pro',
        key: '',
        parser_torrent_type: 'jackett'
      }
    }, {
      base: 'custom_4',
      name: 'jacred.viewbox.dev',
      settings: {
        url: 'jacred.viewbox.dev',
        key: 'viewbox',
        parser_torrent_type: 'jackett'
      }
    }, {
      base: 'custom_5',
      name: 'trs.my.to:9117',
      settings: {
        url: 'trs.my.to:9117',
        key: '',
        parser_torrent_type: 'jackett'
      }
    }, {
      base: 'custom_6',
      name: 'altjacred.duckdns.org',
      settings: {
        url: 'altjacred.duckdns.org',
        key: '',
        parser_torrent_type: 'jackett'
      }
    }];

    var proto = location.protocol === "https:" ? 'https://' : 'http://';
    var cache = {};

    function checkAlive(type) {
      if (type === 'parser') {
        var requests = parsersInfo.map(function (parser) {
          var protocol = parser.base === "lme_jackett" || parser.base === "lme_prowlarr" ? "" : proto;
          var endPoint = parser.settings.parser_torrent_type === 'prowlarr' ? '/api/v1/health?apikey=' + parser.settings.key : "/api/v2.0/indexers/status:healthy/results?apikey=".concat(parser.settings.url === 'spawn.pp.ua:59117' ? '2' : parser.base === 'lme_jackett' ? parser.settings.key : '');
          var myLink = protocol + parser.settings.url + endPoint;

          if (cache[myLink]) {
            console.log('Using cached response for', myLink, cache[myLink]);
            return Promise.resolve();
          }
          return new Promise(function (resolve) {
            $.ajax({
              url: myLink,
              method: 'GET',
              success: function success(response, textStatus, xhr) {
                var color = xhr.status === 200 ? '1aff00' : 'ff2e36';
                cache[myLink] = { color: color };
              },
              error: function error() {
                console.error("Error fetching", myLink);
              },
              complete: function complete() {
                resolve();
              }
            });
          });
        });
        return Promise.all(requests).then(function () {
          console.log('All requests completed');
        });
      }
    }

    function changeParser() {
      var jackettUrlTwo = Lampa.Storage.get("lme_url_two");
      var selectedParser = parsersInfo.find(function (parser) {
        return parser.base === jackettUrlTwo;
      });
      if (selectedParser) {
        var settings = selectedParser.settings;
        Lampa.Storage.set(settings.parser_torrent_type === 'prowlarr' ? "prowlarr_url" : "jackett_url", settings.url);
        Lampa.Storage.set(settings.parser_torrent_type === 'prowlarr' ? "prowlarr_key" : "jackett_key", settings.key);
        Lampa.Storage.set("parser_torrent_type", settings.parser_torrent_type);
      } else {
        console.warn("Jackett URL not found in parsersInfo");
      }
    }

    function add() {
      Lampa.SettingsApi.addParam({
        component: 'parser',
        param: {
          name: 'lme_url_two',
          type: 'select',
          values: parsersInfo.reduce(function (prev, _ref) {
            var base = _ref.base,
                name = _ref.name;
            prev[base] = name;
            return prev;
          }, { no_parser: 'Не выбран' }),
          "default": 'no_parser'
        },
        field: {
          name: "<div class=\"settings-folder\" style=\"padding:0!important\"><div style=\"font-size:1.0em\">Каталог парсеров</div></div>",
          description: "Нажмите для выбора парсера из " + parsersInfo.length
        },
        onChange: function onChange(value) {
          changeParser();
          Lampa.Settings.update();
        }
      });
      changeParser();
    }

    function startPlugin() {
      window.plugin_lmepublictorr_ready = true;
      if (window.appready) add(); else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type === 'ready') add();
        });
      }
    }

    if (!window.plugin_lmepublictorr_ready) startPlugin();
})();
