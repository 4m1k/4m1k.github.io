(function () {
    'use strict';
    Lampa.Platform.tv();

    var plugin = {
        name: 'TMDB Proxy with Anti-DMCA',
        version: '1.0.4',
        description: 'Проксирование постеров и API TMDB с отключением DMCA-фич и обходом блокировок'
    };
    plugin.path_image = Lampa.Utils.protocol() + 'tmdbimage.abmsx.tech/';
    plugin.path_api   = Lampa.Utils.protocol() + 'tmdb.abmsx.tech/3/';

    // Сохраняем оригинальные методы Lampa (с её нативным проксированием)
    var original_image = Lampa.TMDB.image.bind(Lampa.TMDB);
    var original_api   = Lampa.TMDB.api.bind(Lampa.TMDB);

    Lampa.TMDB.image = function (url) {
        // Если включён НАТИВНЫЙ прокси TMDB в Lampa — плагин не вмешивается
        if (Lampa.Storage.field('proxy_tmdb')) return original_image(url);

        var base = Lampa.Utils.protocol() + 'image.tmdb.org/' + url;
        // Прокси плагина — по своему отдельному флагу
        return Lampa.Storage.field('proxy_tmdb_abmsx') ? plugin.path_image + url : base;
    };

    Lampa.TMDB.api = function (url) {
        // Если включён НАТИВНЫЙ прокси TMDB в Lampa — плагин не вмешивается
        if (Lampa.Storage.field('proxy_tmdb')) return original_api(url);

        var base = Lampa.Utils.protocol() + 'api.themoviedb.org/3/' + url;
        return Lampa.Storage.field('proxy_tmdb_abmsx') ? plugin.path_api + url : base;
    };

    // Отдельный переключатель для прокси плагина в настройках
    if (Lampa.SettingsApi) {
        Lampa.SettingsApi.addParam({
            component: 'tmdb',
            param: {
                name: 'proxy_tmdb_abmsx',
                type: 'trigger',
                default: false
            },
            field: {
                name: 'Proxy TMDB (abmsx)',
                description: 'Проксировать TMDB через abmsx.tech (работает только когда нативный прокси Lampa выключен)'
            }
        });
    }

    window.lampa_settings = window.lampa_settings || {};
    window.lampa_settings.dcma = false;
    window.lampa_settings.disable_features = window.lampa_settings.disable_features || {};
    window.lampa_settings.disable_features.dmca = true;

    function start() {
        if (window.anti_dmca_plugin) return;
        window.anti_dmca_plugin = true;

        Lampa.Utils.dcma = function () { return undefined; };

        var defaultSource = Lampa.Storage.get('source', 'cub');

        Lampa.Listener.follow('request_secuses', function (event) {
            if (event.data.blocked) {
                window.lampa_settings.dcma = [];
                var active = Lampa.Activity.active();
                active.source = 'tmdb';
                Lampa.Storage.set('source', 'tmdb', true);
                Lampa.Activity.replace(active);
                Lampa.Storage.set('source', defaultSource, true);
            }
        });

        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name === 'tmdb') {
                e.body.find('[data-parent="proxy"]').remove();
            }
        });
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') start();
    });
})();
