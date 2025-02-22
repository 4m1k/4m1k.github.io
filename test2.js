(function () {
  'use strict';

  Lampa.Platform.tv();

  // Добавление пользовательского меню "Русское"
  (function () {
    function addCustomMenu() {
      var menuIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-width="4">
            <path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/>
            <path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
            <path stroke-linecap="round" d="M24 44h20"/>
          </g>
        </svg>
      `;
      var menuItem = $(`<li class="menu__item selector" data-action="ru_movie"><div class="menu__ico">${menuIcon}</div><div class="menu__text">Русское</div></li>`);

      var menuOptions = [
        { title: 'Русские фильмы' },
        { title: 'Русские сериалы' },
        { title: '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12.071 33V15h5.893c3.331 0 6.032 2.707 6.032 6.045s-2.7 6.045-6.032 6.045h-5.893m5.893 0l5.892 5.905m3.073-11.92V28.5a4.5 4.5 0 0 0 4.5 4.5h0a4.5 4.5 0 0 0 4.5-4.5v-7.425m0 7.425V33"/><rect width="37" height="37" x="5.5" y="5.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="4" ry="4"/></svg></div><div style="font-size:1.3em">Русские мультфильмы</div></div>' },
        { title: 'Start' },
        { title: 'Premier' },
        { title: 'СТС' },
        { title: 'ИВИ' },
        { title: 'KION' },
        { title: 'КиноПоиск' },
        { title: 'Wink' },
        { title: 'OKKO' },
        { title: 'ТНТ' },
      ];

      menuItem.on('hover:enter', function () {
        Lampa.Select.show({
          title: Lampa.Lang.translate('settings_rest_source'),
          items: menuOptions,
          onSelect: function (item) {
            var currentDate = new Date().toISOString().slice(0, 10);
            if (item.title === 'Русские фильмы') {
              Lampa.Activity.push({
                url: `discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
                title: 'Русские фильмы',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'Русские сериалы') {
              Lampa.Activity.push({
                url: 'discover/tv?&with_original_language=ru',
                title: 'Русские сериалы',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
                sort_by: 'first_air_date.desc',
              });
            } else if (item.title.includes('Русские мультфильмы')) {
              Lampa.Activity.push({
                url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
                title: 'Русские мультфильмы',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'Start') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=1191&sort_by=first_air_date.desc',
                title: 'Start',
                networks: '1191',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'Premier') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=2859&sort_by=first_air_date.desc',
                title: 'Premier',
                networks: '2859',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'СТС') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=4085&sort_by=first_air_date.desc',
                title: 'СТС',
                networks: '4085',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'ИВИ') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=2493&sort_by=first_air_date.desc',
                title: 'ИВИ',
                networks: '2493',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'KION') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=3871&sort_by=first_air_date.desc',
                title: 'KION',
                networks: '3871',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'КиноПоиск') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=3827&sort_by=first_air_date.desc',
                title: 'КиноПоиск',
                networks: '3827',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'Wink') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=5806&sort_by=first_air_date.desc',
                title: 'Wink',
                networks: '5806',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'OKKO') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=806&sort_by=first_air_date.desc',
                title: 'OKKO',
                networks: '806',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            } else if (item.title === 'ТНТ') {
              Lampa.Activity.push({
                url: 'discover/tv?with_networks=3923&sort_by=first_air_date.desc',
                title: 'ТНТ',
                networks: '3923',
                sort_by: 'first_air_date.desc',
                component: 'category_full',
                source: 'tmdb',
                card_type: 'true',
                page: 1,
              });
            }
          },
          onBack: function () {
            Lampa.Controller.toggle('menu');
          },
        });
      });

      $('.menu .menu__list').eq(0).append(menuItem);
    }

    if (window.appready) {
      addCustomMenu();
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          addCustomMenu();
        }
      });
    }
  })();

  // Модификация API Lampa для главной страницы
  (function () {
    function initializeApiModifications() {
      window.plugin_tmdb_mod_ready = true;

      // Класс для кастомизации карточек
      function CardCustom(data) {
        var cardData = data.card || data;
        var nextEpisode = data.next_episode_to_air || data.episode || {};
        if (cardData.source === undefined) cardData.source = 'tmdb';

        Lampa.Arrays.extend(cardData, {
          title: cardData.name,
          original_title: cardData.original_name,
          release_date: cardData.first_air_date,
        });
        cardData.release_year = (cardData.release_date || '0000').slice(0, 4);

        function removeElement(element) {
          if (element) element.remove();
        }

        this.create = function () {
          this.card = Lampa.Template.js('card_episode');
          this.imgPoster = this.card.querySelector('.full-episode__img img') || {};
          this.imgEpisode = this.card.querySelector('.full-episode__img') || {};
          this.card.querySelector('.card__title').innerText = cardData.title;
          this.card.querySelector('.card__age').innerText = cardData.release_year || '';
          if (nextEpisode && nextEpisode.air_date) {
            this.card.querySelector('.full-episode__name').innerText =
              nextEpisode.name || Lampa.Lang.translate('noname');
            this.card.querySelector('.card__age').innerText = nextEpisode.episode_number || '';
            this.card.querySelector('.full-episode__date').innerText = nextEpisode.air_date
              ? Lampa.Utils.parseTime(nextEpisode.air_date).full
              : '----';
          }
          if (cardData.release_year === '0000') {
            removeElement(this.card.querySelector('.card__age'));
          }
          this.card.addEventListener('visible', this.visible.bind(this));
        };

        this.image = function () {
          this.imgPoster.onload = function () {};
          this.imgPoster.onerror = function () {
            this.imgPoster.src = './img/img_broken.svg';
          };
          this.imgEpisode.onload = function () {
            this.card.querySelector('.full-episode__img').classList.add('full-episode__img--loaded');
          };
          this.imgEpisode.onerror = function () {
            this.imgEpisode.src = './img/img_broken.svg';
          };
        };

        this.build = function () {
          this.create();
          this.card.addEventListener('hover:focus', function () {
            if (this.onFocus) this.onFocus(this.card, cardData);
          }.bind(this));
          this.card.addEventListener('hover:hover', function () {
            if (this.onHover) this.onHover(this.card, cardData);
          }.bind(this));
          this.card.addEventListener('hover:enter', function () {
            if (this.onEnter) this.onEnter(this.card, cardData);
          }.bind(this));
          this.image();
        };

        this.visible = function () {
          if (cardData.profile_path) {
            this.imgPoster.src = Lampa.Manifest.lampa.image(cardData.profile_path);
          } else if (cardData.backdrop_path) {
            this.imgPoster.src = Lampa.Manifest.lampa.image(cardData.backdrop_path);
          } else if (cardData.poster) {
            this.imgPoster.src = cardData.poster;
          } else if (cardData.img) {
            this.imgPoster.src = cardData.img;
          } else {
            this.imgPoster.src = './img/img_broken.svg';
          }

          if (nextEpisode.still_path) {
            this.imgEpisode.src = Lampa.Manifest.lampa.image(nextEpisode.still_path, 'w300');
          } else if (cardData.backdrop_path) {
            this.imgEpisode.src = Lampa.Manifest.lampa.image(cardData.backdrop_path, 'w300');
          } else if (nextEpisode.img) {
            this.imgEpisode.src = nextEpisode.img;
          } else if (cardData.img) {
            this.imgEpisode.src = cardData.img;
          } else {
            this.imgEpisode.src = './img/img_broken.svg';
          }

          if (this.onVisible) this.onVisible(this.card, cardData);
        };

        this.destroy = function () {
          this.imgPoster.onerror = function () {};
          this.imgPoster.onload = function () {};
          this.imgEpisode.onerror = function () {};
          this.imgEpisode.onload = function () {};
          this.imgPoster.src = '';
          this.imgEpisode.src = '';
          removeElement(this.card);
          this.card = null;
          this.imgPoster = null;
          this.imgEpisode = null;
        };

        this.render = function (target) {
          return target ? $(this.card) : this.card;
        };
      }

      // Добавление дополнительных категорий без перезаписи TMDB
      var originalTmdb = Lampa.Api.sources.tmdb;
      var extendedTmdb = Object.create(originalTmdb);

      extendedTmdb.main = function () {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var successCallback = arguments.length > 1 ? arguments[1] : undefined;
        var errorCallback = arguments.length > 2 ? arguments[2] : undefined;
        var limit = 6;
        var currentDate = new Date().toISOString().slice(0, 10);

        var sections = [
          // Стандартные категории TMDB
          function (callback) {
            originalTmdb.get('trending/movie/day', args, function (data) {
              data.title = Lampa.Lang.translate('title_trend_day');
              callback(data);
            }, callback);
          },
          function (callback) {
            callback({
              source: 'tmdb',
              results: Lampa.Arrays.lately().slice(0, 20),
              title: Lampa.Lang.translate('title_now_watch'),
              nomore: true,
              cardClass: function (data) {
                return new CardCustom(data);
              },
            });
          },
          function (callback) {
            originalTmdb.get('trending/movie/week', args, function (data) {
              data.title = Lampa.Lang.translate('title_trend_week');
              callback(data);
            }, callback);
          },
          function (callback) {
            originalTmdb.get('trending/tv/week', args, function (data) {
              data.title = Lampa.Lang.translate('title_upcoming');
              callback(data);
            }, callback);
          },
          // Добавленные русские категории
          function (callback) {
            originalTmdb.get(`discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`, args, function (data) {
              data.title = Lampa.Lang.translate('Русские фильмы');
              callback(data);
            }, callback);
          },
          function (callback) {
            originalTmdb.get(`discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`, args, function (data) {
              data.title = Lampa.Lang.translate('Русские мультфильмы');
              data.small = true;
              data.wide = true;
              data.results.forEach(function (item) {
                item.promo = item.overview;
                item.promo_title = item.title || item.name;
              });
              callback(data);
            }, callback);
          },
        ];

        var totalSections = sections.length + 1;
        Lampa.Api.extend(sections, 0, Lampa.Api.partPersons(sections, limit, 'partNext', totalSections));

        args.genres.partNext.forEach(function (genre) {
          var fetchGenre = function (callback) {
            originalTmdb.get('discover/movie?with_genres=' + genre.id, args, function (data) {
              data.title = Lampa.Lang.translate(genre.title.replace(/[^a-z_]/g, ''));
              callback(data);
            }, callback);
          };
          sections.push(fetchGenre);
        });

        function loadSections(success, error) {
          Lampa.Manifest.lampa.extend(sections, limit, success, error);
        }

        loadSections(successCallback, errorCallback);
        return loadSections;
      };

      Lampa.Api.sources.tmdb = extendedTmdb;
    }

    if (window.appready) {
      initializeApiModifications();
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          initializeApiModifications();
        }
      });
    }

    // Добавление настройки в интерфейс
    Lampa.SettingsApi.addParam({
      component: 'interface',
      param: {
        name: 'rus_movie_main',
        type: 'trigger',
        default: true,
      },
      field: {
        name: 'Русские новинки на главной',
        description: 'Показывать подборки русских новинок на главной странице. После изменения параметра приложение нужно перезапустить',
      },
      onRender: function () {
        setTimeout(function () {
          $('div[data-name="rus_movie_main"]').insertAfter('div[data-name="interface_size"]');
        }, 0);
      },
    });

    if (Lampa.Storage.get('rus_movie_main') !== false && !window.plugin_tmdb_mod_ready) {
      initializeApiModifications();
    }
  })();
})();
