(function () {
    'use strict';

    function translate() {
      Lampa.Lang.add({
        lme_parser: 'Каталог парсеров',
        lme_parser_description: 'Нажмите для выбора парсера из ',
        lme_pubtorr: 'Каталог TorrServer'
      });
    }

    var cache = {};
    function checkAlive(type) {
      if (type === 'parser') {
        var requests = parsersInfo.map(function (parser) {
          var protocol = location.protocol === "https:" ? 'https://' : 'http://';
          var endPoint = "/api/v2.0/indexers/status:healthy/results?apikey=" + parser.settings.key;
          var myLink = protocol + parser.settings.url + endPoint;

          var mySelector = $('div.selectbox-item__title').filter(function () {
            return $(this).text().trim() === parser.name;
          });

          if (cache[myLink]) {
            console.log('Используем кешированный ответ для', myLink, cache[myLink]);
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
              complete: resolve
            });
          });
        });
        return Promise.all(requests).then(function () {
          console.log('Все запросы завершены');
        });
      }
    }

    function changeParser() {
      var selectedParser = parsersInfo.find(parser => parser.base === Lampa.Storage.get("lme_url_two"));
      if (selectedParser) {
        var settings = selectedParser.settings;
        Lampa.Storage.set("jackett_url", settings.url);
        Lampa.Storage.set("jackett_key", settings.key);
        Lampa.Storage.set("parser_torrent_type", settings.parser_torrent_type);
      } else {
        console.warn("Выбранный парсер не найден в списке");
      }
    }

    var parsersInfo = [
      { base: 'server_1', name: '79.137.204.8:2601', settings: { url: '79.137.204.8:2601', key: '', parser_torrent_type: 'jackett' } },
      { base: 'server_2', name: 'jacred.xyz', settings: { url: 'jacred.xyz', key: '', parser_torrent_type: 'jackett' } },
      { base: 'server_3', name: 'jacred.pro', settings: { url: 'jacred.pro', key: '', parser_torrent_type: 'jackett' } },
      { base: 'server_4', name: 'jacred.viewbox.dev', settings: { url: 'jacred.viewbox.dev', key: 'viewbox', parser_torrent_type: 'jackett' } },
      { base: 'server_5', name: 'trs.my.to:9117', settings: { url: 'trs.my.to:9117', key: '', parser_torrent_type: 'jackett' } },
      { base: 'server_6', name: 'altjacred.duckdns.org', settings: { url: 'altjacred.duckdns.org', key: '', parser_torrent_type: 'jackett' } }
    ];

    function add() {
      translate();
      checkAlive('parser');
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
