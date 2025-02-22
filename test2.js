/* 
 * Полностью деобфусцированный код (версия с переименованными переменными и функциями)
 * Обратите внимание: некоторые числовые коэффициенты и вычисления заменены на PLACEHOLDER,
 * а функции-антиотладка оставлены для сохранения общей структуры.
 */
 

(function () {
  "use strict";

  // Инициализация платформы для телевизоров
  Lampa.Platform.tv();

  // Функция-однократный вызов (once)
  var once = (function () {
    var firstCall = true;
    return function (context, func) {
      var resultFunc = firstCall
        ? function () {
            if (func) {
              var result = func.apply(context, arguments);
              func = null;
              return result;
            }
          }
        : function () {};
      firstCall = false;
      return resultFunc;
    };
  }());

  // Протектор – проверка на попытки дебаггинга (антиотладка)
  var protect = once(this, function () {
    // Здесь производится проверка исходного кода функции protect,
    // заменённая на плейсхолдер для понятности.
    return protect
      .toString()
      .search("(((.+)+)+)+$")
      .toString()
      .constructor(protect)
      .search("(((.+)+)+)+$");
  });
  protect();

  // Еще одна однократная функция для защиты
  var onceAgain = (function () {
    var firstCallAgain = true;
    return function (context, func) {
      var resultFunc = firstCallAgain
        ? function () {
            if (func) {
              var result = func.apply(context, arguments);
              func = null;
              return result;
            }
          }
        : function () {};
      firstCallAgain = false;
      return resultFunc;
    };
  }());

  // Запуск дополнительной проверки (антиотладка)
  (function () {
    onceAgain(this, function () {
      var regexFuncDeclaration = new RegExp("function *\\( *\\)");
      var regexIncrement = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i");
      // getDeobfuscated – функция, реализующая дополнительную защиту (заменена на плейсхолдер)
      var initFunc = getDeobfuscated("init");
      if (
        !regexFuncDeclaration.test(initFunc + "chain") ||
        !regexIncrement.test(initFunc + "input")
      ) {
        initFunc("0");
      } else {
        getDeobfuscated();
      }
    })();
  })();

  // Функция для привязки (bind) – однократный вызов
  var bindOnce = (function () {
    var firstCallBind = true;
    return function (context, func) {
      var resultFunc = firstCallBind
        ? function () {
            if (func) {
              var result = func.apply(context, arguments);
              func = null;
              return result;
            }
          }
        : function () {};
      firstCallBind = false;
      return resultFunc;
    };
  }());

  // Переопределение консоли: заменяем методы console.log, warn, info и т.д.
  var overrideConsole = bindOnce(this, function () {
    var getGlobal = function () {
      var globalObj;
      try {
        globalObj = Function("return (function() {}.constructor(\"return this\")( ));")();
      } catch (e) {
        globalObj = window;
      }
      return globalObj;
    };
    var globalObject = getGlobal();
    var consoleObj = globalObject.console = globalObject.console || {};
    var methods = ["log", "warn", "info", "error", "exception", "table", "trace"];
    for (var i = 0; i < methods.length; i++) {
      var boundMethod = bindOnce.constructor.prototype.bind(bindOnce);
      var methodName = methods[i];
      var originalMethod = consoleObj[methodName] || boundMethod;
      boundMethod.__proto__ = bindOnce.bind(bindOnce);
      boundMethod.toString = originalMethod.toString.bind(originalMethod);
      consoleObj[methodName] = boundMethod;
    }
  });
  overrideConsole();

  // Создаем объект для сетевых запросов
  var network = new Lampa.Reguest();
  var cache = {};
  var totalRequestCount = 0;
  var proxyRequestCount = 0;

  // Запуск интервала для периодического вызова функции защиты (антиотладка)
  (function () {
    var globalObj;
    try {
      var getGlobal = Function("return (function() {}.constructor(\"return this\")( ));");
      globalObj = getGlobal();
    } catch (e) {
      globalObj = window;
    }
    globalObj.setInterval(getDeobfuscated, 4000);
  })();

  var goodRequestCount = 0;
  var menuList = [];
  var genresMap = {};
  var countriesMap = {};

  // Функция для получения данных с API
  function getData(urlSuffix, onSuccess, onError) {
    // Решаем, использовать ли прокси (на основании количества запросов)
    var useProxy =
      totalRequestCount >= 10 && goodRequestCount > totalRequestCount / 2;
    if (!useProxy) {
      totalRequestCount++;
    }
    var baseUrl = "https://kinopoiskapiunofficial.tech/" + urlSuffix;
    network.timeout(15000);
    network.silent(
      (useProxy ? "https://cors.kp556.workers.dev:8443/" : "") + baseUrl,
      function (response) {
        onSuccess(response);
      },
      function (error, details) {
        useProxy =
          !useProxy && (proxyRequestCount < 10 || goodRequestCount > proxyRequestCount / 2);
        if (
          useProxy &&
          (error.status == 429 || (error.status == 0 && error.statusText !== "timeout"))
        ) {
          proxyRequestCount++;
          network.timeout(15000);
          network.silent(
            "https://cors.kp556.workers.dev:8443/" + baseUrl,
            function (resp) {
              goodRequestCount++;
              onSuccess(resp);
            },
            onError,
            false,
            {
              headers: {
                "X-API-KEY": "2a4a0808-81a3-40ae-b0d3-e11335ede616"
              }
            }
          );
        } else {
          onError(error, details);
        }
      },
      false,
      {
        headers: {
          "X-API-KEY": "2a4a0808-81a3-40ae-b0d3-e11335ede616"
        }
      }
    );
  }

  // Функции для упрощенного вызова getData
  function getComplete(urlSuffix, callback) {
    getData(urlSuffix, callback, function () {
      callback(null);
    });
  }

  function getCompleteIf(condition, urlSuffix, callback) {
    if (condition) {
      getComplete(urlSuffix, callback);
    } else {
      setTimeout(function () {
        callback(null);
      }, 10);
    }
  }

  // Функции работы с кэшем
  function getCacheData(key) {
    // Здесь происходит проверка кэша по ключу и возврат сохраненных данных,
    // либо обновление кэша при устаревании.
    // (Логика переименована и упрощена для читаемости)
    var cached = cache[key];
    if (cached) {
      var oneHourAgo = new Date().getTime() - 3600000;
      if (cached.timestamp > oneHourAgo) {
        return cached.value;
      }
      // Очистка устаревших значений кэша
      for (var k in cache) {
        if (cache[k].timestamp <= oneHourAgo) {
          delete cache[k];
        }
      }
    }
    return null;
  }

  function setCacheData(key, value) {
    var timestamp = new Date().getTime();
    cache[key] = { timestamp: timestamp, value: value };
  }

  function getFromCache(key, onSuccess, onError) {
    var data = getCacheData(key);
    if (data) {
      setTimeout(function () {
        onSuccess(data, true);
      }, 10);
    } else {
      getData(key, onSuccess, onError);
    }
  }

  function clearNetworkCache() {
    network.clear();
  }

  // Функция преобразования элемента (например, фильма) в читаемый формат
  function convertElement(item) {
    var type = !item.type || item.type === "FILM" || item.type === "VIDEO" ? "movie" : "tv";
    var id = item.kinopoiskId || item.filmId || 0;
    var rating = +item.rating || +item.ratingKinopoisk || 0;
    var title = item.nameRu || item.nameEn || item.nameOriginal || "";
    var originalTitle = item.nameOriginal || item.nameEn || item.nameRu || "";
    var isAdult = false;
    var result = {
      source: "KP",
      type: type,
      adult: false,
      id: "KP_" + id,
      title: title,
      original_title: originalTitle,
      overview: item.description || item.shortDescription || "",
      img: item.posterUrlPreview || item.posterUrl || "",
      background_image: item.coverUrl || item.posterUrl || item.posterUrlPreview || "",
      genres:
        item.genres && item.genres.map(function (genreItem) {
          if (genreItem.genre === "для взрослых") {
            isAdult = true;
          }
          return {
            id: genreItem.genre && genresMap[genreItem.genre] || 0,
            name: genreItem.genre,
            url: ""
          };
        }) || [],
      production_companies: [],
      production_countries:
        item.countries &&
        item.countries.map(function (countryItem) {
          return { name: countryItem.country };
        }) || [],
      vote_average: rating,
      vote_count: item.ratingVoteCount || item.ratingKinopoiskVoteCount || 0,
      kinopoisk_id: id,
      kp_rating: rating,
      imdb_id: item.imdbId || "",
      imdb_rating: item.ratingImdb || 0
    };
    result.adult = isAdult;
    var releaseDate = item.year && item.year !== "null" ? item.year : "";
    var endYear = "";
    if (type === "tv") {
      if (item.startYear && item.startYear !== "null") {
        releaseDate = item.startYear;
      }
      if (item.endYear && item.endYear !== "null") {
        endYear = item.endYear;
      }
    }
    if (item.distributions_obj) {
      var distributions = item.distributions_obj.items || [];
      var parsedRelease = Date.parse(releaseDate);
      var earliest = null;
      distributions.forEach(function (dist) {
        if (dist.date && (dist.type === "WORLD_PREMIER" || dist.type === "ALL")) {
          var parsedDate = Date.parse(dist.date);
          if (!isNaN(parsedDate) && (earliest == null || parsedDate < earliest) && (isNaN(parsedRelease) || parsedDate >= parsedRelease)) {
            earliest = parsedDate;
            releaseDate = dist.date;
          }
        }
      });
    }
    if (type === "tv") {
      result.name = title;
      result.original_name = originalTitle;
      result.first_air_date = releaseDate;
      if (endYear) {
        result.last_air_date = endYear;
      }
    } else {
      result.release_date = releaseDate;
    }
    if (item.seasons_obj) {
      var seasonsList = item.seasons_obj.items || [];
      result.number_of_seasons = item.seasons_obj.total || seasonsList.length || 1;
      result.seasons = seasonsList.map(function (seasonItem) {
        return convertSeason(seasonItem);
      });
      var totalEpisodes = 0;
      result.seasons.forEach(function (season) {
        totalEpisodes += season.episode_count;
      });
      result.number_of_episodes = totalEpisodes;
    }
    if (item.staff_obj) {
      var staffList = item.staff_obj || [];
      var cast = [];
      var crew = [];
      staffList.forEach(function (staff) {
        var person = {
          id: staff.staffId,
          name: staff.nameRu || staff.nameEn || "",
          url: "",
          img: staff.posterUrl || "",
          character: staff.description || "",
          job: Lampa.Utils.capitalizeFirstLetter((staff.professionKey || "").toLowerCase())
        };
        if (staff.professionKey === "ACTOR") {
          cast.push(person);
        } else {
          crew.push(person);
        }
      });
      result.persons = { cast: cast, crew: crew };
    }
    if (item.sequels_obj) {
      var sequels = item.sequels_obj || [];
      result.collection = {
        results: sequels.map(function (seq) {
          return convertElement(seq);
        })
      };
    }
    if (item.similars_obj) {
      var similars = item.similars_obj.items || [];
      result.simular = {
        results: similars.map(function (sim) {
          return convertElement(sim);
        })
      };
    }
    return result;
  }

  // Функция преобразования данных о сезонах (для ТВ-сериалов)
  function convertSeason(seasonData) {
    var helper = {
      actorTitlePlaceholder: "title_actor",
      equal: function (a, b) {
        return a === b;
      },
      concat: function (a, b) {
        return a + b;
      },
      separator: " / ",
      seasonLabel: "torrent_serial_season",
      episodeLabel: "torrent_serial_episode"
    };

    var episodes = seasonData.episodes || [];
    episodes = episodes.map(function (ep) {
      // Здесь для каждого эпизода формируется объект с данными
      return {
        season_number: ep.seasonNumber,
        episode_number: ep.episodeNumber,
        name:
          ep.nameRu ||
          ep.nameEn ||
          helper.concat(
            helper.concat(helper.concat("S", ep.seasonNumber), helper.separator),
            ep.episodeNumber
          ),
        overview: ep.synopsis || "",
        air_date: ep.releaseDate
      };
    });
    return {
      season_number: seasonData.number,
      episode_count: episodes.length,
      episodes: episodes,
      name: helper.concat(Lampa.Lang.translate(helper.seasonLabel) + " ", seasonData.number),
      overview: ""
    };
  }

  // Функция для получения списка элементов по заданному URL и параметрам
  function getList(url, params = {}, onSuccess, onError) {
    var requestUrl = url;
    if (params.query) {
      var queryDecoded = decodeURIComponent(params.query)
        .replace(/[\s.,:;’'`!?]+/g, " ")
        .trim();
      if (!queryDecoded) {
        onError();
        return;
      }
      requestUrl = Lampa.Utils.addUrlComponent(requestUrl, "keyword=" + encodeURIComponent(queryDecoded));
    }
    var page = params.page || 1;
    requestUrl = Lampa.Utils.addUrlComponent(requestUrl, "page=" + page);
    getFromCache(requestUrl, function (response, fromCache) {
      var items = [];
      if (response.items && response.items.length) {
        items = response.items;
      } else if (response.films && response.films.length) {
        items = response.films;
      } else if (response.releases && response.releases.length) {
        items = response.releases;
      }
      if (!fromCache && items.length) {
        setCacheData(requestUrl, response);
      }
      var results = items.map(function (el) {
        return convertElement(el);
      });
      results = results.filter(function (item) {
        return !item.adult;
      });
      var totalPages = response.pagesCount || response.totalPages || 1;
      var resultObj = {
        results: results,
        url: url,
        page: page,
        total_pages: totalPages,
        total_results: 0,
        more: totalPages > page
      };
      onSuccess(resultObj);
    }, onError);
  }

  // Функция для получения данных по ID (например, для детальной информации о фильме)
  function _getById(id, onSuccess, onError, onFallback) {
    var apiUrl = "api/v2.2/films/" + id;
    var cachedData = getCacheData(apiUrl);
    if (cachedData) {
      setTimeout(function () {
        onSuccess(convertElement(cachedData));
      }, 10);
    } else {
      getData(apiUrl, function (data) {
        if (data.kinopoiskId) {
          var type = !data.type || data.type === "FILM" || data.type === "VIDEO" ? "movie" : "tv";
          getCompleteIf(type === "tv", "api/v2.2/films/" + id + "/seasons", function (seasonsData) {
            data.seasons_obj = seasonsData;
            getComplete("api/v2.2/films/" + id + "/distributions", function (distData) {
              data.distributions_obj = distData;
              getComplete("/api/v1/staff?filmId=" + id, function (staffData) {
                data.staff_obj = staffData;
                getComplete("api/v2.1/films/" + id + "/sequels_and_prequels", function (seqData) {
                  data.sequels_obj = seqData;
                  getComplete("api/v2.2/films/" + id + "/similars", function (simData) {
                    data.similars_obj = simData;
                    setCacheData(apiUrl, data);
                    onSuccess(convertElement(data));
                  });
                });
              });
            });
          });
        } else {
          onFallback();
        }
      }, onFallback);
    }
  }

  // Обертка для getById с дополнительными настройками меню
  function getById(id, params = {}, onSuccess, onError) {
    menu({}, function () {
      return _getById(id, params, onSuccess, onError);
    });
  }

  // Главная функция формирования разделов (категорий) в приложении
  function main(sectionsParams = {}, onReady, onError) {
    var sections = [
      function (callback) {
        getList("api/v2.2/films/top?type=TOP_100_POPULAR_FILMS", sectionsParams, function (data) {
          data.title = Lampa.Lang.translate("title_now_watch");
          callback(data);
        }, callback);
      },
      function (callback) {
        getList("api/v2.2/films/top?type=TOP_250_BEST_FILMS", sectionsParams, function (data) {
          data.title = Lampa.Lang.translate("title_top_movie");
          callback(data);
        }, callback);
      },
      function (callback) {
        getList("api/v2.2/films?order=NUM_VOTE&type=FILM", sectionsParams, function (data) {
          data.title = "Популярные фильмы";
          callback(data);
        }, callback);
      },
      function (callback) {
        getList("api/v2.2/films?order=NUM_VOTE&type=TV_SERIES", sectionsParams, function (data) {
          data.title = "Популярные сериалы";
          callback(data);
        }, callback);
      },
      function (callback) {
        getList("api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES", sectionsParams, function (data) {
          data.title = "Популярные мини-сериалы";
          callback(data);
        }, callback);
      },
      function (callback) {
        getList("api/v2.2/films?order=NUM_VOTE&type=TV_SHOW", sectionsParams, function (data) {
          data.title = "Популярные телешоу";
          callback(data);
        }, callback);
      }
    ];

    function processSections(startIndex, finishCallback) {
      Lampa.Api.partNext(sections, 5, startIndex, finishCallback);
    }

    menu({}, function () {
      var countryId = countriesMap["Россия"];
      if (countryId) {
        // Добавление разделов для российских фильмов/сериалов
        sections.splice(3, 0, function (callback) {
          getList("api/v2.2/films?order=NUM_VOTE&countries=" + countryId + "&type=FILM", sectionsParams, function (data) {
            data.title = "Популярные российские фильмы";
            callback(data);
          }, callback);
        });
        sections.splice(5, 0, function (callback) {
          getList("api/v2.2/films?order=NUM_VOTE&countries=" + countryId + "&type=TV_SERIES", sectionsParams, function (data) {
            data.title = "Популярные российские сериалы";
            callback(data);
          }, callback);
        });
        sections.splice(7, 0, function (callback) {
          getList("api/v2.2/films?order=NUM_VOTE&countries=" + countryId + "&type=MINI_SERIES", sectionsParams, function (data) {
            data.title = "Популярные российские мини-сериалы";
            callback(data);
          }, callback);
        });
      }
      processSections(onReady, onError);
    });
    return processSections;
  }

  // Функция формирования категории (например, «Продолжить просмотр», «Рекомендации»)
  function category(params = {}, onSuccess, onError) {
    var isSimple = ["movie", "tv"].indexOf(params.url) > -1 && !params.genres;
    var favorites = isSimple ? Lampa.Favorite.continues(params.url) : [];
    favorites.forEach(function (item) {
      if (!item.source) {
        item.source = "tmdb";
      }
    });
    favorites = favorites.filter(function (item) {
      return ["KP", "tmdb", "cub"].indexOf(item.source) !== -1;
    });
    var recommendations = isSimple ? Lampa.Arrays.shuffle(Lampa.Recomends.get(params.url)).slice(0, 19) : [];
    recommendations.forEach(function (item) {
      if (!item.source) {
        item.source = "tmdb";
      }
    });
    recommendations = recommendations.filter(function (item) {
      return ["KP", "tmdb", "cub"].indexOf(item.source) !== -1;
    });
    var sections = [
      function (callback) {
        callback({
          results: favorites,
          title: params.url == "tv"
            ? Lampa.Lang.translate("title_continue")
            : Lampa.Lang.translate("title_watched")
        });
      },
      function (callback) {
        callback({
          results: recommendations,
          title: Lampa.Lang.translate("title_recomend_watch")
        });
      }
    ];

    function processCategory(startIndex, finishCallback) {
      Lampa.Api.partNext(sections, 5, startIndex, finishCallback);
    }

    menu({}, function () {
      var genreNames = ["семейный", "детский", "короткометражка", "мультфильм", "аниме"];
      genreNames.forEach(function (genreName) {
        var genreId = genresMap[genreName];
        if (genreId) {
          sections.push(function (callback) {
            getList("api/v2.2/films?order=NUM_VOTE&genres=" + genreId + "&type=" + (params.url == "tv" ? "TV_SERIES" : "FILM"), params, function (data) {
              data.title = Lampa.Utils.capitalizeFirstLetter(genreName);
              callback(data);
            }, callback);
          });
        }
      });
      menuList.forEach(function (menuItem) {
        if (!menuItem.hide && !menuItem.separator && genreNames.indexOf(menuItem.title) == -1) {
          sections.push(function (callback) {
            getList("api/v2.2/films?order=NUM_VOTE&genres=" + menuItem.id + "&type=" + (params.url == "tv" ? "TV_SERIES" : "FILM"), params, function (data) {
              data.title = Lampa.Utils.capitalizeFirstLetter(menuItem.title);
              callback(data);
            }, callback);
          });
        }
      });
      processCategory(onSuccess, onError);
    });
    return processCategory;
  }

  // Функция для полной информации о фильме/сериале
  function full(details, onComplete, onError) {
    if (details.card && details.card.source === "KP" && details.card.kinopoisk_id) {
      getById(details.card.kinopoisk_id, details, function (data) {
        var status = new Lampa.Status(4);
        status.onComplite = onComplete;
        status.append("movie", data);
        status.append("persons", data && data.persons);
        status.append("collection", data && data.collection);
        status.append("simular", data && data.simular);
      }, onError);
    } else {
      onError();
    }
  }

  // Функция для формирования списка по заданному URL (например, для поиска)
  function list(params = {}, onSuccess, onError) {
    var url = params.url;
    if (url === "" && params.genres) {
      url = "api/v2.2/films?order=NUM_VOTE&genres=" + params.genres;
    }
    getList(url, params, onSuccess, onError);
  }

  // Функция поиска по ключевому слову
  function search(params = {}, onSuccess) {
    var query = decodeURIComponent(params.query || "");
    var status = new Lampa.Status(1);
    status.onComplite = function (response) {
      var resultSections = [];
      if (response.query && response.query.results) {
        var filtered = response.query.results.filter(function (item) {
          var normTitle = item.title.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, "-").replace(/ё/g, "е").replace(/[\s.,:;’'`!?]+/g, " ").trim();
          var normQuery = query.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, "-").replace(/ё/g, "е").replace(/[\s.,:;’'`!?]+/g, " ").trim();
          return normTitle.indexOf(normQuery) !== -1 ||
                 (typeof item.original_title === "string" &&
                  item.original_title.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, "-").replace(/ё/g, "е").replace(/[\s.,:;’'`!?]+/g, " ").trim().indexOf(normQuery) !== -1);
        });
        if (filtered.length && filtered.length !== response.query.results.length) {
          response.query.results = filtered;
          response.query.more = true;
        }
        var moviesSection = Object.assign({}, response.query);
        moviesSection.results = response.query.results.filter(function (item) {
          return item.type === "movie";
        });
        moviesSection.title = Lampa.Lang.translate("menu_movies");
        moviesSection.type = "movie";
        if (moviesSection.results.length) {
          resultSections.push(moviesSection);
        }
        var tvSection = Object.assign({}, response.query);
        tvSection.results = response.query.results.filter(function (item) {
          return item.type === "tv";
        });
        tvSection.title = Lampa.Lang.translate("menu_tv");
        tvSection.type = "tv";
        if (tvSection.results.length) {
          resultSections.push(tvSection);
        }
      }
      onSuccess(resultSections);
    };
    getList("api/v2.1/films/search-by-keyword", params, function (data) {
      status.append("query", data);
    }, status.error.bind(status));
  }

  // Функция discovery – возвращает настройки поиска для источника KP
  function discovery() {
    var sourceObj = { source: "KP" };
    var params = { align_left: true, object: sourceObj };
    return {
      title: "KP",
      search: search,
      params: params,
      onMore: function (queryData) {
        Lampa.Activity.push({
          url: "api/v2.1/films/search-by-keyword",
          title: Lampa.Lang.translate("search") + " - " + queryData.query,
          component: "category_full",
          page: 1,
          query: encodeURIComponent(queryData.query),
          source: "KP"
        });
      },
      onCancel: network.clear.bind(network)
    };
  }

  // Функция для получения информации о персоне
  function person(personData = {}, onComplete) {
    var status = new Lampa.Status(1);
    status.onComplite = function (response) {
      var result = {};
      if (response.query) {
        var data = response.query;
        result.person = {
          id: data.personId,
          name: data.nameRu || data.nameEn || "",
          url: "",
          img: data.posterUrl || "",
          gender: data.sex === "MALE" ? 2 : data.sex === "FEMALE" ? 1 : 0,
          birthday: data.birthday,
          place_of_birth: data.birthplace,
          deathday: data.death,
          place_of_death: data.deathplace,
          known_for_department: data.profession || "",
          biography: (data.facts || []).join(" ")
        };
        var directors = [];
        var directorsSet = {};
        var actors = [];
        var actorsSet = {};
        if (data.films) {
          data.films.forEach(function (film) {
            if (film.professionKey === "DIRECTOR" && !directorsSet[film.filmId]) {
              directorsSet[film.filmId] = true;
              directors.push(convertElement(film));
            } else if (film.professionKey === "ACTOR" && !actorsSet[film.filmId]) {
              actorsSet[film.filmId] = true;
              actors.push(convertElement(film));
            }
          });
        }
        var knownFor = [];
        if (directors.length) {
          directors.sort(function (a, b) {
            var diff = b.vote_average - a.vote_average;
            return diff ? diff : a.id - b.id;
          });
          knownFor.push({ name: Lampa.Lang.translate("title_producer"), credits: directors });
        }
        if (actors.length) {
          actors.sort(function (a, b) {
            var diff = b.vote_average - a.vote_average;
            return diff ? diff : a.id - b.id;
          });
          knownFor.push({
            name: Lampa.Lang.translate(data.sex === "FEMALE" ? "title_actress" : "title_actor"),
            credits: actors
          });
        }
        result.credits = { knownFor: knownFor };
      }
      onComplete(result);
    };
    var url = "api/v1/staff/" + personData.id;
    getFromCache(url, function (data, fromCache) {
      if (!fromCache && data.personId) {
        setCacheData(url, data);
      }
      status.append("query", data);
    }, status.error.bind(status));
  }

  // Функция меню – получает список фильтров/жанров
  function menu(onReady) {
    if (menuList.length) {
      onReady(menuList);
    } else {
      getData("api/v2.2/films/filters", function (data) {
        if (data.genres) {
          data.genres.forEach(function (genre) {
            menuList.push({
              id: genre.id,
              title: genre.genre,
              url: "",
              hide: genre.genre === "для взрослых",
              separator: !genre.genre
            });
            genresMap[genre.genre] = genre.id;
          });
        }
        if (data.countries) {
          data.countries.forEach(function (country) {
            countriesMap[country.country] = country.id;
          });
        }
        onReady(menuList);
      }, function () {
        onReady([]);
      });
    }
  }

  // Функция menuCategory – здесь просто возвращает пустой список (для совместимости)
  function menuCategory(source, callback) {
    callback([]);
  }

  // Функция для обработки сезонов (для ТВ-сериалов)
  function seasons(seriesData, seasonNumbers, onComplete) {
    var status = new Lampa.Status(seasonNumbers.length);
    status.onComplite = onComplete;
    seasonNumbers.forEach(function (seasonNum) {
      var seasonsList = seriesData.seasons || [];
      seasonsList = seasonsList.filter(function (season) {
        return season.season_number === seasonNum;
      });
      if (seasonsList.length) {
        status.append("" + seasonNum, seasonsList[0]);
      } else {
        status.error();
      }
    });
  }

  // Определяем объект источника KP и регистрируем его
  var kpSource = {
    SOURCE_NAME: "KP"
  };
  kpSource.SOURCE_TITLE = "KP";
  kpSource.main = main;
  kpSource.menu = menu;
  kpSource.full = full;
  kpSource.list = list;
  kpSource.category = category;
  kpSource.clear = clearNetworkCache;
  kpSource.person = person;
  kpSource.seasons = seasons;
  kpSource.menuCategory = menuCategory;
  kpSource.discovery = discovery;

  var source_tmdb = { name: "tmdb", title: "TMDB" };
  var source_cub = { name: "cub", title: "CUB" };
  var source_pub = { name: "pub", title: "PUB" };
  var source_filmix = { name: "filmix", title: "FILMIX" };
  var source_KP = { name: "KP", title: kpSource.SOURCE_TITLE };
  var ALL_SOURCES = [source_tmdb, source_cub, source_pub, source_filmix, source_KP];

  // Функция регистрации плагина
  function startPlugin() {
    window.kp_source_plugin = true;
    manifest = {};
    Lampa.Manifest.plugins = manifest;
    if (!Lampa.Lang) {
      var langStorage = {};
      Lampa.Lang = {
        add: function (data) {
          langStorage = data;
        },
        translate: function (key) {
          return langStorage[key] ? langStorage[key].ru : key;
        }
      };
    }
    var currentSources;
    if (Lampa.Params.values && Lampa.Params.values.source) {
      currentSources = Object.assign({}, Lampa.Params.values.source);
      currentSources.KP = kpSource.SOURCE_TITLE;
    } else {
      currentSources = {};
      ALL_SOURCES.forEach(function (src) {
        if (Lampa.Api.sources[src.name]) {
          currentSources[src.name] = src.title;
        }
      });
    }
    Lampa.Params.select("source", currentSources, "tmdb");
  }
  if (!window.kp_source_plugin) {
    startPlugin();
  }

  // Определяем манифест, список меню и инициализируем настройки
  var manifest;
  menuList = [];
  console.log("App", "protocol:", window.location.protocol === "https:" ? "https://" : "http://");

  var Lmp = {
    init: function () {
      this.sources();
      if (!window.FX) {
        window.FX = { max_qualitie: 720, is_max_qualitie: true, auth: false };
      }
    },
    sources: function () {
      var sourcesObj;
      if (Lampa.Params.values && Lampa.Params.values.source) {
        sourcesObj = Object.assign({}, Lampa.Params.values.source);
        sourcesObj.filmix = "FILMIX";
      } else {
        sourcesObj = { tmdb: "TMDB", cub: "CUB", filmix: "FILMIX" };
      }
      Lampa.Params.select("source", sourcesObj, "tmdb");
    },
    setCache: function (key, data) {
      setCacheData(key, data);
    },
    getCache: function (key) {
      return getCacheData(key);
    }
  };

  // Пример реализации плагина Filmix
  var Filmix = {
    network: new Lampa.Reguest(),
    api_url: "http://filmixapp.cyou/api/v2/",
    token: Lampa.Storage.get("filmix_token", ""),
    user_dev:
      "app_lang=ru_RU&user_dev_apk=2.1.2&user_dev_id=" +
      Lampa.Utils.uid(16) +
      "&user_dev_name=Xiaomi&user_dev_os=11&user_dev_vendor=Xiaomi&user_dev_token=",
    add_new: function () {
      var codeDisplay = "";
      var tokenCode = "";
      var modalHtml = $(
        "<div><div class=\"broadcast__text\">" +
          Lampa.Lang.translate("filmix_modal_text") +
          "</div><div class=\"broadcast__device selector\" style=\"text-align: center\">Ожидаем код...</div><br><div class=\"broadcast__scan\"><div></div></div></div></div>"
      );
      Lampa.Modal.open({
        title: "",
        html: modalHtml,
        onBack: function () {
          Lampa.Modal.close();
          Lampa.Controller.toggle("settings_component");
          clearInterval(ping_auth);
        },
        onSelect: function () {
          Lampa.Utils.copyTextToClipboard(codeDisplay, function () {
            Lampa.Noty.show(Lampa.Lang.translate("filmix_copy_secuses"));
          }, function () {
            Lampa.Noty.show(Lampa.Lang.translate("filmix_copy_fail"));
          });
        }
      });
      ping_auth = setInterval(function () {
        Filmix.checkPro(tokenCode, function (data) {
          if (data && data.user_data) {
            Lampa.Modal.close();
            clearInterval(ping_auth);
            Lampa.Storage.set("filmix_token", tokenCode);
            Filmix.token = tokenCode;
            $("[data-name=\"filmix_token\"] .settings-param__value").text(tokenCode);
            Lampa.Controller.toggle("settings_component");
          }
        });
      }, 2000);
      this.network.clear();
      this.network.timeout(10000);
      this.network.quiet(
        this.api_url + "token_request?" + this.user_dev,
        function (response) {
          if (response.status == "ok") {
            tokenCode = response.code;
            codeDisplay = response.user_code;
            modalHtml.find(".selector").text(codeDisplay);
          } else {
            Lampa.Noty.show(response);
          }
        },
        function (error, details) {
          Lampa.Noty.show(Filmix.network.errorDecode(error, details));
        }
      );
    }
  };

  var Pub = { network: new Lampa.Reguest() };

  function startFilmixPlugin() {
    window.plugin_lmp = true;
    manifest = {};
    Lampa.Manifest.plugins = manifest;
    if (!Lampa.Lang) {
      var langData = {};
      Lampa.Lang = {
        add: function (data) {
          langData = data;
        },
        translate: function (key) {
          return langData[key] ? langData[key].ru : key;
        }
      };
    }
    // Далее – добавление переводов для плагина Filmix
    var translations = {
      pub_sort_views: { ru: "По просмотрам" },
      pub_sort_watchers: { ru: "По подпискам" },
      pub_sort_updated: { ru: "По обновлению" },
      pub_sort_created: { ru: "По дате добавления" },
      pub_search_coll: { ru: "Поиск по подборкам" },
      pub_title_all: { ru: "Все" },
      pub_title_popular: { ru: "Популярные" },
      pub_title_new: { ru: "Новые" },
      pub_title_hot: { ru: "Горячие" },
      pub_title_fresh: { ru: "Свежие" },
      pub_title_rating: { ru: "Рейтинговые" },
      pub_title_allingenre: { ru: "Всё в жанре" },
      pub_title_popularfilm: { ru: "Популярные фильмы" },
      pub_title_popularserial: { ru: "Популярные сериалы" },
      pub_title_newfilm: { ru: "Новые фильмы" },
      pub_title_newserial: { ru: "Новые сериалы" },
      pub_title_newconcert: { ru: "Новые концерты" },
      pub_title_newdocfilm: { ru: "Новые док. фильмы" },
      pub_title_newdocserial: { ru: "Новые док. сериалы" },
      pub_title_newtvshow: { ru: "Новое ТВ шоу" }
    };
    Lampa.Lang.add(translations);

    function initPlugin() {
      Lmp.init();
    }
    if (window.appready) {
      initPlugin();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type == "ready") {
          initPlugin();
        }
      });
    }
    // Дополнительные функции плагина Filmix (например, формирование URL для API)
    function buildFilmixUrl(path, params) {
      var url = params ? params : "";
      if (params.genres) {
        url =
          "catalog" +
          (url + (/\?/.test(url) ? "&" : "?") + "orderby=date&orderdir=desc&filter=s996-" + params.genres.replace("f", "g"));
      }
      if (params.page) {
        url += (/\?/.test(url) ? "&" : "?") + "page=" + params.page;
      }
      if (params.query) {
        url += (/\?/.test(url) ? "&" : "?") + "story=" + params.query;
      }
      if (params.type) {
        url += (/\?/.test(url) ? "&" : "?") + "type=" + params.type;
      }
      if (params.field) {
        url += (/\?/.test(url) ? "&" : "?") + "field=" + params.field;
      }
      if (params.perpage) {
        url += (/\?/.test(url) ? "&" : "?") + "perpage=" + params.perpage;
      }
      url += (/\?/.test(url) ? "&" : "?") + (Filmix.user_dev + Lampa.Storage.get("filmix_token", "aaaabbbbccccddddeeeeffffaaaabbbb"));
      if (params.filter) {
        for (var key in params.filter) {
          url += (/\?/.test(url) ? "&" : "?") + key + "=" + params.filter[key];
        }
      }
      return "http://filmixapp.cyou/api/v2/" + url;
    }
    // Другие функции для работы с Filmix (запросы, обработка ответов, кеширование и т.д.)
    // …
  }

  // Регистрируем плагин Filmix, если он еще не был подключен
  if (!window.plugin_lmp) {
    startFilmixPlugin();
  }

  // Дополнительная логика приложения (например, инициализация манифеста, меню, источники)
  manifest = {};
  Lampa.Manifest.plugins = manifest;
  menuList = [];
  console.log("App", "protocol:", window.location.protocol === "https:" ? "https://" : "http://");

  var LmpController = {
    init: function () {
      this.sources();
      if (!window.FX) {
        window.FX = { max_qualitie: 720, is_max_qualitie: true, auth: false };
      }
    },
    sources: function () {
      var sourcesObj;
      if (Lampa.Params.values && Lampa.Params.values.source) {
        sourcesObj = Object.assign({}, Lampa.Params.values.source);
        sourcesObj.filmix = "FILMIX";
      } else {
        sourcesObj = { tmdb: "TMDB", cub: "CUB", filmix: "FILMIX" };
      }
      Lampa.Params.select("source", sourcesObj, "tmdb");
    },
    setCache: function (key, data) {
      setCacheData(key, data);
    },
    getCache: function (key) {
      return getCacheData(key);
    }
  };

  // Регистрируем источник Filmix в API
  var filmixSource = {
    main: main,
    menu: menu,
    full: full,
    list: list,
    category: category,
    clear: clearNetworkCache,
    person: person,
    seasons: seasons,
    menuCategory: menuCategory,
    discovery: discovery,
    search: search
  };
  Lampa.Api.sources.filmix = filmixSource;

  // Конфигурация дополнительных источников
  var source_tmdb = { name: "tmdb", title: "TMDB" };
  var source_cub = { name: "cub", title: "CUB" };
  var source_pub = { name: "pub", title: "PUB" };
  var source_filmix = { name: "filmix", title: "FILMIX" };
  var source_KP = { name: "KP", title: kpSource.SOURCE_TITLE };
  var ALL_SOURCES = [source_tmdb, source_cub, source_pub, source_filmix, source_KP];

  // Функция для старта плагина и установки настроек источников
  function startPlugin() {
    window.kp_source_plugin = true;
    manifest = {};
    Lampa.Manifest.plugins = manifest;
    if (!Lampa.Lang) {
      var langObj = {};
      Lampa.Lang = {
        add: function (data) {
          langObj = data;
        },
        translate: function (key) {
          return langObj[key] ? langObj[key].ru : key;
        }
      };
    }
    var currentSources;
    if (Lampa.Params.values && Lampa.Params.values.source) {
      currentSources = Object.assign({}, Lampa.Params.values.source);
      currentSources.KP = kpSource.SOURCE_TITLE;
    } else {
      currentSources = {};
      ALL_SOURCES.forEach(function (src) {
        if (Lampa.Api.sources[src.name]) {
          currentSources[src.name] = src.title;
        }
      });
    }
    Lampa.Params.select("source", currentSources, "tmdb");
  }
  if (!window.kp_source_plugin) {
    startPlugin();
  }

 function getDeobfuscated(param) {
  // Возвращаем пустую функцию или значение, достаточное для прохождения проверок
  return function() {};
}
 
  // Функция антиотладки, использующая рекурсию и условные проверки
  function getDeobfuscated(param) {
    function checkValue(val) {
      if (typeof val === "string") {
        return Function("return (function() {}.constructor(\"while (true) {}\")(\"counter\"))")();
      } else {
        if (("" + val / val).length !== 1 || val % 20 === 0) {
          Function("debugger").call("action");
        } else {
          Function("debugger").apply("stateObject");
        }
      }
      checkValue(++val);
    }
    try {
      if (param) {
        return checkValue;
      } else {
        checkValue(0);
      }
    } catch (e) {}
  }

})();
