(function () {
    'use strict';

    // Основной объект плагина
    var InterFaceMod = {
        // Название плагина
        name: 'interface_mod',
        // Версия плагина
        version: '2.1.0',
        // Настройки по умолчанию
        settings: {
            enabled: true,
            show_movie_type: true,
            theme: 'default'
        }
    };

function addLabelToCard(card) {
            if (card.querySelector('.content-label')) return;
			
            var view = card.querySelector('.card__view');
            if (!view) return;
            var is_tv = card.classList.contains('card--tv');
            var label = document.createElement('div');
            label.classList.add('content-label');
            if (is_tv) {
                label.classList.add('serial-label');
                label.textContent = 'Сериал';
                label.dataset.type = 'serial';
            } else {
                label.classList.add('movie-label');
                label.textContent = 'Фильм';
                label.dataset.type = 'movie';
            }
            view.appendChild(label);
        }
    // Функция для применения тем
    function applyTheme(theme) {
        // Удаляем предыдущие стили темы
        const oldStyle = document.querySelector('#interface_mod_theme');
        if (oldStyle) oldStyle.remove();

        // Если выбрано "Нет", просто удаляем стили
        if (theme === 'default') return;

        // Создаем новый стиль
        const style = document.createElement('style');
        style.id = 'interface_mod_theme';

        // Определяем стили для разных тем
        const themes = {
            neon: `
                body {
                    background: linear-gradient(135deg, #0d0221 0%, #150734 50%, #1f0c47 100%);
                    color: #ffffff;
                }
                .menu__item.focus,
                .menu__item.traverse,
                .menu__item.hover,
                .settings-folder.focus,
                .settings-param.focus,
                .selectbox-item.focus,
                .full-start__button.focus,
                .full-descr__tag.focus,
                .player-panel .button.focus {
                    background: linear-gradient(to right, #ff00ff, #00ffff);
                    color: #fff;
                    box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                    border: none;
                }
                .card.focus .card__view::after,
                .card.hover .card__view::after {
                    border: 2px solid #ff00ff;
                    box-shadow: 0 0 20px #00ffff;
                }
                .head__action.focus,
                .head__action.hover {
                    background: linear-gradient(45deg, #ff00ff, #00ffff);
                    box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
                }
                .full-start__background {
                    opacity: 0.7;
                    filter: brightness(1.2) saturate(1.3);
                }
                .settings__content,
                .settings-input__content,
                .selectbox__content,
                .modal__content {
                    background: rgba(15, 2, 33, 0.95);
                    border: 1px solid rgba(255, 0, 255, 0.1);
                }
				@-moz-document url-prefix() {
    .full-start__background {
        opacity: 0.7 !important;
        filter: none !important; /* Отключаем фильтры для Firefox */
    }
    body {
        background: #0a0a0a !important; /* Заменяем градиент на сплошной цвет */
    }
}
            `,
            sunset: `
                body {
                    background: linear-gradient(135deg, #2d1f3d 0%, #614385 50%, #516395 100%);
                    color: #ffffff;
                }
                .menu__item.focus,
                .menu__item.traverse,
                .menu__item.hover,
                .settings-folder.focus,
                .settings-param.focus,
                .selectbox-item.focus,
                .full-start__button.focus,
                .full-descr__tag.focus,
                .player-panel .button.focus {
                    background: linear-gradient(to right, #ff6e7f, #bfe9ff);
                    color: #2d1f3d;
                    box-shadow: 0 0 15px rgba(255, 110, 127, 0.3);
                    font-weight: bold;
                }
                .card.focus .card__view::after,
                .card.hover .card__view::after {
                    border: 2px solid #ff6e7f;
                    box-shadow: 0 0 15px rgba(255, 110, 127, 0.5);
                }
                .head__action.focus,
                .head__action.hover {
                    background: linear-gradient(45deg, #ff6e7f, #bfe9ff);
                    color: #2d1f3d;
                }
                .full-start__background {
                    opacity: 0.8;
                    filter: saturate(1.2) contrast(1.1);
                }
				@-moz-document url-prefix() {
    .full-start__background {
        opacity: 0.7 !important;
        filter: none !important; /* Отключаем фильтры для Firefox */
    }
    body {
        background: #0a0a0a !important; /* Заменяем градиент на сплошной цвет */
    }
}
            `,
            emerald: `
                body {
                    background: linear-gradient(135deg, #1a2a3a 0%, #2C5364 50%, #203A43 100%);
                    color: #ffffff;
                }
                .menu__item.focus,
                .menu__item.traverse,
                .menu__item.hover,
                .settings-folder.focus,
                .settings-param.focus,
                .selectbox-item.focus,
                .full-start__button.focus,
                .full-descr__tag.focus,
                .player-panel .button.focus {
                    background: linear-gradient(to right, #43cea2, #185a9d);
                    color: #fff;
                    box-shadow: 0 4px 15px rgba(67, 206, 162, 0.3);
                    border-radius: 5px;
                }
                .card.focus .card__view::after,
                .card.hover .card__view::after {
                    border: 3px solid #43cea2;
                    box-shadow: 0 0 20px rgba(67, 206, 162, 0.4);
                }
                .head__action.focus,
                .head__action.hover {
                    background: linear-gradient(45deg, #43cea2, #185a9d);
                }
                .full-start__background {
                    opacity: 0.85;
                    filter: brightness(1.1) saturate(1.2);
                }
                .settings__content,
                .settings-input__content,
                .selectbox__content,
                .modal__content {
                    background: rgba(26, 42, 58, 0.98);
                    border: 1px solid rgba(67, 206, 162, 0.1);
                }
				@-moz-document url-prefix() {
    .full-start__background {
        opacity: 0.7 !important;
        filter: none !important; /* Отключаем фильтры для Firefox */
    }
    body {
        background: #0a0a0a !important; /* Заменяем градиент на сплошной цвет */
    }
}
            `,
            aurora: `
                body {
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
                    color: #ffffff;
                }
                .menu__item.focus,
                .menu__item.traverse,
                .menu__item.hover,
                .settings-folder.focus,
                .settings-param.focus,
                .selectbox-item.focus,
                .full-start__button.focus,
                .full-descr__tag.focus,
                .player-panel .button.focus {
                    background: linear-gradient(to right, #aa4b6b, #6b6b83, #3b8d99);
                    color: #fff;
                    box-shadow: 0 0 20px rgba(170, 75, 107, 0.3);
                    transform: scale(1.02);
                    transition: all 0.3s ease;
                }
                .card.focus .card__view::after,
                .card.hover .card__view::after {
                    border: 2px solid #aa4b6b;
                    box-shadow: 0 0 25px rgba(170, 75, 107, 0.5);
                }
                .head__action.focus,
                .head__action.hover {
                    background: linear-gradient(45deg, #aa4b6b, #3b8d99);
                    transform: scale(1.05);
                }
                .full-start__background {
                    opacity: 0.75;
                    filter: contrast(1.1) brightness(1.1);
                }
				@-moz-document url-prefix() {
    .full-start__background {
        opacity: 0.7 !important;
        filter: none !important; /* Отключаем фильтры для Firefox */
    }
    body {
        background: #0a0a0a !important; /* Заменяем градиент на сплошной цвет */
    }
}
            `,
            bywolf_mod: `
                body {
                    background: linear-gradient(135deg, #090227 0%, #170b34 50%, #261447 100%);
                    color: #ffffff;
                }
                .menu__item.focus,
                .menu__item.traverse,
                .menu__item.hover,
                .settings-folder.focus,
                .settings-param.focus,
                .selectbox-item.focus,
                .full-start__button.focus,
                .full-descr__tag.focus,
                .player-panel .button.focus {
                    background: linear-gradient(to right, #fc00ff, #00dbde);
                    color: #fff;
                    box-shadow: 0 0 30px rgba(252, 0, 255, 0.3);
                    animation: cosmic-pulse 2s infinite;
                }
                @keyframes cosmic-pulse {
                    0% { box-shadow: 0 0 20px rgba(252, 0, 255, 0.3); }
                    50% { box-shadow: 0 0 30px rgba(0, 219, 222, 0.3); }
                    100% { box-shadow: 0 0 20px rgba(252, 0, 255, 0.3); }
                }
                .card.focus .card__view::after,
                .card.hover .card__view::after {
                    border: 2px solid #fc00ff;
                    box-shadow: 0 0 30px rgba(0, 219, 222, 0.5);
                }
                .head__action.focus,
                .head__action.hover {
                    background: linear-gradient(45deg, #fc00ff, #00dbde);
                    animation: cosmic-pulse 2s infinite;
                }
                .full-start__background {
                    opacity: 0.8;
                    filter: saturate(1.3) contrast(1.1);
                }
                .settings__content,
                .settings-input__content,
                .selectbox__content,
                .modal__content {
                    background: rgba(9, 2, 39, 0.95);
                    border: 1px solid rgba(252, 0, 255, 0.1);
                    box-shadow: 0 0 30px rgba(0, 219, 222, 0.1);
                }
				@-moz-document url-prefix() {
    .full-start__background {
        opacity: 0.7 !important;
        filter: none !important; /* Отключаем фильтры для Firefox */
    }
    body {
        background: #0a0a0a !important; /* Заменяем градиент на сплошной цвет */
    }
}
            `
        };

        style.textContent = themes[theme] || '';
        document.head.appendChild(style);
    }



    // Функция инициализации плагина
    function startPlugin() {
  	if (Lampa.Storage.get("theme_select")=='') Lampa.Storage.set("theme_select","emerald");

        
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'theme_select',
                type: 'select',
                values: {
                    default: 'Нет',
                    bywolf_mod: 'bywolf_mod',
                    neon: 'Neon',
                    sunset: 'Dark MOD',
                    emerald: 'Emerald V1',
                    aurora: 'Aurora'
                },
                default: 'default'
            },
            field: {
                name: 'Тема интерфейса',
                description: 'Выберите тему оформления интерфейса'
            },
            onChange: function(value) {
                InterFaceMod.settings.theme = value;
                Lampa.Settings.update();
                applyTheme(value);
            }
        });
        
		    Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'theme_serial',
                type: 'trigger',
                default: false
            },
            field: {
                name: 'Скрыть подписи: Сериалы, Фильмы',
                description: 'Скрыть с карточки'
            },
            onChange: function() {
            }
        });
		

        InterFaceMod.settings.show_movie_type = Lampa.Storage.get('season_info_show_movie_type', true);
        InterFaceMod.settings.theme = Lampa.Storage.get('theme_select', 'default');
        applyTheme(InterFaceMod.settings.theme);
		var styleTag = document.createElement('style');
        styleTag.innerHTML = `
            /* Базовый стиль для всех лейблов */
            .content-label {
                position: absolute !important;
                top: 1.4em !important;
                left: -0.8em !important;
                color: white !important;
                padding: 0.4em 0.4em !important;
                border-radius: 0.3em !important;
                font-size: 0.8em !important;
                z-index: 10 !important;
            }
            
            /* Сериал - синий */
            .serial-label {
                background-color: #3498db !important;
            }
            
            /* Фильм - зелёный */
            .movie-label {
                background-color: #2ecc71 !important;
            }
        `;
        document.head.appendChild(styleTag);
		var timerser = setInterval(function () {
		if (Lampa.Storage.get('theme_serial')!=true && Lampa.Storage.get("language")=='ru' && Lampa.Activity.active() && (Lampa.Activity.active().component=='main' || Lampa.Activity.active().component=='category' || Lampa.Activity.active().component=='category_full')) {
				var cards = document.querySelectorAll('.card');
            cards.forEach(function(card) {
                addLabelToCard(card);
            });
				// $('.card__type').each(function() {
				// if ($(this).text().trim() == 'TV') {
				// $(this).text('Сериал');
				// }
				// });	
		}},500);
    }

    // Ждем загрузки приложения и запускаем плагин
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }

    // Регистрация плагина в манифесте
    Lampa.Manifest.plugins = {
        name: 'Интерфейс мод',
        version: '2.1.0',
        description: 'Улучшенный интерфейс для приложения Lampa'
    };
})(); 
