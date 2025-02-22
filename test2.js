(function () {
  'use strict';

  // Подписка на событие загрузки полной карточки фильма/сериала
  Lampa.Listener.follow("full", function (event) {
    // Проверяем, завершена ли загрузка и включена ли настройка "Логотип вместо названия"
    if (event.type == "complite" && Lampa.Storage.get("logo_card") !== false) {
      
      var movieData = event.data.movie; // Данные о фильме/сериале
      var contentType = movieData.name ? 'tv' : 'movie'; // Определяем тип контента: 'tv' (сериал) или 'movie' (фильм)

      // Формируем URL для запроса логотипов фильма/сериала через API TMDB
      var tmdbApiUrl = "http://212.113.103.137:9118/proxy/http://api.themoviedb.org/3/" + 
                        contentType + '/' + movieData.id + 
                        "/images?api_key=" + "4ef0d7355d9ffb5151e987764708ce96" + 
                        "&language=" + Lampa.Storage.get("language");

      // Отправляем GET-запрос к API TMDB для получения логотипов
      $.get(tmdbApiUrl, function (response) {
        // Проверяем, есть ли логотипы в ответе API
        if (response.logos && response.logos[0]) {
          var logoPath = response.logos[0].file_path; // Берём путь к первому доступному логотипу

          if (logoPath !== '') {
            // Проверяем, используется ли новый интерфейс карточки в Lampa
            if (Lampa.Storage.get("card_interfice_type") === 'new') {
              $(".full-start-new__tagline").remove(); // Удаляем слоган
              $('.full-start-new__title').html(
                "<img style=\"margin-top: 0.3em; margin-bottom: 0.1em; max-height: 1.8em;\" " + 
                "src=\"http://212.113.103.137:9118/proxyimg/http://image.tmdb.org/t/p/w500" + 
                logoPath.replace(".svg", ".png") + "\" />"
              );
            } else {
              $(".full-start__title-original").remove(); // Удаляем оригинальное название фильма
              $('.full-start__title').html(
                "<img style=\"margin-top: 0.3em; margin-bottom: 0.4em; max-height: 1.8em;\" " + 
                "src=\"http://212.113.103.137:9118/proxyimg/http://image.tmdb.org/t/p/w500" + 
                logoPath.replace(".svg", ".png") + "\" />"
              );
            }
          }
        }
      });
    }
  });

})();
