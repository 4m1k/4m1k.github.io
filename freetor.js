(function () {
    'use strict';

    // Проверка платформы на телевизор
    Lampa.Platform.tv();

    // Функция для декодирования строк
    function decodeString(index) {
        var strings = [
            '(((.+)+)+)+$', 'follow', 'GET',
            'div[data-name="torrserver_use_link"]', 'Ошибка запроса', 'activity', 'Ошибка доступа', '943100IPcgbv',
            'one', 'Settings', '                                                                                                  Free TorrServer',
            'apply', 'bind', 'hide', 'Manifest', 'field', '#app > div.head > div > div.head__actions',
            'internal_torrclient', 'addParam', 'table', 'http://', '#SWITCH_SERVER', 'getItem',
            '#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div > div > div:nth-child(2)',
            'onload', '94VnpwQg', '', 'log', 'hover:enter hover:click hover:touch', 'change', 'Controller', 'Activity', '',
            '1771DiumKP', '1172hFLylK', 'ready', 'div[data-name="torrserv"]', 'onerror', 'prototype', 'show', '87852wwMuAx',
            'switch_server_button', 'toString', 'append', '333khArwF', '.settings-param__name', 'Кнопка для смены сервера',
            'div > span:contains("Ссылки")', 'lampa', '                                                                                                  ',
            '4774469GBkjCt', 'torrserver_use_link', 'remove', 'error', 'Автовыбор', 'two', '{}.constructor("return this")()',
            ':8090', 'Storage', 'Показывать всегда', 'name', '2452JnxdkK', 'android', 'settings_component', 'toggle',
            '25KVcbfP', 'status', 'search', '95272WrJtvv', 'SettingsApi', 'select', 'set', 'http://185.87.48.42:8090/random_torr',
            '__proto__', 'torrserver_url_two', 'TorrServer изменён', 'update', 'torrserv', 'component', 'focus',
            'querySelector', 'active', 'length', 'Ошибка при получении IP-адреса:', 'div[class="head__action selector open--settings"]',
            'color', 'origin', 'Noty', 'listener', '530436nwGtAh', 'Listener', 'send', 'app', 'insertAfter', 'info',
            'div[data-name="torrserver_url_two"]', 'appready', 'open', 'server', 'div[data-name="torrserver_url"]',
            'responseText', '1521vqCYdj', 'constructor', 'console', 'torrents', 'get'
        ];
        return strings[index - 0x87]; // Вычитаем 135 (0x87) из индекса
    }

    // Функция для выполнения HTTP-запроса к серверу
    function sendRequestToServer() {
        if (Lampa.Platform.is('android')) { // Проверяем, является ли платформа Android
            var xhr = new XMLHttpRequest(); // Создаем объект XMLHttpRequest

            // Настройка HTTP-запроса
            xhr.open('GET', 'http://185.87.48.42:8090/random_torr', true);

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
                1: 'lampa' // Значение 1
            },
            default: 1 // Значение по умолчанию
        },
        field: {
            name: 'TorrServer', // Название поля
            description: 'Нажмите для смены сервера' // Описание поля
        },
        onChange: function (value) {
            if (value == '0') {
                Lampa.Storage.set('torrserver_use_link', ''); // Очищаем ссылку на сервер
                Lampa.Storage.set('torrserver_url', ''); // Очищаем URL сервера
                if (Lampa.Storage.get('torrserver_mode') !== 1) {
                    hideServerButton(); // Скрываем кнопку смены сервера
                }
                Lampa.Settings.update(); // Обновляем настройки
            }
            if (value == '1') {
                Lampa.Noty.show('TorrServer изменён'); // Показываем уведомление об изменении сервера
                Lampa.Storage.set('torrserver_use_link', 'lampa'); // Устанавливаем ссылку на сервер
                sendRequestToServer(); // Отправляем запрос к серверу
                updateServerMode(); // Обновляем режим сервера
                Lampa.Controller.close(); // Закрываем контроллер
            }
        },
        onRender: function (element) {
            setTimeout(function () {
                if ($(element).find('.settings-param__value').length > 1) {
                    $(element).hide(); // Скрываем элемент, если есть больше одного значения
                }
                $(element).find('.settings-param__name').css('color', 'ffffff'); // Изменяем цвет текста
                $(element).find('.settings-param__value').hide(); // Скрываем значение параметра

                if (Lampa.Storage.get('torrserver_mode') == '1') {
                    var button = document.createElement('button'); // Создаем кнопку
                    Lampa.Controller.addButton(button); // Добавляем кнопку в контроллер
                    Lampa.Controller.focus('settings_component'); // Фокусируем на компоненте настроек
                    $('#torrserver_url').hide(); // Скрываем текущий URL сервера
                    $('#torrserver_use_link').hide(); // Скрываем ссылку на сервер
                    $('.switch_server_button').show(); // Показываем кнопку смены сервера
                }

                if (Lampa.Storage.get('torrserver_mode') == '0') {
                    var button = document.createElement('button'); // Создаем кнопку
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
            name: 'Кнопка смены сервера', // Название поля
            description: 'Параметр включает отображение кнопки в верхнем баре для быстрой смены сервера' // Описание поля
        },
        onChange: function (value) {
            updateServerMode(); // Обновляем режим сервера
        },
        onRender: function (element) {
            setTimeout(function () {
                $('.switch_server_button').css('display', 'inline-block'); // Показываем кнопку смены сервера
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
        if (mode == 1) {
            hideServerButton(); // Скрываем кнопку
        }
        if (mode == 2) {
            showServerButtonInTorrents(); // Показываем кнопку только в торрентах
        }
        if (mode == 3) {
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

    // Проверяем, загружена ли библиотека Lampa
    var checkLampaInterval = setInterval(function () {
        if (typeof Lampa !== 'undefined') {
            clearInterval(checkLampaInterval); // Останавливаем интервал
            initializeSettings(); // Инициализируем настройки
        }
    }, 200);

    // Инициализация настроек
    function initializeSettings() {
        if (localStorage.getItem('torrserver_mode') === null || localStorage.getItem('torrserver_mode') == 1) {
            Lampa.Storage.set('torrserver_url', ''); // Очищаем URL сервера
            setTimeout(function () {
                sendRequestToServer(); // Отправляем запрос к серверу
                Lampa.Storage.set('torrserver_mode', 'lampa'); // Устанавливаем режим сервера
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
})();
