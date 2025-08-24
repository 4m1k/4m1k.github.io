(function () {
    'use strict';

    // Проверяем, что платформа — телевизор
    Lampa.Platform.tv();

    // Добавляем параметр в настройки интерфейса
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'card_interfice_type',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Логотип вместо названия'
        },
        onRender: function () {
            // Перемещаем элемент logo_card после card_interfice_cover
            setTimeout(function () {
                $('div[data-name="logo_card"]').insertAfter('div[data-name="card_interfice_cover"]');
            }, 0);
        }
    });

    // Подписываемся на событие отображения полной информации о фильме/сериале
    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'render' && Lampa.Storage.get('card_interfice_type') !== false) {
            // Получаем контейнер текущей активности
            var container = e.data.activity.render();

            // Определяем тип контента (фильм или сериал)
            var movie = e.data.movie;
            var type = movie.name ? 'tv' : 'movie';

            // Формируем URL для запроса логотипа
            var api_key = '4ef0d7355d9ffb5151e987764708ce96';
            var tmdb_base = 'http://tmdbapi.bylampa.online/3/';
            var img_base = 'http://tmdbimg.bylampa.online/';
            var url = tmdb_base + type + '/' + movie.id + '/images?api_key=' + api_key + '&language=' + Lampa.Storage.get('language');

            // Выполняем запрос к API TMDb
            $.get(url, function (data) {
                if (data.logos && data.logos[0]) {
                    var logo = data.logos[0].file_path;
                    if (logo !== '') {
                        // Показываем элементы для отображения логотипа
                        $('.full-start__title', container).show();
                        $('.full-start-new__title', container).show();

                        var logo_html;
                        // Для экранов шире 585px
                        if (window.innerWidth > 585) {
                            if (Lampa.Storage.get('card_interfice_type') === 'new' && !$('.full-start-new.cardify').length) {
                                logo_html = '<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 1.8em;" src="' + img_base + 't/p/w500' + logo.replace('.svg', '.png') + '" />';
                                $('.full-start__title', container).html(logo_html);
                            } else if (Lampa.Storage.get('card_interfice_type') === 'new' && $('.full-start-new.cardify').length) {
                                logo_html = '<img style="margin-top: 0.6em; margin-bottom: 0.4em; max-height: 2.8em; max-width: 6.8em;" src="' + img_base + 't/p/w500' + logo.replace('.svg', '.png') + '" />';
                                $('.full-start__title', container).html(logo_html);
                            } else if (Lampa.Storage.get('card_interfice_type') === 'old' && !$('.full-start-new.cardify').length) {
                                logo_html = '<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 2.2em;" src="' + img_base + 't/p/w500' + logo.replace('.svg', '.png') + '" />';
                                $('.full-start-new__title', container).html(logo_html);
                            }
                        } else {
                            // Для узких экранов
                            logo_html = Lampa.Storage.get('card_interfice_type') === 'new' ?
                                '<img style="margin-top: 0.3em; margin-bottom: 0.1em; max-height: 2.8em;" src="' + img_base + 't/p/w500' + logo.replace('.svg', '.png') + '" />' :
                                '<img style="margin-top: 0.3em; margin-bottom: 0.1em; max-height: 1.8em;" src="' + img_base + 't/p/w500' + logo.replace('.svg', '.png') + '" />';
                            $('.full-start-new__title', container).html(logo_html);
                        }
                    }
                }
            });
        }
    });

    // Запускаем код, когда приложение готово
    if (window.appready) {
        // Вызываем основную функцию
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

    // Основная функция инициализации (заменяет _0x1a14c8)
    function init() {
        // Пустая функция, так как вся логика уже в обработчике Listener
    }
})();
