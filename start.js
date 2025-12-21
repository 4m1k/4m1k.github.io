(function () {
    'use strict';

    // === Часть из первого плагина: выполняется сразу ===
    Lampa.Platform.tv();

    var plugin = {
        name: 'TMDB Proxy + Anti-DMCA + No Ads (Force)',
        version: '1.0.5',
        description: 'Прокси TMDB + отключение DMCA, обход блокировок + принудительное отключение всей рекламы'
    };

    plugin.path_image = Lampa.Utils.protocol() + 'tmdbimage.abmsx.tech/';
    plugin.path_api = Lampa.Utils.protocol() + 'tmdb.abmsx.tech/3/';

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

        // Отключаем DMCA полностью
        Lampa.Utils.dcma = function () { return undefined; };

        // Принудительно отключаем рекламу — переопределяем загрузку настроек
        var originalMain = Lampa.Settings.main;
        Lampa.Settings.main = function () {
            originalMain.call(this);

            // После загрузки настроек с сервера принудительно выключаем рекламу
            if (window.lampa_settings) {
                if (window.lampa_settings.disable_features) {
                    window.lampa_settings.disable_features.ads = true; // отключаем фичу ads
                }
                // Дополнительно, если есть основное поле ads — ставим false (нет рекламы)
                if (window.lampa_settings.ads !== undefined) {
                    window.lampa_settings.ads = false;
                }
            }
        };

        // Сохраняем дефолтный источник
        var defaultSource = Lampa.Storage.get('source', 'cub');

        // Обход блокировок источников
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
