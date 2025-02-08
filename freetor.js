// Функция для выполнения HTTP-запроса к фиксированному серверу
function sendRequestToServer() {
    if (Lampa.Platform.is('android')) { // Проверяем, является ли платформа Android
        var xhr = new XMLHttpRequest(); // Создаем объект XMLHttpRequest
        // Фиксированный URL для запроса
        var requestUrl = 'http://185.87.48.42:8090/random_torr';

        // Добавляем логирование для отладки
        console.log('Отправляю запрос к серверу:', requestUrl);

        xhr.open('GET', requestUrl, true);
        // Обработчик успешного завершения запроса
        xhr.onload = function () {
            console.log('Ответ от сервера:', requestUrl, 'Статус:', xhr.status);
            if (xhr.status === 200) { // Если статус ответа равен 200 (OK)
                var response = xhr.responseText; // Получаем текст ответа
                Lampa.Storage.set('torrserver_url_two', 'http://' + response + '/'); // Сохраняем новый URL сервера
                console.log('Успешный запрос к серверу:', requestUrl);
            } else { // Если статус не равен 200
                console.log('Ошибка запроса к серверу', requestUrl, 'Статус:', xhr.status);
                Lampa.Noty.show('Ошибка доступа'); // Показываем уведомление об ошибке доступа
            }
        };
        // Обработчик ошибки запроса
        xhr.onerror = function () {
            console.log('Ошибка запроса к серверу', requestUrl);
            Lampa.Noty.show('Ошибка доступа'); // Показываем уведомление об ошибке доступа
        };
        // Отправляем запрос
        xhr.send();
    } else {
        Lampa.Noty.show('Платформа не поддерживается'); // Показываем уведомление о неподдерживаемой платформе
    }
}
