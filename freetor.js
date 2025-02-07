(function () {
    'use strict';

    // Проверка платформы (TV)
    Lampa.Platform.tv();

    // Функция для отправки запроса к серверу
    function sendRequestToServer() {
        if (Lampa.Platform.is('android')) { // Проверяем, является ли платформа Android
            var xhr = new XMLHttpRequest(); // Создаем объект XMLHttpRequest
            xhr.open('GET', 'http://185.87.48.42:8090/random_torr', true); // Открываем GET-запрос

            // Обработчик успешного завершения запроса
            xhr.onload = function () {
                if (xhr.status === 200) { // Если статус ответа равен 200 (OK)
                    var response = xhr.responseText; // Получаем текст ответа
                    Lampa.Storage.set('torrserver_url_two', 'http://' + response + '/'); // Сохраняем новый URL сервера
                } else { // Если статус не равен 200
                    console.log('Ошибка запроса', xhr.status); // Выводим ошибку в консоль
                    Lampa.Noty.show('Ошибка доступа'); // Показываем уведомление об ошибке доступа
                }
            };

            // Обработчик ошибки запроса
            xhr.onerror = function () {
                console.log('Ошибка запроса', xhr.status); // Выводим ошибку в консоль
                Lampa.Noty.show('Ошибка доступа'); // Показываем уведомление об ошибке доступа
            };

            // Отправляем запрос
            xhr.send();
        } else {
            Lampa.Noty.show('Платформа не поддерживается'); // Показываем уведомление о неподдерживаемой платформе
        }
    }

    // Добавление параметра "torrserv" в настройки
    Lampa.SettingsApi.addParam({
        component: 'settings_component', // Компонент настроек
        param: {
            name: 'torrserv', // Название параметра
            type: 'select', // Тип параметра (выпадающий список)
            values: {
                0: 'Свой вариант', // Значение 0
                1: 'bylampa' // Значение 1
            },
            default: 1 // Значение по умолчанию
        },
        field: {
            name: 'TorrServer', // Название поля
            description: 'Нажмите для смены сервера' // Описание поля
        },
        onChange: function (value) {
            if (value == '0') { // Если выбран "Свой вариант"
                Lampa.Storage.set('torrserver_use_link', ''); // Очищаем ссылку на сервер
                Lampa.Storage.set('torrserver_url', ''); // Очищаем URL сервера
                if (Lampa.Storage.get('torrserver_mode') !== 1) {
                    hideServerButton(); // Скрываем кнопку смены сервера
                }
                Lampa.Settings.update(); // Обновляем настройки
            }
            if (value == '1') { // Если выбран "bylampa"
                Lampa.Noty.show('TorrServer изменён'); // Показываем уведомление об изменении сервера
                Lampa.Storage.set('torrserver_use_link', 'bylampa'); // Устанавливаем ссылку на сервер
                sendRequestToServer(); // Отправляем запрос к серверу
                updateServerMode(); // Обновляем режим сервера
                Lampa.Controller.close(); // Закрываем контроллер
            }
        },
        onRender: function (element) {
            setTimeout(function () {
                // Находим элементы интерфейса
                var nameElement = $(element).find('.settings-param__name');
                var valueElement = $(element).find('.settings-param__value');

                // Изменяем внешний вид
                nameElement.css('color', 'white'); // Устанавливаем цвет текста
                valueElement.css('display', 'block'); // Показываем значение

                // Логика отображения
                if ($(element).find('.settings-param__value').length > 1) {
                    $(element).hide(); // Скрываем элемент, если есть больше одного значения
                }

                if (Lampa.Storage.get('torrserver_mode') == '1') {
                    var button = document.createElement('button'); // Создаем кнопку
                    button.textContent = 'Сменить сервер'; // Устанавливаем текст
                    button.id = 'switch_server_button'; // Устанавливаем ID
                    Lampa.Controller.addButton(button); // Добавляем кнопку в контроллер
                    Lampa.Controller.focus('settings_component'); // Фокусируем на компоненте настроек
                    $('#torrserver_url').hide(); // Скрываем текущий URL сервера
                    $('#torrserver_use_link').hide(); // Скрываем ссылку на сервер
                    $('.switch_server_button').show(); // Показываем кнопку смены сервера
                }

                if (Lampa.Storage.get('torrserver_mode') == '0') {
                    var button = document.createElement('button'); // Создаем кнопку
                    button.textContent = 'Сменить сервер'; // Устанавливаем текст
                    button.id = 'switch_server_button'; // Устанавливаем ID
                    Lampa.Controller.addButton(button); // Добавляем кнопку в контроллер
                    Lampa.Controller.focus('settings_component'); // Фокусируем на компоненте настроек
                    $('#torrserver_url').hide(); // Скрываем текущий URL сервера
                    $('.switch_server_button').hide(); // Скрываем кнопку смены сервера
                    $('#switch_server_button').show(); // Показываем кнопку смены сервера
                }
            }, 0);
        }
    });

    // Добавление параметра "switch_server_button" в настройки
    Lampa.SettingsApi.addParam({
        component: 'settings_component', // Компонент настроек
        param: {
            name: 'switch_server_button', // Название параметра
            type: 'select', // Тип параметра (выпадающий список)
            values: {
                1: 'Не показывать', // Значение 1
                2: 'Показывать только в торрентах', // Значение 2
                3: 'Показывать всегда' // Значение 3
            },
            default: '2' // Значение по умолчанию
        },
        field: {
            name: 'Кнопка для смены сервера', // Название поля
            description: 'Параметр включает отображение кнопки в верхнем баре для быстрой смены сервера' // Описание поля
        },
        onChange: function (value) {
            updateServerMode(); // Обновляем режим сервера
        },
        onRender: function (element) {
            setTimeout(function () {
                $('div[data-name="switch_server_button"]').css('display', 'inline-block'); // Показываем кнопку смены сервера
            }, 0);
        }
    });

    // Функция для скрытия кнопки смены сервера
    function hideServerButton() {
        $('#switch_server_button').hide(); // Скрываем кнопку
    }

    // Функция для обновления режима сервера
    function updateServerMode() {
        var mode = Lampa.Storage.get('torrserver_mode'); // Получаем текущий режим сервера
        if (mode == '1') {
            hideServerButton(); // Скрываем кнопку
        }
        if (mode == '2') {
            showServerButtonInTorrents(); // Показываем кнопку только в торрентах
        }
        if (mode == '3') {
            showServerButtonAlways(); // Показываем кнопку всегда
        }
    }

    // Функция для показа кнопки только в торрентах
    function showServerButtonInTorrents() {
        $('#switch_server_button').hide(); // Скрываем кнопку
        Lampa.Storage.listener.on('change', function (event) {
            if (event.name == 'activity') {
                if (Lampa.Activity.active().component !== 'torrents') {
                    $('#switch_server_button').hide(); // Скрываем кнопку, если активный компонент не torrents
                } else {
                    $('#switch_server_button').show(); // Показываем кнопку, если активный компонент torrents
                }
            }
        });
    }

    // Функция для постоянного показа кнопки
    function showServerButtonAlways() {
        $('#switch_server_button').show(); // Постоянно показываем кнопку
    }

    // Инициализация настроек
    var checkLampaInterval = setInterval(function () {
        if (typeof Lampa !== 'undefined') {
            clearInterval(checkLampaInterval); // Останавливаем интервал
            initializeSettings(); // Инициализируем настройки
        }
    }, 200);

    function initializeSettings() {
        if (localStorage.getItem('torrserver_mode') === null || localStorage.getItem('torrserver_mode') == 1) {
            Lampa.Storage.set('torrserver_url', ''); // Очищаем URL сервера
            setTimeout(function () {
                sendRequestToServer(); // Отправляем запрос к серверу
                Lampa.Storage.set('torrserver_mode', 'bylampa'); // Устанавливаем режим сервера
            }, 3000);
        }
        if (localStorage.getItem('torrserver_mode') === null) {
            showDefaultServerButton(); // Показываем кнопку смены сервера по умолчанию
        }
        if (Lampa.Platform.is('android')) {
            Lampa.Storage.set('internal_torrclient', true); // Включаем внутренний торрент-клиент
        }
    }

    // Показываем кнопку смены сервера по умолчанию
    function showDefaultServerButton() {
        $('#switch_server_button').show(); // Показываем кнопку
    }

    // Проверяем, загружена ли библиотека Lampa
    if (window['appready']) {
        initializeSettings(); // Инициализируем настройки
    } else {
        Lampa.Events.on('appready', function () {
            initializeSettings(); // Инициализируем настройки при готовности приложения
        });
    }

    // Функция для создания SVG-кнопок
    function createSwitchServerButtons() {
        var svgCode = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                <!-- Прямоугольник -->
                <rect x="225.104" y="330.796" style="fill:#979696;" width="100.213" height="21.202"></rect>

                <!-- Круги -->
                <circle style="fill:#43B471;" cx="369.338" cy="342.252" r="19.487"></circle>
                <circle style="fill:#D3D340;" cx="416.663" cy="342.252" r="19.487"></circle>
                <circle style="fill:#D15075;" cx="463.989" cy="342.252" r="19.487"></circle>
            </svg>
        `;

        var container = document.createElement('div');
        container.id = 'switch-server-buttons';
        container.innerHTML = svgCode;

        var appContainer = document.querySelector('#app > div.head > div > div.head__actions');
        if (appContainer) {
            appContainer.appendChild(container); // Добавляем SVG в интерфейс
        }
    }

    // Добавление обработчиков событий для SVG-кнопок
    function addEventListenersToButtons() {
        var confirmButton = document.querySelector('circle[style*="#43B471"]');
        var warningButton = document.querySelector('circle[style*="#D3D340"]');
        var cancelButton = document.querySelector('circle[style*="#D15075"]');

        confirmButton.addEventListener('click', function () {
            Lampa.Noty.show('Сервер изменён');
            sendRequestToServer(); // Отправляем запрос к серверу
        });

        warningButton.addEventListener('click', function () {
            Lampa.Noty.show('Внимание!');
            // Дополнительная логика для предупреждения
        });

        cancelButton.addEventListener('click', function () {
            Lampa.Noty.show('Действие отменено');
            // Дополнительная логика для отмены действия
        });
    }

    // Инициализация SVG-кнопок
    createSwitchServerButtons();
    addEventListenersToButtons();
})();
