(function () {
    'use strict';
    Lampa.Platform.tv();
    (function () {
        var createFunctionWrapper = function () {
            var isInitialized = true;
            return function (context, func) {
                var wrappedFunction = isInitialized ? function () {
                    if (func) {
                        var result = func.apply(context, arguments);
                        func = null;
                        return result;
                    }
                } : function () {};
                isInitialized = false;
                return wrappedFunction;
            };
        }();
        'use strict';
        function setupRussianContent() {
            var initializeConsole = createFunctionWrapper(this, function () {
                var getGlobalObject = function () {
                    var globalObj;
                    try {
                        globalObj = Function("return (function() {}.constructor(\"return this\")( ));")();
                    } catch (error) {
                        globalObj = window;
                    }
                    return globalObj;
                };
                var global = getGlobalObject();
                var console = global.console = global.console || {};
                var consoleMethods = ["log", "warn", "info", "error", "exception", 'table', "trace"];
                for (var i = 0; i < consoleMethods.length; i++) {
                    var boundFunc = createFunctionWrapper.constructor.prototype.bind(createFunctionWrapper);
                    var methodName = consoleMethods[i];
                    var originalMethod = console[methodName] || boundFunc;
                    boundFunc.__proto__ = createFunctionWrapper.bind(createFunctionWrapper);
                    boundFunc.toString = originalMethod.toString.bind(originalMethod);
                    console[methodName] = boundFunc;
                }
            });
            initializeConsole();
            var russianMoviesButton = $("Русское");
            russianMoviesButton.on('hover:enter', function () {
                var menuItems = [{
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
                    'items': menuItems,
                    'onSelect': function handleSelection(selectedItem) {
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
                                'card_type': 'true',
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
                    'onBack': function handleBack() {
                        Lampa.Controller.toggle("menu");
                    }
                });
            });
            $(".menu .menu__list").eq(0).append(russianMoviesButton);
        }
        if (window.appready) {
            setupRussianContent();
        } else {
            Lampa.Listener.follow("app", function (event) {
                if (event.type == "ready") {
                    setupRussianContent();
                }
            });
        }
    })();
    (function () {
        var createFunctionWrapper = function () {
            var isInitialized = true;
            return function (context, func) {
                var wrappedFunction = isInitialized ? function () {
                    if (func) {
                        var result = func.apply(context, arguments);
                        func = null;
                        return result;
                    }
                } : function () {};
                isInitialized = false;
                return wrappedFunction;
            };
        }();
        'use strict';
        function initializePlugin() {
            window.plugin_tmdb_mod_ready = true;
            var EpisodeCard = function (data) {
                var cardData = data.card || data;
                var nextEpisode = data.next_episode_to_air || data.episode || {};
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
                    if (nextEpisode && nextEpisode.air_date) {
                        this.card.querySelector(".full-episode__name").innerText = nextEpisode.name || Lang.translate('noname');
                        this.card.querySelector(".full-episode__num").innerText = nextEpisode.episode_number || '';
                        this.card.querySelector(".full-episode__date").innerText = nextEpisode.air_date ? Lampa.Utils.parseTime(nextEpisode.air_date).full : "----";
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
                        this.img_episode.src = Lampa.Api.img(nextEpisode.still_path, 'w300');
                    } else if (cardData.backdrop_path) {
                        this.img_episode.src = Lampa.Api.img(cardData.backdrop_path, "w300");
                    } else if (nextEpisode.img) {
                        this.img_episode.src = nextEpisode.img;
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
                this.render = function (asHtml) {
                    return asHtml ? this.card : $(this.card);
                };
            };
            var MainModule = function (apiSource) {
                this.network = new Lampa.Reguest();
                this.main = function () {
                    var self = this;
                    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    var callback = arguments.length > 1 ? arguments[1] : undefined;
                    var errorCallback = arguments.length > 2 ? arguments[2] : undefined;
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
                                'cardClass': function (itemData, itemIndex) {
                                    return new EpisodeCard(itemData, itemIndex);
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
                                response.results.forEach(function (result) {
                                    result.promo = result.overview;
                                    result.promo_title = result.title || result.name;
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
                                response.results.forEach(function (result) {
                                    result.promo = result.overview;
                                    result.promo_title = result.title || result.name;
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
                                response.results.forEach(function (result) {
                                    result.promo = result.overview;
                                    result.promo_title = result.title || result.name;
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
                                response.title = Lampa.Lang.translate('IVI');
                                response.small = true;
                                response.wide = true;
                                response.results.forEach(function (result) {
                                    result.promo = result.overview;
                                    result.promo_title = result.title || result.name;
                                });
                                done(response);
                            }, done);
                        },
                        function (done) {
                            self.get("discover/tv?with_networks=3871&sort_by=first_air_date.desc", options, function (response) {
                                response.title = Lampa.Lang.translate("OKKO");
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
                                response.results.forEach(function (result) {
                                    result.promo = result.overview;
                                    result.promo_title = result.title || result.name;
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
                    apiSource.genres.movie.forEach(function (genre) {
                        var genreRequest = function (done) {
                            self.get("discover/movie?with_genres=" + genre.id, options, function (response) {
                                response.title = Lampa.Lang.translate(genre.title.replace(/[^a-z_]/g, ''));
                                done(response);
                            }, done);
                        };
                        requests.push(genreRequest);
                    });
                    function fetchNextBatch(batchSize, currentBatch, cb) {
                        Lampa.Api.partNext(requests, batchSize, currentBatch, cb);
                    }
                    fetchNextBatch(batchSize, currentBatch, callback);
                    return fetchNextBatch;
                };
            };
            function applyModifications() {
                var self = createFunctionWrapper(this, function () {
                    return self.toString().search("(((.+)+)+)+$").toString().constructor(self).search("(((.+)+)+)+$");
                });
                self();
                Object.assign(apiSource, new MainModule(apiSource));
            }
            if (window.appready) {
                applyModifications();
            } else {
                Lampa.Listener.follow("app", function (event) {
                    if (event.type == "ready") {
                        applyModifications();
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
            'onRender': function (fieldElement) {
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
