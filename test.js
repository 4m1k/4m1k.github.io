(function() {
    'use strict';

    // Инициализация платформы
    Lampa.Platform.tv();

    // Основная функция добавления пунктов меню
    function initializeRussianMenu() {
        // Создание элемента меню
        const menuItem = $(
            '<li class="menu__item selector" data-action="ru_movie">' +
                '<div class="menu__ico">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">' +
                        '<g fill="none" stroke="currentColor" stroke-width="4">' +
                            '<path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/>' +
                            '<path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>' +
                            '<path stroke-linecap="round" d="M24 44h20"/>' +
                        '</g>' +
                    '</svg>' +
                '</div>' +
                '<div class="menu__text">Русское</div>' +
            '</li>'
        );

        // Обработчик клика
        menuItem.on('hover:enter', function() {
            const menuOptions = [
                {
                    title: createServiceItem('Русские фильмы', 'movie', 'cub', '2023-2025', 16),
                    action: () => navigateToCategory('movie', 'cub', { genre: 16 })
                },
                {
                    title: createServiceItem('Русские сериалы', 'tv', 'tmdb'),
                    action: () => navigateToCategory('tv', 'tmdb', { sort: 'first_air_date.desc' })
                },
                // ... другие пункты меню
            ];

            Lampa.Select.show({
                title: Lampa.Lang.translate('settings_rest_source'),
                items: menuOptions,
                onSelect: (item) => item.action(),
                onBack: () => Lampa.Controller.toggle('menu')
            });
        });

        // Добавление в DOM
        $('.menu .menu__list').eq(0).append(menuItem);
    }

    // Вспомогательные функции
    function createServiceItem(title, type, source, years, genreId) {
        return `
            <div class="settings-folder" style="padding:0!important">
                <div style="width:2.2em;height:1.7em;padding-right:.5em">
                    ${getIconForType(type)}
                </div>
                <div style="font-size:1.3em">${title}</div>
            </div>
        `;
    }

    function navigateToCategory(type, source, params) {
        Lampa.Activity.push({
            url: buildApiUrl(type, source, params),
            title: params.title,
            component: 'category_full',
            source: source,
            card_type: 'true',
            ...params
        });
    }

    // Инициализация при готовности приложения
    if (window.appready) {
        initializeRussianMenu();
    } else {
        Lampa.Listener.follow('app', (event) => {
            if (event.type === 'ready') initializeRussianMenu();
        });
    }

    // Модификация TMDB API для русского контента
    function enhanceTmdbApi() {
        const originalTmdb = Lampa.Api.sources.tmdb;
        Lampa.Api.sources.tmdb = {
            ...originalTmdb,
            main: (params) => {
                params.with_original_language = 'ru'; // Фильтр по русскому языку
                return originalTmdb.main(params);
            }
        };
    }

    // Настройки плагина
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: { 
            name: 'rus_content_enabled', 
            type: 'trigger', 
            default: true 
        },
        field: {
            name: 'Включить русский контент',
            description: 'Показывать подборки на главной'
        }
    });

    // Активация
    if (Lampa.Storage.get('rus_content_enabled') !== false) {
        enhanceTmdbApi();
    }

})();
