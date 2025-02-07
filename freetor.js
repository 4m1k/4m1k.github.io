(function () {
    'use strict';

    // Функция для создания кнопки смены сервера
    function createSwitchServerButton() {
        var button = document.createElement('button'); // Создаем кнопку
        button.textContent = 'Сменить сервер'; // Устанавливаем текст
        button.id = 'switch_server_button'; // Устанавливаем ID

        // Добавляем обработчик клика
        button.onclick = function () {
            Lampa.Noty.show('Выполняется смена сервера...');
            sendRequestToServer(); // Отправляем запрос к серверу
        };

        // Добавляем кнопку в интерфейс
        var container = document.querySelector('#app > div.head > div > div.head__actions');
        if (container) {
            container.appendChild(button); // Добавляем кнопку в контейнер
        }
    }

    // Функция для отправки запроса к серверу
    function sendRequestToServer() {
        if (Lampa.Platform.is('android')) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://185.87.48.42:8090/random_torr', true);

            // Обработчик успешного завершения запроса
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    Lampa.Storage.set('torrserver_url_two', 'http://' + response + '/');
                } else {
                    Lampa.Noty.show('Ошибка доступа');
                }
            };

            // Обработчик ошибки
            xhr.onerror = function () {
                Lampa.Noty.show('Ошибка доступа');
            };

            // Отправляем запрос
            xhr.send();
        } else {
            Lampa.Noty.show('Платформа не поддерживается');
        }
    }

    // Добавление параметров в настройки
    Lampa.SettingsApi.addParam({
        component: 'settings_component',
        param: {
            name: 'torrserv',
            type: 'select',
            values: {
                0: 'Свой вариант',
                1: 'bylampa'
            },
            default: 1
        },
        field: {
            name: 'TorrServer',
            description: 'Нажмите для смены сервера'
        },
        onRender: function (element) {
            setTimeout(function () {
                var nameElement = $(element).find('.settings-param__name');
                var valueElement = $(element).find('.settings-param__value');

                nameElement.css('color', 'white');
                valueElement.css('display', 'block');
            }, 0);
        }
    });

    // Создаем кнопку смены сервера
    createSwitchServerButton();

    // Инициализация настроек
    var checkLampaInterval = setInterval(function () {
        if (typeof Lampa !== 'undefined') {
            clearInterval(checkLampaInterval);
            initializeSettings();
        }
    }, 200);

    function initializeSettings() {
        if (localStorage.getItem('torrserver_mode') === null || localStorage.getItem('torrserver_mode') == 1) {
            Lampa.Storage.set('torrserver_url', '');
            setTimeout(function () {
                sendRequestToServer();
                Lampa.Storage.set('torrserver_mode', 'bylampa');
            }, 3000);
        }
    }
})();
