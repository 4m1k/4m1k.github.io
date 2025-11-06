(function () {
    'use strict';

    // Функция для запуска плагина
    function startPlugin() {
        // Устанавливаем флаг, что плагин активирован
        window.logoplugin = true;

        // Подписываемся на событие 'full' в Lampa.Listener для полного вида
        Lampa.Listener.follow('full', function (e) {
            // Проверяем, что событие имеет тип 'complite' и параметр logo_glav не равен '1'
            if (e.type === 'complite' && Lampa.Storage.get('logo_glav') !== '1') {
                var data = e.data.movie;
                var type = data.name ? 'tv' : 'movie';

                // Проверяем, что ID фильма не пустое
                if (data.id !== '') {
                    // Формируем URL для запроса к API TMDB
                    var url = Lampa.TMDB.api(type + '/' + data.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language'));

                    // Выполняем GET-запрос к API
                    $.get(url, function (response) {
                        // Проверяем наличие логотипов в ответе
                        if (response.logos && response.logos[0]) {
                            var logo = response.logos[0].file_path;

                            // Если логотип существует, заменяем текстовое название на изображение
                            if (logo !== '') {
                                e.object.activity.render()
                                    .find('.full-start-new__title')
                                    .html('<img style="margin-top:5px; max-height:125px;" src="' + Lampa.TMDB.image('/t/p/w300' + logo.replace('.svg', '.png')) + '"/>');
                            }
                        }
                    });
                }
            }
        });

        // Дополнительная логика для нового интерфейса (главный экран)
        if (typeof Lampa.Maker !== 'undefined' && Lampa.Maker.map) {
            const mainMap = Lampa.Maker.map('Main');
            if (mainMap && mainMap.Create) {
                wrap(mainMap.Create, 'onCreate', function (original, args) {
                    if (original) original.apply(this, args);
                    if (!this.__newInterfaceEnabled || Lampa.Storage.get('logo_glav') === '1') return;
                    const state = this.__newInterfaceState;
                    if (!state || state.__logoOverridden) return;
                    state.__logoOverridden = true;
                    const originalUpdate = state.update;
                    state.update = function (data) {
                        originalUpdate.call(this, data);
                        if (!data) return;
                        const infoElem = this.infoElement;
                        if (!infoElem) return;
                        const titleElem = $(infoElem).find('.new-interface-info__title');
                        if (titleElem.length === 0 || titleElem.data('logo-loaded')) return;
                        const type = data.media_type === 'tv' || data.name ? 'tv' : 'movie';
                        if (data.id) {
                            const url = Lampa.TMDB.api(`${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get('language')}`);
                            const network = new Lampa.Reguest();
                            network.silent(url, (response) => {
                                if (response.logos && response.logos.length > 0) {
                                    const logoPath = response.logos[0].file_path;
                                    const imgSrc = Lampa.TMDB.image('/t/p/w300' + logoPath.replace('.svg', '.png'));
                                    titleElem.html(`<img style="max-height:4em; margin-bottom:0.3em; margin-left:-0.03em;" src="${imgSrc}"/>`);
                                    titleElem.data('logo-loaded', true);
                                }
                            });
                        }
                    };
                });
            }
        }
    }

    function wrap(target, method, handler) {
        if (!target) return;
        const original = typeof target[method] === 'function' ? target[method] : null;
        target[method] = function (...args) {
            return handler.call(this, original, args);
        };
    }

    // Добавляем параметр в настройки Lampa
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_glav',
            type: 'select',
            values: {
                '1': 'Скрыть',
                '0': 'Отображать'
            },
            default: '0'
        },
        field: {
            name: 'Логотипы вместо названий',
            description: 'Отображает логотипы фильмов вместо текста'
        }
    });

    // Запускаем плагин, если он еще не активирован
    if (!window.logoplugin) {
        startPlugin();
    }
})();
