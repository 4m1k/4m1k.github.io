(function () {
    'use strict';

    // === Часть из первого плагина: выполняется сразу ===
    Lampa.Platform.tv();

    var plugin = {
        name: 'TMDB Proxy + Full Anti-DMCA + No Ads',
        version: '1.0.5',
        description: 'Прокси TMDB + полное отключение DMCA и рекламы + обход блокировок источников'
    };

    plugin.path_image = Lampa.Utils.protocol() + 'tmdbimage.abmsx.tech/';
    plugin.path_api = Lampa.Utils.protocol() + 'tmdbimage.abmsx.tech/3/';

    Lampa.TMDB.image = function (url) {
        var base = Lampa.Utils.protocol() + 'image.tmdb.org/' + url;
        return Lampa.Storage.field('proxy_tmdb') ? plugin.path_image + url : base;
    };

    Lampa.TMDB.api = function (url) {
        var base = Lampa.Utils.protocol() + 'api.themoviedb.org/3/' + url;
        return Lampa.Storage.field('proxy_tmdb') ? plugin.path_api + url : base;
    };

    // === Часть после готовности приложения ===
    function start() {
        if (window.anti_dmca_plugin) {
            return;
        }
        window.anti_dmca_plugin = true;

        // === Правильное отключение DMCA (перебиваем серверные настройки) ===
        window.lampa_settings = window.lampa_settings || {};
        window.lampa_settings.dcma = false;  // отключаем список заблокированных
        window.lampa_settings.disable_features = window.lampa_settings.disable_features || {};
        window.lampa_settings.disable_features.dmca = true;  // включаем отключение проверки DMCA

        // Дополнительно переопределяем функцию для полной уверенности
        Lampa.Utils.dcma = function () { return undefined; };

        // === Полное отключение рекламы (перебиваем серверное false) ===
        window.lampa_settings.disable_features.ads = true;

        // Сохраняем дефолтный источник
        var defaultSource = Lampa.Storage.get('source', 'cub');

        // Обход блокировок источников (на случай, если что-то всё же проскочит)
        Lampa.Listener.follow('request_secuses', function (event) {
            if (event.data && event.data.blocked) {
                var active = Lampa.Activity.active();
                if (active) {
                    active.source = 'tmdb';
                    Lampa.Storage.set('source', 'tmdb', true);
                    Lampa.Activity.replace(active);
                    Lampa.Storage.set('source', defaultSource, true);
                }
            }
        });

        // Удаляем стандартный пункт прокси TMDB из настроек
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name === 'tmdb') {
                e.body.find('[data-parent="proxy"]').remove();
            }
        });
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                start();
            }
        });
    }

})();
