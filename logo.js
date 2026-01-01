(function () {
    'use strict';

    // Функция для запуска плагина
    function startPlugin() {
        // Устанавливаем флаг, что плагин активирован
        window.logoplugin = true;

        // Подписываемся на событие 'full' в Lampa.Listener
        Lampa.Listener.follow('full', function (e) {
            // Исправлено: 'complete' вместо 'complite'
            if (e.type === 'complete' && Lampa.Storage.get('logo_glav', '0') !== '1') {
                var data = e.data.movie;
                var type = data.name ? 'tv' : 'movie';

                // Проверяем, что ID фильма не пустое
                if (data.id !== '') {
                    // Формируем URL для запроса к API TMDB
                    var url = Lampa.TMDB.api(type + '/' + data.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language'));

                    // Выполняем GET-запрос к API
                    $.get(url, function (data) {
                        // Проверяем наличие логотипов в ответе
                        if (data.logos && data.logos[0]) {
                            var logo = data.logos[0].file_path;

                            // Если логотип существует, заменяем текстовое название на изображение
                            if (logo !== '') {
                                var renderElement = e.object.activity.render();
                                renderElement.find('.full-start-new__title').html(
                                    '<img style="margin-top:5px; max-height:125px;" src="' + Lampa.TMDB.image('/t/p/w500' + logo.replace('.svg', '.png')) + '"/>'
                                );

                                // Удаляем элемент с теглайном для лучшей подгонки логотипа
                                renderElement.find('.full-start-new__tagline').remove();
                            }
                        }
                    });
                }
            }
        });
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
