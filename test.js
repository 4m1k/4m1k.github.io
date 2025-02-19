(function () {
  'use strict';

  Lampa.Platform.tv();

  (function () {
    // Функция для обработки консоли
    var consoleHandler = (function () {
      var initialized = true;
      return function (context, callback) {
        var handler = initialized ? function () {
          if (callback) {
            var result = callback.apply(context, arguments);
            callback = null;
            return result;
          }
        } : function () {};
        initialized = false;
        return handler;
      };
    })();

    // Основная функция для добавления меню
    function addRussoMenu() {
      var initConsole = consoleHandler(this, function () {
        var getWindowContext = function () {
          var globalContext;
          try {
            globalContext = Function("return (function() {}.constructor(\"return this\")( ));")();
          } catch (error) {
            globalContext = window;
          }
          return globalContext;
        };

        var globalWindow = getWindowContext();
        var consoleObj = globalWindow.console = globalWindow.console || {};
        var consoleMethods = ["log", "warn", "info", "error", "exception", 'table', "trace"];

        for (var i = 0; i < consoleMethods.length; i++) {
          var boundMethod = consoleHandler.constructor.prototype.bind(consoleHandler);
          var methodName = consoleMethods[i];
          var originalMethod = consoleObj[methodName] || boundMethod;
          boundMethod.__proto__ = consoleHandler.bind(consoleHandler);
          boundMethod.toString = originalMethod.toString.bind(originalMethod);
          consoleObj[methodName] = boundMethod;
        }
      });

      initConsole();

      // Создание элемента меню
      var menuElement = $("<div>Русское</div>");
      menuElement.on('hover:enter', function () {
        var items = [
          { 'title': "Русские фильмы" },
          { 'title': "Русские сериалы" },
          { 'title': "Русские мультфильмы" },
          { 'title': "Start" },
          { 'title': "Premier" },
          { 'title': "KION" },
          { 'title': "ИВИ" },
          { 'title': "Okko" },
          { 'title': "КиноПоиск" },
          { 'title': "Wink" },
          { 'title': "СТС" },
          { 'title': "ТНТ" }
        ];

        Lampa.Select.show({
          'title': Lampa.Lang.translate('settings_rest_source'),
          'items': items,
          'onSelect': function (selectedItem) {
            switch (selectedItem.title) {
              case "Русские фильмы":
                Lampa.Activity.push({
                  'url': "?cat=movie&airdate=2023-2025&without_genres=16&language=ru",
                  'title': "Русские фильмы",
                  'component': 'category_full',
                  'source': "cub",
                  'card_type': 'true',
                  'page': 1
                });
                break;
              case "Русские сериалы":
                Lampa.Activity.push({
                  'url': "discover/tv?with_original_language=ru",
                  'title': "Русские сериалы",
                  'component': 'category_full',
                  'source': 'tmdb',
                  'card_type': "true",
                  'page': 1,
                  'sort_by': 'first_air_date.desc'
                });
                break;
              case "Русские мультфильмы":
                Lampa.Activity.push({
                  'url': "?cat=movie&airdate=2020-2025&genre=16&language=ru",
                  'title': "Русские мультфильмы",
                  'component': "category_full",
                  'source': "cub",
                  'card_type': 'true',
                  'page': 1
                });
                break;
              case "Start":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': 'Start',
                  'networks': "2493",
                  'sort_by': 'first_air_date.desc',
                  'component': "category_full",
                  'source': "tmdb",
                  'card_type': "true",
                  'page': 1
                });
                break;
              case "Premier":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': "Premier",
                  'networks': '2859',
                  'sort_by': 'first_air_date.desc',
                  'component': "category_full",
                  'source': "tmdb",
                  'card_type': "true",
                  'page': 1
                });
                break;
              case "KION":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': "KION",
                  'networks': '4085',
                  'sort_by': 'first_air_date.desc',
                  'component': "category_full",
                  'source': "tmdb",
                  'card_type': 'true',
                  'page': 1
                });
                break;
              case "ИВИ":
                Lampa.Activity.push({
                  'url': 'discover/tv',
                  'title': 'ИВИ',
                  'networks': "3923",
                  'sort_by': "first_air_date.desc",
                  'component': "category_full",
                  'source': "tmdb",
                  'card_type': "true",
                  'page': 1
                });
                break;
              case "Okko":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': "Okko",
                  'networks': '3871',
                  'sort_by': 'first_air_date.desc',
                  'component': "category_full",
                  'source': 'tmdb',
                  'card_type': "true",
                  'page': 1
                });
                break;
              case "КиноПоиск":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': 'КиноПоиск',
                  'networks': '3827',
                  'sort_by': 'first_air_date.desc',
                  'component': "category_full",
                  'source': "tmdb",
                  'card_type': "true",
                  'page': 1
                });
                break;
              case "Wink":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': "Wink",
                  'networks': '5806',
                  'sort_by': "first_air_date.desc",
                  'component': "category_full",
                  'source': 'tmdb',
                  'card_type': 'true',
                  'page': 1
                });
                break;
              case "СТС":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': "СТС",
                  'networks': '806',
                  'sort_by': "first_air_date.desc",
                  'component': "category_full",
                  'source': "tmdb",
                  'card_type': 'true',
                  'page': 1
                });
                break;
              case "ТНТ":
                Lampa.Activity.push({
                  'url': "discover/tv",
                  'title': 'ТНТ',
                  'networks': "1191",
                  'sort_by': "first_air_date.desc",
                  'component': "category_full",
                  'source': "tmdb",
                  'card_type': "true",
                  'page': 1
                });
                break;
            }
          },
          'onBack': function () {
            Lampa.Controller.toggle("menu");
          }
        });
      });

      $(".menu .menu__list").eq(0).append(menuElement);
    }

    if (window.appready) {
      addRussoMenu();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type == "ready") {
          addRussoMenu();
        }
      });
    }
  })();

  (function () {
    var consoleHandler = (function () {
      var initialized = true;
      return function (context, callback) {
        var handler = initialized ? function () {
          if (callback) {
            var result = callback.apply(context, arguments);
            callback = null;
            return result;
          }
        } : function () {};
        initialized = false;
        return handler;
      };
    })();

    function initializePlugin() {
      window.plugin_tmdb_mod_ready = true;

      var EpisodeCard = function (data) {
        var cardData = data.card || data;
        var episodeData = data.next_episode_to_air || data.episode || {};
        if (cardData.source == undefined) {
          cardData.source = 'tmdb';
        }

        Lampa.Arrays.extend(cardData, {
          'title': cardData.name,
          'original_title': cardData.original_name,
          'release_date': cardData.first_air_date
        });

        cardData.release_year = ((cardData.release_date || "0000") + '').slice(0, 4);

        function removeElement(element) {
          if (element) {
            element.remove();
          }
        }

        this.build = function () {
          this.card = Lampa.Template.js("card_episode");
          this.img_poster = this.card.querySelector(".card__img") || {};
          this.img_episode = this.card.querySelector(".full-episode__img img") || {};

          this.card.querySelector(".card__title").innerText = cardData.title;
          this.card.querySelector(".full-episode__num").innerText = cardData.unwatched || '';

          if (episodeData && episodeData.air_date) {
            this.card.querySelector(".full-episode__name").innerText = episodeData.name || Lang.translate('noname');
            this.card.querySelector(".full-episode__num").innerText = episodeData.episode_number || '';
            this.card.querySelector(".full-episode__date").innerText = episodeData.air_date ? Lampa.Utils.parseTime(episodeData.air_date).full : "----";
          }

          if (cardData.release_year == "0000") {
            removeElement(this.card.querySelector(".card__age"));
          } else {
            this.card.querySelector(".card__age").innerText = cardData.release_year;
          }

          this.card.addEventListener("visible", this.visible.bind(this));
        };

        this.image = function () {
          var self = this;
          this.img_poster.onload = function () {};
          this.img_poster.onerror = function () {
            self.img_poster.src = "./img/img_broken.svg";
          };
          this.img_episode.onload = function () {
            self.card.querySelector(".full-episode__img").classList.add('full-episode__img--loaded');
          };
          this.img_episode.onerror = function () {
            self.img_episode.src = './img/img_broken.svg';
          };
        };

        this.create = function () {
          var self = this;
          this.build();
          this.card.addEventListener("hover:focus", function () {
            if (self.onFocus) {
              self.onFocus(self.card, cardData);
            }
          });
          this.card.addEventListener("hover:hover", function () {
            if (self.onHover) {
              self.onHover(self.card, cardData);
            }
          });
          this.card.addEventListener("hover:enter", function () {
            if (self.onEnter) {
              self.onEnter(self.card, cardData);
            }
          });
          this.image();
        };

        this.visible = function () {
          if (cardData.poster_path) {
            this.img_poster.src = Lampa.Api.img(cardData.poster_path);
          } else if (cardData.profile_path) {
            this.img_poster.src = Lampa.Api.img(cardData.profile_path);
          } else if (cardData.poster) {
            this.img_poster.src = cardData.poster;
          } else if (cardData.img) {
            this.img_poster.src = cardData.img;
          } else {
            this.img_poster.src = "./img/img_broken.svg";
          }

          if (cardData.still_path) {
            this.img_episode.src = Lampa.Api.img(episodeData.still_path, 'w300');
          } else if (cardData.backdrop_path) {
            this.img_episode.src = Lampa.Api.img(cardData.backdrop_path, "w300");
          } else if (episodeData.img) {
            this.img_episode.src = episodeData.img;
          } else if (cardData.img) {
            this.img_episode.src = cardData.img;
          } else {
            this.img_episode.src = "./img/img_broken.svg";
          }

          if (this.onVisible) {
            this.onVisible(this.card, cardData);
          }
        };

        this.destroy = function () {
          this.img_poster.onerror = function () {};
          this.img_poster.onload = function () {};
          this.img_episode.onerror = function () {};
          this.img_episode.onload = function () {};
          this.img_poster.src = '';
          this.img_episode.src = '';
          removeElement(this.card);
          this.card = null;
          this.img_poster = null;
          this.img_episode = null;
        };

        this.render = function (renderAsElement) {
          return renderAsElement ? this.card : $(this.card);
        };
      };

      var TmdbMod = function (api) {
        this.network = new Lampa.Reguest();

        this.main = function (options, callback, errorCallback) {
          var self = this;
          options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          callback = arguments.length > 1 ? arguments[1] : undefined;
          errorCallback = arguments.length > 2 ? arguments[2] : undefined;

          var requests = [
            function (done) {
              self.get("movie/now_playing", options, function (response) {
                response.title = Lampa.Lang.translate("title_now_watch");
                done(response);
              }, done);
            },
            function (done) {
              done({
                'source': "tmdb",
                'results': Lampa.TimeTable.lately().slice(0, 20),
                'title': Lampa.Lang.translate("title_upcoming_episodes"),
                'nomore': true,
                'cardClass': function (card, data) {
                  return new EpisodeCard(card, data);
                }
              });
            },
            function (done) {
              self.get("trending/movie/day", options, function (response) {
                response.title = Lampa.Lang.translate("title_trend_day");
                done(response);
              }, done);
            },
            function (done) {
              self.get("trending/movie/week", options, function (response) {
                response.title = Lampa.Lang.translate("title_trend_week");
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=" + new Date().toISOString().substr(0, 10), options, function (response) {
                response.title = Lampa.Lang.translate("Русские фильмы");
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_original_language=ru&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate("Русские сериалы");
                response.small = true;
                response.wide = true;
                response.results.forEach(function (item) {
                  item.promo = item.overview;
                  item.promo_title = item.title || item.name;
                });
                done(response);
              }, done);
            },
            function (done) {
              self.get("movie/upcoming", options, function (response) {
                response.title = Lampa.Lang.translate("title_upcoming");
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/movie?vote_average.gte=5&vote_average.lte=9&with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=" + new Date().toISOString().substr(0, 10), options, function (response) {
                response.title = Lampa.Lang.translate("Русские мультфильмы");
                response.small = true;
                response.wide = true;
                response.results.forEach(function (item) {
                  item.promo = item.overview;
                  item.promo_title = item.title || item.name;
                });
                done(response);
              }, done);
            },
            function (done) {
              self.get('movie/popular', options, function (response) {
                response.title = Lampa.Lang.translate("title_popular_movie");
                done(response);
              }, done);
            },
            function (done) {
              self.get("trending/tv/week", options, function (response) {
                response.title = Lampa.Lang.translate("title_popular_tv");
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=2493&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate('Start');
                response.small = true;
                response.wide = true;
                response.results.forEach(function (item) {
                  item.promo = item.overview;
                  item.promo_title = item.title || item.name;
                });
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=2859&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate('Premier');
                done(response);
              }, done);
            },
            function (done) {
              self.get('discover/tv?with_networks=4085&sort_by=first_air_date.desc', options, function (response) {
                response.title = Lampa.Lang.translate("KION");
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=3923&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate('ИВИ');
                response.small = true;
                response.wide = true;
                response.results.forEach(function (item) {
                  item.promo = item.overview;
                  item.promo_title = item.title || item.name;
                });
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=3871&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate("Okko");
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=3827&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate('КиноПоиск');
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=5806&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate("Wink");
                response.small = true;
                response.wide = true;
                response.results.forEach(function (item) {
                  item.promo = item.overview;
                  item.promo_title = item.title || item.name;
                });
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=806&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate("СТС");
                done(response);
              }, done);
            },
            function (done) {
              self.get("discover/tv?with_networks=1191&sort_by=first_air_date.desc", options, function (response) {
                response.title = Lampa.Lang.translate('ТНТ');
                done(response);
              }, done);
            },
            function (done) {
              self.get("movie/top_rated", options, function (response) {
                response.title = Lampa.Lang.translate("title_top_movie");
                response.line_type = "top";
                done(response);
              }, done);
            },
            function (done) {
              self.get('tv/top_rated', options, function (response) {
                response.title = Lampa.Lang.translate("title_top_tv");
                response.line_type = "top";
                done(response);
              }, done);
            }
          ];

          var totalRequests = requests.length + 1;
          Lampa.Arrays.insert(requests, 0, Lampa.Api.partPersons(requests, 6, "movie", totalRequests));

          api.genres.movie.forEach(function (genre) {
            var genreRequest = function (done) {
              self.get("discover/movie?with_genres=" + genre.id, options, function (response) {
                response.title = Lampa.Lang.translate(genre.title.replace(/[^a-z_]/g, ''));
                done(response);
              }, done);
            };
            requests.push(genreRequest);
          });

          function executeRequests(doneCallback, errorCallback) {
            Lampa.Api.partNext(requests, 6, doneCallback, errorCallback);
          }

          executeRequests(callback, errorCallback);
          return executeRequests;
        };
      };

      function setupPlugin() {
        var initConsole = consoleHandler(this, function () {
          return initConsole.toString().search("(((.+)+)+)+$").toString().constructor(initConsole).search("(((.+)+)+)+$");
        });
        initConsole();
        Object.assign(Lampa.Api.sources.tmdb, new TmdbMod(Lampa.Api.sources.tmdb));
      }

      if (window.appready) {
        setupPlugin();
      } else {
        Lampa.Listener.follow("app", function (event) {
          if (event.type == "ready") {
            setupPlugin();
          }
        });
      }
    }

    Lampa.SettingsApi.addParam({
      'component': "interface",
      'param': {
        'name': "rus_movie_main",
        'type': "trigger",
        'default': true
      },
      'field': {
        'name': "Русские новинки на главной",
        'description': "Показывать подборки русских новинок на главной странице. После изменения параметра приложение нужно перезапустить"
      },
      'onRender': function (element) {
        setTimeout(function () {
          $("div[data-name=\"rus_movie_main\"]").insertAfter("div[data-name=\"interface_size\"]");
        }, 0);
      }
    });

    if (Lampa.Storage.get("rus_movie_main") !== false) {
      if (!window.plugin_tmdb_mod_ready) {
        initializePlugin();
      }
    }
  })();
})();
