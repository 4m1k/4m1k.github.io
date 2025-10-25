(function () {
    'use strict';

    // Проверка наличия Lampa
    if (typeof Lampa === 'undefined') {
        console.error('Lampa is not defined');
        return;
    }

    // Проверка, что платформа — телевизор
    Lampa.Platform.tv();

    // Класс для отображения информации о фильме/сериале
    function InfoCard(data) {
        let card, request, cache = {};
        let timeout;

        this.create = function () {
            console.log('InfoCard: Creating card');
            card = $('<div class="new-interface-info">\n' +
                     '    <div class="new-interface-info__body">\n' +
                     '        <div class="new-interface-info__head"></div>\n' +
                     '        <div class="new-interface-info__title"></div>\n' +
                     '        <div class="new-interface-info__details"></div>\n' +
                     '        <div class="new-interface-info__description"></div>\n' +
                     '    </div>\n' +
                     '</div>');
        };

        this.update = function (movieData) {
            console.log('InfoCard: Updating with data', movieData);
            card.find('.new-interface-info__head,.new-interface-info__details').text('---');
            card.find('.new-interface-info__title').text(movieData.title);
            card.find('.new-interface-info__description').text(movieData.overview || Lampa.Lang.translate('full_notext'));
            Lampa.Background.change(Lampa.Api.img(movieData.backdrop_path, 'w200'));
            this.draw(movieData);
        };

        this.draw = function (movieData) {
            console.log('InfoCard: Drawing details', movieData);
            let year = ((movieData.release_date || movieData.first_air_date || '0000') + '').slice(0, 4);
            let rating = parseFloat((movieData.vote_average || 0) + '').toFixed(1);
            let head = [];
            let details = [];
            let countries = Lampa.Api.sources.tmdb.parseCountries(movieData);
            let pg = Lampa.Api.sources.tmdb.parsePG(movieData);

            if (year !== '0000') head.push('<span>' + year + '</span>');
            if (countries.length > 0) head.push(countries.join(', '));
            if (rating > 0) details.push('<div class="full-start__rate"><div>' + rating + '</div><div>TMDB</div></div>');
            if (movieData.genres && movieData.genres.length > 0) {
                details.push(movieData.genres.map(function (item) {
                    return Lampa.Utils.capitalizeFirstLetter(item.name);
                }).join(' | '));
            }
            if (movieData.runtime) details.push(Lampa.Utils.secondsToTime(movieData.runtime * 60, true));
            if (pg) details.push('<span class="full-start__pg" style="font-size: 0.9em;">' + pg + '</span>');

            card.find('.new-interface-info__head').empty().append(head.join(', '));
            card.find('.new-interface-info__details').html(details.join('<span class="new-interface-info__split">&#9679;</span>'));
        };

        this.load = function (movieData) {
            let _this = this;
            clearTimeout(timeout);
            let url = Lampa.TMDB.api((movieData.name ? 'tv' : 'movie') + '/' + movieData.id +
                '?api_key=' + Lampa.TMDB.key() + '&append_to_response=content_ratings,release_dates&language=' +
                Lampa.Storage.get('language'));

            if (cache[url]) {
                console.log('InfoCard: Using cached data for', url);
                return this.draw(cache[url]);
            }

            timeout = setTimeout(function () {
                console.log('InfoCard: Loading data from', url);
                request.clear();
                request.timeout(5000);
                request.silent(url, function (response) {
                    cache[url] = response;
                    _this.draw(response);
                });
            }, 300);
        };

        this.render = function () {
            return card;
        };

        this.empty = function () {};

        this.destroy = function () {
            console.log('InfoCard: Destroying card');
            card.remove();
            cache = {};
            card = null;
        };
    }

    // Класс для отображения списка карточек
    function CardList(object) {
        let request = new Lampa.Reguest();
        let scroll = new Lampa.Scroll({ mask: true, over: true, scroll_by_item: true });
        let items = [];
        let html = $('<div class="new-interface"><img class="full-start__background"></div>');
        let active = 0;
        let newlampa = Lampa.Manifest.app_digital >= 166;
        let info;
        let lezydata;
        let viewall = Lampa.Storage.field('card_views_type') == 'view' || Lampa.Storage.field('navigation_type') == 'mouse';
        let background_img = html.find('.full-start__background');
        let background_last = '';
        let background_timer;

        this.create = function () {
            console.log('CardList: Creating');
        };

        this.empty = function () {
            console.log('CardList: Empty state');
            let button;
            if (object.source == 'tmdb') {
                button = $('<div class="empty__footer"><div class="simple-button selector">' +
                           Lampa.Lang.translate('change_source_on_cub') + '</div></div>');
                button.find('.selector').on('hover:enter', function () {
                    console.log('CardList: Changing source to cub');
                    Lampa.Storage.set('source', 'cub');
                    Lampa.Activity.replace({ source: 'cub' });
                });
            }
            let empty = new Lampa.Empty();
            html.append(empty.render(button));
            this.start = empty.start;
            this.activity.loader(false);
            this.activity.toggle();
        };

        this.loadNext = function () {
            let _this = this;
            if (this.next && !this.next_wait && items.length) {
                console.log('CardList: Loading next items');
                this.next_wait = true;
                this.next(function (new_data) {
                    _this.next_wait = false;
                    new_data.forEach(_this.append.bind(_this));
                    Lampa.Layer.visible(items[active + 1].render(true));
                }, function () {
                    _this.next_wait = false;
                });
            }
        };

        this.append = function (element) {
            let _this3 = this;
            if (element.ready) return;
            element.ready = true;

            console.log('CardList: Appending element', element);
            let item = new Lampa.InteractionLine(element, {
                url: element.url,
                card_small: true,
                cardClass: element.cardClass,
                genres: object.genres,
                object: object,
                card_wide: Lampa.Storage.field('navigation_type') == 'mouse',
                nomore: element.nomore
            });

            item.create();
            item.onDown = this.down.bind(this);
            item.onUp = this.up.bind(this);
            item.onBack = this.back.bind(this);
            item.onToggle = function () {
                active = items.indexOf(item);
            };
            if (this.onMore) item.onMore = this.onMore.bind(this);
            item.onFocus = function (elem) {
                console.log('CardList: Focusing on', elem);
                info.update(elem);
                _this3.background(elem);
            };
            item.onHover = function (elem) {
                console.log('CardList: Hovering on', elem);
                info.update(elem);
                _this3.background(elem);
            };
            item.onFocusMore = info.empty.bind(info);

            scroll.append(item.render());
            items.push(item);
        };

        this.back = function () {
            console.log('CardList: Navigating back');
            Lampa.Activity.backward();
        };

        this.down = function () {
            active++;
            active = Math.min(active, items.length - 1);
            if (!viewall) lezydata.slice(0, active + 2).forEach(this.append.bind(this));
            items[active].toggle();
            scroll.update(items[active].render());
        };

        this.up = function () {
            active--;
            if (active < 0) {
                active = 0;
                Lampa.Controller.toggle('head');
            } else {
                items[active].toggle();
                scroll.update(items[active].render());
            }
        };

        this.background = function (elem) {
            let new_background = Lampa.Api.img(elem.backdrop_path, 'w1280');
            clearTimeout(background_timer);
            if (new_background == background_last) return;

            console.log('CardList: Updating background', new_background);
            background_timer = setTimeout(function () {
                background_img.removeClass('loaded');
                background_img[0].onload = function () {
                    background_img.addClass('loaded');
                };
                background_img[0].onerror = function () {
                    background_img.removeClass('loaded');
                };
                background_last = new_background;
                setTimeout(function () {
                    background_img[0].src = background_last;
                }, 300);
            }, 1000);
        };

        this.build = function (data) {
            console.log('CardList: Building with data', data);
            lezydata = data;
            info = new InfoCard(object);
            info.create();
            scroll.minus(info.render());
            data.slice(0, viewall ? data.length : 2).forEach(this.append.bind(this));
            html.append(info.render());
            html.append(scroll.render());

            if (newlampa) {
                Lampa.Layer.update(html);
                Lampa.Layer.visible(scroll.render(true));
                scroll.onEnd = this.loadNext.bind(this);
                scroll.onWheel = function (step) {
                    if (!Lampa.Controller.own(this)) this.start();
                    if (step > 0) this.down();
                    else if (active > 0) this.up();
                }.bind(this);
            }

            this.activity.loader(false);
            this.activity.toggle();
        };

        this.start = function () {
            let _this4 = this;
            console.log('CardList: Starting');
            Lampa.Controller.add('content', {
                link: this,
                toggle: function () {
                    if (_this4.activity.canRefresh()) return false;
                    if (items.length) {
                        items[active].toggle();
                    }
                },
                update: function () {},
                left: function () {
                    if (Navigator.canmove('left')) Navigator.move('left');
                    else Lampa.Controller.toggle('menu');
                },
                right: function () {
                    Navigator.move('right');
                },
                up: function () {
                    if (Navigator.canmove('up')) Navigator.move('up');
                    else Lampa.Controller.toggle('head');
                },
                down: function () {
                    if (Navigator.canmove('down')) Navigator.move('down');
                },
                back: this.back
            });
            Lampa.Controller.toggle('content');
        };

        this.refresh = function () {
            this.activity.loader(true);
            this.activity.need_refresh = true;
        };

        this.pause = function () {};

        this.stop = function () {};

        this.render = function () {
            return html;
        };

        this.destroy = function () {
            console.log('CardList: Destroying');
            request.clear();
            Lampa.Arrays.destroy(items);
            scroll.destroy();
            if (info) info.destroy();
            html.remove();
            items = null;
            request = null;
            lezydata = null;
        };
    }

    // Инициализация плагина
    function startPlugin() {
        console.log('startPlugin: Initializing');
        window.plugin_interface_ready = true;
        let old_interface = Lampa.InteractionMain;
        let new_interface = CardList;

        Lampa.InteractionMain = function (object) {
            console.log('InteractionMain: Processing object', object);
            let use = new_interface;
            if (!(object.source == 'tmdb' || object.source == 'cub')) {
                console.log('InteractionMain: Using old interface - invalid source', object.source);
                use = old_interface;
            }
            if (window.innerWidth < 767) {
                console.log('InteractionMain: Using old interface - window.innerWidth < 767');
                use = old_interface;
            }
            if (Lampa.Manifest.app_digital < 153) {
                console.log('InteractionMain: Using old interface - app_digital < 153', Lampa.Manifest.app_digital);
                use = old_interface;
            }
            if (Lampa.Platform.screen('mobile')) {
                console.log('InteractionMain: Using old interface - mobile device');
                use = old_interface;
            }
            if (object.title === 'Избранное') {
                console.log('InteractionMain: Using old interface - title is Избранное');
                use = old_interface;
            }
            return new use(object);
        };

        Lampa.Template.add('new_interface_style', `
            <style>
                .new-interface .card--small.card--wide {
                    width: 18.3em;
                }
                .new-interface-info {
                    position: relative;
                    padding: 1.5em;
                    height: 24em;
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
                    font-size: 1.1em;
                }
                .new-interface-info__split {
                    margin: 0 1em;
                    font-size: 0.7em;
                }
                .new-interface-info__description {
                    font-size: 1.2em;
                    font-weight: 300;
                    line-height: 1.5;
                    overflow: hidden;
                    -o-text-overflow: ".";
                    text-overflow: ".";
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    line-clamp: 4;
                    -webkit-box-orient: vertical;
                    width: 70%;
                }
                .new-interface .card-more__box {
                    padding-bottom: 95%;
                }
                .new-interface .full-start__background {
                    height: 108%;
                    top: -6em;
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

        console.log('startPlugin: Styles added');
    }

    // Запуск плагина
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOMContentLoaded: Checking Lampa initialization');
        let interval = setInterval(function () {
            if (typeof Lampa !== 'undefined' && Lampa.InteractionLine && Lampa.InteractionLine.listener) {
                console.log('Lampa initialized, starting plugin');
                clearInterval(interval);
                if (!window.plugin_interface_ready) {
                    startPlugin();
                }
            } else {
                console.log('Waiting for Lampa to initialize...');
            }
        }, 200);
    });
})();
