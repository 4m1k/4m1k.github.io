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
