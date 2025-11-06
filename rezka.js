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
            if (mainMap && mainMap.Items) {
                wrap(mainMap.Items, 'onAppend', function (original, args) {
                    if (original) original.apply(this, args);
                    if (!this.__newInterfaceEnabled || Lampa.Storage.get('logo_glav') === '1') return;
                    const item = args && args[0];
                    const element = args && args[1];
                    if (item && element) attachLogoHandlers(this, item, element);
                });
            }
        }
    }

    function attach
