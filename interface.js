(function () {
    'use strict';

    // Проверка, что платформа — телевизор
    Lampa.Platform.tv();

    // Класс для отображения информации о фильме/сериале
    function InfoCard(data) {
        let card, request, cache = {};
        let timeout;

        // Инициализация DOM-элемента
        this.create = function () {
            card = $('<div class="new-interface-info">\n' +
                     '    <div class="new-interface-info__body">\n' +
                     '        <div class="new-interface-info__head"></div>\n' +
                     '        <div class="new-interface-info__title"></div>\n' +
                     '        <div class="new-interface-info__details"></div>\n' +
                     '        <div class="new-interface-info__description"></div>\n' +
                     '    </div>\n' +
                     '</div>');
        };

        // Обновление информации о фильме/сериале
        this.update = function (movieData) {
            card.find('.new-interface-info__title').html('');

            // Проверка настройки отображения логотипа
            if (Lampa.Storage.get('logo_card_style') !== true) {
                let type = movieData.name ? 'tv' : 'movie';
                let apiKey = Lampa.TMDB.key();
                let url = Lampa.TMDB.api(type + '/' + movieData.id + '/images?api_key=' + apiKey + '&language=' + Lampa.Storage.get('language'));

                $.get(url, function (response) {
                    if (response.logos && response.logos[0]) {
                        let logo = response.logos[0].file_path;
                        if (logo !== '') {
                            if (Lampa.Storage.get('desc') !== true) {
                                card.find('.new-interface-info__title').html(
                                    '<img style="margin-top:0.3em; margin-bottom:0.1em; max-height:1.8em; max-width:6.8em" src="' +
                                    Lampa.TMDB.image('t/p/w500' + logo.replace('.svg', '.png')) + '" />'
                                );
                            } else {
                                card.find('.new-interface-info__title').html(
                                    '<img style="margin-top:0.3em; margin-bottom:0.1em; max-height:2.8em; max-width:6.8em" src="' +
                                    Lampa.TMDB.image('t/p/w500' + logo.replace('.svg', '.png')) + '" />'
                                );
                            }
                        } else {
                            card.find('.new-interface-info__title').html(movieData.title);
                        }
                    } else {
                        card.find('.new-interface-info__title').html(movieData.title);
                    }
                });
            } else {
                card.find('.new-interface-info__title').html(movieData.title);
            }

            // Отображение описания
            if (Lampa.Storage.get('desc') !== true) {
                card.find('.new-interface-info__description').html(movieData.overview || Lampa.Lang.translate('full_notext'));
            }

            // Загрузка фона
            Lampa.Layer.update(Lampa.Api.img(movieData.backdrop_path, 'w200'));

            // Отрисовка деталей
            this.draw(movieData);
        };

        // Формирование деталей (год, рейтинг, жанры, страны, время, сезоны, эпизоды, статус)
        this.draw = function (movieData) {
            let year = ((movieData.release_date || movieData.first_air_date || '0000') + '').slice(0, 4);
            let rating = parseFloat((movieData.vote_average || 0) + '').toFixed(1);
            let details = [];
            let head = [];

            let genres = Lampa.Api.genres.tmdb.genres(movieData);
            let countries = Lampa.Api.genres.tmdb.parseCountries(movieData);

            if (year !== '0000') {
                head.push('<span class="full-start__pg" style="font-size: 0.9em;">' + year + '</span>');
            }

            if (countries.length > 0) {
                head.push(countries.join(', '));
            }

            if (Lampa.Storage.get('rat') !== true && rating > 0) {
                details.push('<div class="full-start__rate"><div>' + rating + '</div><div>TMDB</div></div>');
            }

            if (Lampa.Storage.get('ganr') !== true && movieData.genres && movieData.genres.length > 0) {
                details.push(movieData.genres.map(function (genre) {
                    return Lampa.Lang.capitalizeFirstLetter(genre.name);
                }).join('<span class="new-interface-info__split">&#9679;</span>'));
            }

            if (Lampa.Storage.get('vremya') !== true && movieData.runtime) {
                details.push(Lampa.Lang.secondsToTime(movieData.runtime * 60, true));
            }

            if (Lampa.Storage.get('seas') !== true && movieData.number_of_seasons) {
                details.push('<span class="full-start__pg" style="font-size: 0.9em;">Сезонов ' + movieData.number_of_seasons + '</span>');
            }

            if (Lampa.Storage.get('eps') !== true && movieData.number_of_episodes) {
                details.push('<span class="full-start__pg" style="font-size: 0.9em;">Эпизодов ' + movieData.number_of_episodes + '</span>');
            }

            if (Lampa.Storage.get('year_ogr') !== true && countries) {
                details.push('<span class="full-start__status" style="font-size: 0.9em;">' + countries + '</span>');
            }

            if (Lampa.Storage.get('status') !== true && movieData.status) {
                let statusText = '';
                switch (movieData.status.toLowerCase()) {
                    case 'released':
                        statusText = 'Выпущенный';
                        break;
                    case 'ended':
                        statusText = 'Закончен';
                        break;
                    case 'returning series':
                        statusText = 'Онгоинг';
                        break;
                    case 'in production':
                        statusText = 'В производстве';
                        break;
                    case 'post production':
                        statusText = 'Скоро';
                        break;
                    case 'planned':
                        statusText = 'Запланировано';
                        break;
                    case 'canceled':
                        statusText = 'Отменено';
                        break;
                    default:
                        statusText = movieData.status;
                        break;
                }
                if (statusText) {
                    details.push('<span class="full-start__status" style="font-size: 0.9em;">' + statusText + '</span>');
                }
            }

            card.find('.new-interface-info__head').html(head.join(', '));
            card.find('.new-interface-info__details').html(details.join('<span class="new-interface-info__split">&#9679;</span>'));
        };

        // Загрузка дополнительной информации через TMDB
        this.loadNext = function (movieData) {
            let self = this;
            clearTimeout(timeout);

            let url = Lampa.TMDB.api((movieData.name ? 'tv' : 'movie') + '/' + movieData.id +
                '/images?api_key=' + Lampa.TMDB.key() + '&append_to_response=content_ratings,release_dates&language=' +
                Lampa.Storage.get('language'));

            if (cache[url]) {
                return this.draw(cache[url]);
            }

            timeout = setTimeout(function () {
                request.clear();
                request.timeout(5000);
                request.silent(url, function (response) {
                    cache[url] = response;
                    self.draw(response);
                });
            }, 300);
        };

        // Возвращение DOM-элемента
        this.render = function () {
            return card;
        };

        // Очистка
        this.destroy = function () {
            card.remove();
            cache = {};
            card = null;
        };
    }

    // Класс для отображения списка карточек
    function CardList(data) {
        let request = new Lampa.Reguest();
        let scroll = new Lampa.Scroll({ mask: true, over: true, scroll_by_item: true });
        let items = [];
        let container = $('<div class="new-interface"><img class="full-start__background"></div>');
        let index = 0;
        let isNewVersion = Lampa.Manifest.app_digital >= 166;
        let currentItems, infoCard;
        let useWidePosters = Lampa.Storage.field('card_views_type') == 'wide_post' ||
                             Lampa.Storage.field('wide_post') == 'true';
        let background = container.find('.full-start__background');
        let currentBackground = '';
        let backgroundTimeout;

        this.create = function () {};

        this.start = function () {
            if (data.source == 'tmdb') {
                let button = $('<div class="empty__footer"><div class="simple-button selector">' +
                               Lampa.Lang.translate('empty') + '</div></div>');
                button.find('.selector').on('hover:enter', function () {
                    Lampa.Storage.set('source', 'cub');
                    Lampa.Background.replace({ source: 'cub' });
                });

                let info = new Lampa.InteractionLine();
                container.append(info.render(button));
                this.activity.listener.follow('ready', function () {});
                this.activity.stop();
            }
        };

        this.loadNext = function () {
            if (this.next && !this.next_wait && items.length) {
                this.next_wait = true;
                this.next(function (results) {
                    this.next_wait = false;
                    results.forEach(this.append.bind(this));
                    Lampa.Layer.visible(items[index + 1].render(true));
                }.bind(this), function () {
                    this.next_wait = false;
                });
            }
        };

        this.append = function (item) {
            if (item.ready) return;
            item.ready = true;

            let card = new Lampa.InteractionLine(item, {
                url: item.url,
                card_small: true,
                cardClass: item.cardClass,
                genres: data.genres,
                object: data,
                card_wide: Lampa.Storage.field('wide_post'),
                nomore: item.nomore
            });

            card.create();
            card.onBack = this.onBack.bind(this);
            card.onUp = this.up.bind(this);
            card.onDown = this.down.bind(this);
            card.onToggle = function () {
                index = items.indexOf(card);
            };
            if (this.onMore) card.onMore = this.onMore.bind(this);
            card.onFocus = function (itemData) {
                infoCard.update(itemData);
                this.background(itemData);
            }.bind(this);
            card.onHover = function (itemData) {
                infoCard.update(itemData);
                this.background(itemData);
            }.bind(this);
            card.onEnd = infoCard.render.bind(infoCard);

            scroll.append(card.render());
            items.push(card);
        };

        this.onFocusMore = function () {};

        this.onBack = function () {
            Lampa.Activity.backward();
        };

        this.down = function () {
            index++;
            index = Math.min(index, items.length - 1);
            if (!useWidePosters) {
                currentItems.slice(0, index + 2).forEach(this.append.bind(this));
            }
            items[index].toggle();
            scroll.update(items[index].render());
        };

        this.up = function () {
            index--;
            if (index < 0) {
                index = 0;
                Lampa.Controller.toggle('head');
            } else {
                items[index].toggle();
                scroll.update(items[index].render());
            }
        };

        this.background = function (itemData) {
            let imageUrl = Lampa.Api.img(itemData.backdrop_path, 'w1280');
            clearTimeout(backgroundTimeout);

            if (imageUrl == currentBackground) return;

            backgroundTimeout = setTimeout(function () {
                background.removeClass('loaded');
                background[0].onload = function () {
                    background.addClass('loaded');
                };
                background[0].onerror = function () {
                    background.removeClass('loaded');
                };
                currentBackground = imageUrl;
                setTimeout(function () {
                    background[0].src = currentBackground;
                }, 50);
            }, 100);
        };

        this.append = function (itemData) {
            currentItems = itemData;
            infoCard = new InfoCard(data);
            infoCard.create();
            scroll.minus(infoCard.render());
            itemData.slice(0, useWidePosters ? itemData.length : 2).forEach(this.append.bind(this));
            container.append(infoCard.render());
            container.append(scroll.render());

            if (isNewVersion) {
                Lampa.Layer.update(container);
                Lampa.Layer.visible(scroll.render(true));
                scroll.onWheel = this.loadNext.bind(this);
                scroll.onFocusMore = function (direction) {
                    if (!Lampa.Layer.enabled(this)) this.start();
                    if (direction > 0) this.down();
                    else if (index > 0) this.up();
                }.bind(this);
            }

            this.activity.listener.follow('ready', function () {});
            this.activity.stop();
        };

        this.render = function () {
            return container;
        };

        this.destroy = function () {
            request.clear();
            Lampa.Arrays.remove(items);
            scroll.destroy();
            if (infoCard) infoCard.destroy();
            container.remove();
            items = null;
            request = null;
            currentItems = null;
        };
    }

    // Переопределение InteractionMain
    window.plugin_interface_ready = true;
    let OriginalInteractionMain = Lampa.InteractionMain;

    Lampa.InteractionMain = function (data) {
        let InteractionClass = CardList;
        if (window.innerWidth < 767) InteractionClass = OriginalInteractionMain;
        if (Lampa.Manifest.app_digital < 153) InteractionClass = OriginalInteractionMain;
        if (Lampa.Platform.screen('mobile')) InteractionClass = OriginalInteractionMain;
        if (data.title === 'Избранное') InteractionClass = OriginalInteractionMain;
        return new InteractionClass(data);
    };

    // Добавление стилей
    if (Lampa.Storage.get('wide_post') == true) {
        Lampa.Template.add('new_interface_style', `
            <style>
                .new-interface .card--small.card--wide {
                    width: 18.3em;
                }
                .new-interface-info {
                    position: relative;
                    padding: 1.5em;
                    height: 26em;
                }
                .new-interface-info__body {
                    width: 80%;
                    padding-top: 1.1em;
                }
                .new-interface-info__head {
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 1em;
                    font-size: 1.3em;
                    min-height: 1em;
                }
                .new-interface-info__head span {
                    color: #fff;
                }
                .new-interface-info__title {
                    font-size: 4em;
                    font-weight: 600;
                    margin-bottom: 0.3em;
                    overflow: hidden;
                    -o-text-overflow: ".";
                    text-overflow: ".";
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    margin-left: -0.03em;
                    line-height: 1.3;
                }
                .new-interface-info__details {
                    margin-bottom: 1.6em;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: -moz-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -webkit-align-items: center;
                    -moz-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -webkit-flex-wrap: wrap;
                    -ms-flex-wrap: wrap;
                    flex-wrap: wrap;
                    min-height: 1.9em;
                    font-size: 1.3em;
                }
                .new-interface-info__split {
                    margin: 0 1em;
                    font-size: 0.7em;
                }
                .new-interface-info__description {
                    font-size: 1.4em;
                    font-weight: 310;
                    line-height: 1.3;
                    overflow: hidden;
                    -o-text-overflow: ".";
                    text-overflow: ".";
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                    width: 65%;
                }
                .new-interface .card-more__box {
                    padding-bottom: 95%;
                }
                .new-interface .full-start__background {
                    height: 108%;
                    top: -5em;
                }
                .new-interface .full-start__rate {
                    font-size: 1.3em;
                    margin-right: 0;
                }
                .new-interface .card__promo {
                    display: none;
                }
                .new-interface .card.card--wide+.card-more .card-more__box {
                    padding-bottom: 95%;
                }
                .new-interface .card.card--wide .card-watched {
                    display: none !important;
                }
                body.light--version .new-interface-info__body {
                    width: 69%;
                    padding-top: 1.5em;
                }
                body.light--version .new-interface-info {
                    height: 25.3em;
                }
                body.advanced--animation:not(.no--animation) .new-interface .card--small.card--wide.focus .card__view {
                    animation: animation-card-focus 0.2s;
                }
                body.advanced--animation:not(.no--animation) .new-interface .card--small.card--wide.animate-trigger-enter .card__view {
                    animation: animation-trigger-enter 0.2s forwards;
                }
            </style>
        `);
        $('body').append(Lampa.Template.get('new_interface_style', {}, true));
    } else {
        Lampa.Template.add('new_interface_style', `
            <style>
                .new-interface .card--small.card--wide {
                    width: 18.3em;
                }
                .new-interface-info {
                    position: relative;
                    padding: 1.5em;
                    height: 20.4em;
                }
                .new-interface-info__body {
                    width: 80%;
                    padding-top: 0.2em;
                }
                .new-interface-info__head {
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 0.3em;
                    font-size: 1.3em;
                    min-height: 1em;
                }
                .new-interface-info__head span {
                    color: #fff;
                }
                .new-interface-info__title {
                    font-size: 4em;
                    font-weight: 600;
                    margin-bottom: 0.2em;
                    overflow: hidden;
                    -o-text-overflow: ".";
                    text-overflow: ".";
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    margin-left: -0.03em;
                    line-height: 1.3;
                }
                .new-interface-info__details {
                    margin-bottom: 1.6em;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: -moz-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -webkit-align-items: center;
                    -moz-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -webkit-flex-wrap: wrap;
                    -ms-flex-wrap: wrap;
                    flex-wrap: wrap;
                    min-height: 1.9em;
                    font-size: 1.3em;
                }
                .new-interface-info__split {
                    margin: 0 1em;
                    font-size: 0.7em;
                }
                .new-interface-info__description {
                    font-size: 1.4em;
                    font-weight: 310;
                    line-height: 1.3;
                    overflow: hidden;
                    -o-text-overflow: ".";
                    text-overflow: ".";
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    width: 70%;
                }
                .new-interface .card-more__box {
                    padding-bottom: 150%;
                }
                .new-interface .full-start__background {
                    height: 108%;
                    top: -5em;
                }
                .new-interface .full-start__rate {
                    font-size: 1.3em;
                    margin-right: 0;
                }
                .new-interface .card__promo {
                    display: none;
                }
                .new-interface .card.card--wide+.card-more .card-more__box {
                    padding-bottom: 95%;
                }
                .new-interface .card.card--wide .card-watched {
                    display: none !important;
                }
                body.light--version .new-interface-info__body {
                    width: 69%;
                    padding-top: 1.5em;
                }
                body.light--version .new-interface-info {
                    height: 25.3em;
                }
                body.advanced--animation:not(.no--animation) .new-interface .card--small.card--wide.focus .card__view {
                    animation: animation-card-focus 0.2s;
                }
                body.advanced--animation:not(.no--animation) .new-interface .card--small.card--wide.animate-trigger-enter .card__view {
                    animation: animation-trigger-enter 0.2s forwards;
                }
            </style>
        `);
        $('body').append(Lampa.Template.get('new_interface_style', {}, true));
    }

    // Добавление компонента в настройки
    Lampa.InteractionLine.listener.follow('open', function (event) {
        if (event.name == 'main') {
            if (Lampa.InteractionLine.main().render().find('[data-component="style_interface"]').length == 0) {
                Lampa.SettingsApi.addComponent({
                    component: 'style_interface',
                    name: 'Стильный интерфейс'
                });
            }
            Lampa.InteractionLine.main().update();
            Lampa.InteractionLine.main().render().find('[data-component="style_interface"]').addClass('hide');
        }
    });

    // Добавление параметров в настройки
    Lampa.SettingsApi.addComponent({
        component: 'style_interface',
        param: {
            name: 'style_interface',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Стильный интерфейс',
            description: 'Стильный интерфейс'
        },
        onRender: function (element) {
            setTimeout(function () {
                $('.settings-param > div:contains("Стильный интерфейс")').parent().insertAfter($('div[data-name="interface_size"]'));
            }, 20);
            element.on('hover:enter', function () {
                Lampa.InteractionLine.create('style_interface');
                Lampa.Controller.enabled().controller.onBack = function () {
                    Lampa.InteractionLine.create('style_interface');
                };
            });
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'wide_post',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Широкие постеры'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'desc',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Показывать описание'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'status',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Показывать статус фильма/сериала'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'seas',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Показывать количество сезонов'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'eps',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Показывать количество эпизодов'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'year_ogr',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Показывать возрастное ограничение'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'vremya',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Показывать время фильма'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'ganr',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Показывать жанр фильма'
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'style_interface',
        param: {
            name: 'rat',
            type: 'trigger',
            default: true
        },
        field: {
            name: 'Показывать рейтинг фильма'
        }
    });

    // Установка настроек по умолчанию
    function initializeSettings() {
        Lampa.Storage.set('int_plug', 'true');
        Lampa.Storage.set('wide_post', 'true');
        Lampa.Storage.set('desc', 'true');
        Lampa.Storage.set('status', 'true');
        Lampa.Storage.set('seas', 'false');
        Lampa.Storage.set('eps', 'false');
        Lampa.Storage.set('year_ogr', 'true');
        Lampa.Storage.set('vremya', 'true');
        Lampa.Storage.set('ganr', 'true');
        Lampa.Storage.set('rat', 'true');
    }

    // Запуск инициализации настроек
    let interval = setInterval(function () {
        if (typeof Lampa !== 'undefined') {
            clearInterval(interval);
            if (Lampa.Storage.get('int_plug', 'false') !== 'false') {
                initializeSettings();
            }
        }
    }, 200);
})();
