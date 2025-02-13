(function () {
  'use strict';
  Lampa.Platform.tv();
  (function () {
    var obfuscationFunction1 = function () {
      var isObfuscated = true;
      return function (context, callback) {
        var obfuscatedCallback = isObfuscated ? function () {
          if (callback) {
            var result = callback.apply(context, arguments);
            callback = null;
            return result;
          }
        } : function () {};
        isObfuscated = false;
        return obfuscatedCallback;
      };
    }();
    'use strict';
    function initializeMenu() {
      var _0x137b96 = obfuscationFunction1(this, function () {
        var getWindow = function () {
          var windowObj;
          try {
            windowObj = Function("return (function() {}.constructor(\"return this\")( ));")();
          } catch (error) {
            windowObj = window;
          }
          return windowObj;
        };
        var windowContext = getWindow();
        var console = windowContext.console = windowContext.console || {};
        var methods = ["log", "warn", "info", "error", "exception", 'table', "trace"];
        for (var i = 0; i < methods.length; i++) {
          var bindFunction = obfuscationFunction1.constructor.prototype.bind(obfuscationFunction1);
          var methodName = methods[i];
          var existingMethod = console[methodName] || bindFunction;
          bindFunction.__proto__ = obfuscationFunction1.bind(obfuscationFunction1);
          bindFunction.toString = existingMethod.toString.bind(existingMethod);
          console[methodName] = bindFunction;
        }
      });
      _0x137b96();
      var rusMoviesItem = $("Русское");
      rusMoviesItem.on('hover:enter', function () {
        var rusMoviesItems = [{
          'title': "Русские фильмы"
        }, {
          'title': "Русские сериалы"
        }, {
          'title': "Русские мультфильмы"
        }, {
          'title': "Start"
        }, {
          'title': "Premier"
        }, {
          'title': "KION"
        }, {
          'title': "ИВИ"
        }, {
          'title': "Okko"
        }, {
          'title': "КиноПоиск"
        }, {
          'title': "Wink"
        }, {
          'title': " 1020	СТС"
        }, {
          'title': " 1020	ТНТ"
        }];
        Lampa.Select.show({
          'title': Lampa.Lang.translate('settings_rest_source'),
          'items': rusMoviesItems,
          'onSelect': function onMovieSelect(selectedItem) {
            if (selectedItem.title === "Русские фильмы") {
              Lampa.Activity.push({
                'url': "?cat=movie&airdate=2023-2025&without_genres=16&language=ru",
                'title': "Русские фильмы",
                'component': 'category_full',
                'source': "cub",
                'card_type': 'true',
                'page': 1
              });
            } else if (selectedItem.title === "Русские сериалы") {
              Lampa.Activity.push({
                'url': "discover/tv?&with_original_language=ru",
                'title': "Русские сериалы",
                'component': 'category_full',
                'source': 'tmdb',
                'card_type': "true",
                'page': 1,
                'sort_by': 'first_air_date.desc'
              });
            } else if (selectedItem.title === "Русские мультфильмы") {
              Lampa.Activity.push({
                'url': "?cat=movie&airdate=2020-2025&genre=16&language=ru",
                'title': "Русские мультфильмы",
                'component': "category_full",
                'source': "cub",
                'card_type': 'true',
                'page': 1
              });
            } else if (selectedItem.title === "Start") {
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
            } else if (selectedItem.title === "Premier") {
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
            } else if (selectedItem.title === "KION") {
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
            } else if (selectedItem.title === "ИВИ") {
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
            } else if (selectedItem.title === "Okko") {
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
            } else if (selectedItem.title === "КиноПоиск") {
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
            } else if (selectedItem.title === "Wink") {
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
            } else if (selectedItem.title === " 1020	СТС") {
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
            } else if (selectedItem.title === " 1020	ТНТ") {
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
            }
          },
          'onBack': function onMenuBack() {
            Lampa.Controller.toggle("menu");
          }
        });
      });
      $(".menu .menu__list").eq(0).append(rusMoviesItem);
    }
    if (window.appready) {
      initializeMenu();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type == "ready") {
          initializeMenu();
        }
      });
    }
  })();
  (function () {
    var obfuscationFunction2 = function () {
      var isObfuscated = true;
      return function (context, callback) {
        var obfuscatedCallback = isObfuscated ? function () {
          if (callback) {
            var result = callback.apply(context, arguments);
            callback = null;
            return result;
          }
        } : function () {};
        isObfuscated = false;
        return obfuscatedCallback;
      };
    }();
    'use strict';
    function applyTmdbModifications() {
      window.plugin_tmdb_mod_ready = true;
      var buildEpisodeCard = function (cardData) {
        var episodeCardData = cardData.card || cardData;
        var nextEpisodeData = cardData.next_episode_to_air || cardData.episode || {};
        if (episodeCardData.source == undefined) {
          episodeCardData.source = 'tmdb';
        }
        Lampa.Arrays.extend(episodeCardData, {
          'title': episodeCardData.name,
          'original_title': episodeCardData.original_name,
          'release_date': episodeCardData.first_air_date
        });
        episodeCardData.release_year = ((episodeCardData.release_date || "0000") + '').slice(0, 4);
        function removeElement(element) {
          if (element) {
            element.remove();
          }
        }
        this.build = function () {
          this.card = Lampa.Template.js("card_episode");
          this.img_poster = this.card.querySelector(".card__img") || {};
          this.img_episode = this.card.querySelector(".full-episode__img img") || {};
          this.card.querySelector(".card__title").innerText = episodeCardData.title;
          this.card.querySelector(".full-episode__num").innerText = episodeCardData.unwatched || '';
          if (nextEpisodeData && nextEpisodeData.air_date) {
            this.card.querySelector(".full-episode__name").innerText = nextEpisodeData.name || Lang.translate('noname');
            this.card.querySelector(".full-episode__num").innerText = nextEpisodeData.episode_number || '';
            this.card.querySelector(".full-episode__date").innerText = nextEpisodeData.air_date ? Lampa.Utils.parseTime(nextEpisodeData.air_date).full : "----";
          }
          if (episodeCardData.release_year == "0000") {
            removeElement(this.card.querySelector(".card__age"));
          } else {
            this.card.querySelector(".card__age").innerText = episodeCardData.release_year;
          }
          this.card.addEventListener("visible", this.visible.bind(this));
        };
        this.image = function () {
          var _this = this;
          this.img_poster.onload = function () {};
          this.img_poster.onerror = function () {
            _this.img_poster.src = "./img/img_broken.svg";
          };
          this.img_episode.onload = function () {
            _this.card.querySelector(".full-episode__img").classList.add('full-episode__img--loaded');
          };
          this.img_episode.onerror = function () {
            _this.img_episode.src = './img/img_broken.svg';
          };
        };
        this.create = function () {
          var _this2 = this;
          this.build();
          this.card.addEventListener("hover:focus", function () {
            if (_this2.onFocus) {
              _this2.onFocus(_this2.card, episodeCardData);
            }
          });
          this.card.addEventListener("hover:hover", function () {
            if (_this2.onHover) {
              _this2.onHover(_this2.card, episodeCardData);
            }
          });
          this.card.addEventListener("hover:enter", function () {
            if (_this2.onEnter) {
              _this2.onEnter(_this2.card, episodeCardData);
            }
          });
          this.image();
        };
        this.visible = function () {
          if (episodeCardData.poster_path) {
            this.img_poster.src = Lampa.Api.img(episodeCardData.poster_path);
          } else if (episodeCardData.profile_path) {
            this.img_poster.src = Lampa.Api.img(episodeCardData.profile_path);
          } else if (episodeCardData.poster) {
            this.img_poster.src = episodeCardData.poster;
          } else if (episodeCardData.img) {
            this.img_poster.src = episodeCardData.img;
          } else {
            this.img_poster.src = "./img/img_broken.svg";
          }
          if (episodeCardData.still_path) {
            this.img_episode.src = Lampa.Api.img(nextEpisodeData.still_path, 'w300');
          } else if (episodeCardData.backdrop_path) {
            this.img_episode.src = Lampa.Api.img(episodeCardData.backdrop_path, "w300");
          } else if (nextEpisodeData.img) {
            this.img_episode.src = nextEpisodeData.img;
          } else if (episodeCardData.img) {
            this.img_episode.src = episodeCardData.img;
          } else {
            this.img_episode.src = "./img/img_broken.svg";
          }
          if (this.onVisible) {
            this.onVisible(this.card, episodeCardData);
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
        this.render = function (isJavaScript) {
          return isJavaScript ? this.card : $(this.card);
        };
      };
      var mainTmdb = function (source) {
        this.network = new Lampa.Reguest();
        this.main = function () {
          var _this3 = this;
          var requestParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var requestCallback = arguments.length > 1 ? arguments[1] : undefined;
          var fetchFunctions = [function (callback) {
            _this3.get("movie/now_playing", requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_now_watch");
              callback(data);
            }, callback);
          }, function (callback) {
            callback({
              'source': "tmdb",
              'results': Lampa.TimeTable.lately().slice(0, 20),
              'title': Lampa.Lang.translate("title_upcoming_episodes"),
              'nomore': true,
              'cardClass': function cardClass(card, params) {
                return new buildEpisodeCard(card, params);
              }
            });
          }, function (callback) {
            _this3.get("trending/movie/day", requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_trend_day");
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get("trending/movie/week", requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_trend_week");
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get("discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=" + new Date().toISOString().substr(0, 10), requestParams, function (data) {
              data.title = Lampa.Lang.translate("Русские фильмы");
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get("discover/tv?with_original_language=ru&sort_by=first_air_date.desc", requestParams, function (data) {
              data.title = Lampa.Lang.translate("Русские сериалы");
              data.small = true;
              data.wide = true;
              data.results.forEach(function (item) {
                item.promo = item.overview;
                item.promo_title = item.title || item.name;
              });
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get("movie/upcoming", requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_upcoming");
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get("trending/tv/week", requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_popular_tv");
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get('movie/popular', requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_popular_movie");
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get("movie/top_rated", requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_top_movie");
              data.line_type = "top";
              callback(data);
            }, callback);
          }, function (callback) {
            _this3.get('tv/top_rated', requestParams, function (data) {
              data.title = Lampa.Lang.translate("title_top_tv");
              data.line_type = "top";
              callback(data);
            }, callback);
          }];
          var genresCount = Lampa.Api.genres.movie.length + 1;
          Lampa.Arrays.insert(fetchFunctions, 0, Lampa.Api.partPersons(fetchFunctions, 6, "movie", genresCount));
          Lampa.Api.genres.movie.forEach(function (genre) {
            var fetchGenreMovies = function fetchGenreMovies(callback) {
              _this3.get("discover/movie?with_genres=" + genre.id, requestParams, function (data) {
                data.title = Lampa.Lang.translate(genre.title.replace(/[^a-z_]/g, ''));
                callback(data);
              }, callback);
            };
            fetchFunctions.push(fetchGenreMovies);
          });
          function fetchFunctionsHandler(partLoaded, partEmpty) {
            Lampa.Api.partNext(fetchFunctions, 6, partLoaded, partEmpty);
          }
          fetchFunctionsHandler(requestCallback, fetchFunctions);
          return fetchFunctionsHandler;
        };
      };
      function applyTmdbModificationsToSource() {
        var _0x5e3af6 = obfuscationFunction2(this, function () {
          return _0x5e3af6.toString().search("(((.+)+)+)+$").toString().constructor(_0x5e3af6).search("(((.+)+)+)+$");
        });
        _0x5e3af6();
        Object.assign(Lampa.Api.sources.tmdb, new mainTmdb(Lampa.Api.sources.tmdb));
      }
      if (window.appready) {
        applyTmdbModificationsToSource();
      } else {
        Lampa.Listener.follow("app", function (event) {
          if (event.type == "ready") {
            applyTmdbModificationsToSource();
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
      'onRender': function onRender(render) {
        setTimeout(function () {
          $("div[data-name=\"rus_movie_main\"]").insertAfter("div[data-name=\"interface_size\"]");
        }, 0);
      }
    });
    if (Lampa.Storage.get("rus_movie_main") !== false) {
      if (!window.plugin_tmdb_mod_ready) {
        applyTmdbModifications();
      }
    }
  })();
})();
