(function () {
  'use strict';

  Lampa.Listener.follow("full", function (event) {
    if (event.type == "complite" && Lampa.Storage.get("logo_card") !== false) {
      var movieData = event.data.movie; 
      var contentType = movieData.name ? 'tv' : 'movie'; 
      var tmdbApiUrl = "http://212.113.103.137:9118/proxy/http://api.themoviedb.org/3/" + 
                        contentType + '/' + movieData.id + 
                        "/images?api_key=" + "4ef0d7355d9ffb5151e987764708ce96" + 
                        "&language=" + Lampa.Storage.get("language");

      $.get(tmdbApiUrl, function (response) {
        if (response.logos && response.logos[0]) {
          var logoPath = response.logos[0].file_path; 

          if (logoPath !== '') {
            if (Lampa.Storage.get("card_interfice_type") === 'new') {
              $(".full-start-new__tagline").remove();
              $('.full-start-new__title').html(
                "<img style=\"margin-top: 0.3em; margin-bottom: 0.1em; max-height: 1.8em;\" " + 
                "src=\"http://212.113.103.137:9118/proxyimg/http://image.tmdb.org/t/p/w500" + 
                logoPath.replace(".svg", ".png") + "\" />"
              );
            } else {
              $(".full-start__title-original").remove();
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
