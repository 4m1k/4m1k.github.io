(function () {
    'use strict';

    // Функция для запуска плагина
    function startPlugin() {
        // Устанавливаем флаг, что плагин активирован
        window.logoplugin = true;

        // Подписываемся на событие 'full' в Lampa.Listener
        Lampa.Listener.follow('full', function (e) {
            // Проверяем, что событие имеет тип 'complite' и логотипы включены
            if (e.type === 'complite' && Lampa.Storage.get('logo_glav') !== '1') {
                var data = e.data.movie;
                var type = data.name ? 'tv' : 'movie';

                // Проверяем, что ID не пустое
                if (data.id !== '') {
                    var lang = Lampa.Storage.get('language');
                    var size = Lampa.Storage.get('logo_size', 'w500'); // По умолчанию w500

                    // Формируем URL с приоритетом языка логотипа
                    var url = Lampa.TMDB.api(
                        type + '/' + data.id + '/images?api_key=' + Lampa.TMDB.key() +
                        '&language=' + lang +
                        '&include_image_language=' + lang + ',en,null'
                    );

                    // Выполняем GET-запрос к API
                    $.get(url, function (response) {
                        var logo_path = null;

                        if (response.logos && response.logos.length > 0) {
                            // Сначала ищем логотип на языке приложения
                            for (var i = 0; i < response.logos.length; i++) {
                                if (response.logos[i].iso_639_1 === lang) {
                                    logo_path = response.logos[i].file_path;
                                    break;
                                }
                            }
                            // Если не нашли — английский
                            if (!logo_path) {
                                for (var i = 0; i < response.logos.length; i++) {
                                    if (response.logos[i].iso_639_1 === 'en') {
                                        logo_path = response.logos[i].file_path;
                                        break;
                                    }
                                }
                            }
                            // Если и его нет — берём первый доступный
                            if (!logo_path) {
                                logo_path = response.logos[0].file_path;
                            }
                        }

                        // Если логотип найден — заменяем название
                        if (logo_path) {
                            var renderElement = e.object.activity.render();

                            // Формируем правильный путь в зависимости от выбранного размера
                            var logo_url;
                            if (size === 'original') {
                                logo_url = Lampa.TMDB.image('/t/p/original' + logo_path.replace('.svg', '.png'));
                            } else {
                                logo_url = Lampa.TMDB.image('/t/p/' + size + logo_path.replace('.svg', '.png'));
                            }

                            // Заменяем название на логотип (без центрирования)
                            renderElement.find('.full-start-new__title').html(
                                '<img style="margin-top:5px; max-height:125px;" src="' + logo_url + '"/>'
                            );

                            // Удаляем теглайн
                            renderElement.find('.full-start-new__tagline').remove();

                            // Перенос года и страны под логотип (опционально)
                            if (Lampa.Storage.get('logo_hide_year', true)) {
                                var head = renderElement.find('.full-start-new__head');
                                var details = renderElement.find('.full-start-new__details');

                                if (head.length && details.length && details.find('.logo-moved-head').length === 0) {
                                    var headContent = head.html().trim();
                                    if (headContent) {
                                        var separator = details.children().length > 0
                                            ? '<span class="full-start-new__split logo-moved-separator">●</span>'
                                            : '';
                                        var movedHead = '<span class="logo-moved-head" style="margin-left:0.6em;">' + headContent + '</span>';
                                        details.append(separator + movedHead);
                                        head.remove();
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    // Добавляем параметры в настройки Lampa
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_glav',
            type: 'select',
            values: { '1': 'Скрыть', '0': 'Отображать' },
            default: '0'
        },
        field: {
            name: 'Логотипы вместо названий',
            description: 'Отображает логотипы фильмов вместо текста'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_size',
            type: 'select',
            values: { w300: 'w300', w500: 'w500', w780: 'w780', original: 'Оригинал' },
            default: 'w500'
        },
        field: {
            name: 'Размер логотипа',
            description: 'Разрешение загружаемого изображения (по умолчанию w500)'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_hide_year',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Скрывать год и страну над логотипом',
            description: 'Переносит год выпуска и страну под логотип (иначе остаётся сверху)'
        }
    });

    // Запускаем плагин, если он еще не активирован
    if (!window.logoplugin) {
        startPlugin();
    }
})();
