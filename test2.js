(function () {
  'use strict';

  Lampa.Platform.tv();

  // Константы для источников и селекторов
  var NEW_ITEM_SOURCES = ['tmdb', 'cub'];
  var ITEM_TV_SELECTOR = '[data-action="tv"]';
  var ITEM_MOVE_TIMEOUT = 2000;

  // Функция для перемещения элемента после указанного селектора с задержкой
  var moveItemAfter = function (item, after) {
    return setTimeout(function () {
      $(item).insertAfter($(after));
    }, ITEM_MOVE_TIMEOUT);
  };

  // Добавление пункта "Русское" в меню
  (function () {
    var NEW_ITEM_ATTR = 'data-action="ru_movie"';
    var NEW_ITEM_SELECTOR = `[${NEW_ITEM_ATTR}]`;
    var NEW_ITEM_TEXT = 'Русское';

    // Иконка для пункта меню
    var menuIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">
        <g fill="none" stroke="currentColor" stroke-width="4">
          <path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/>
          <path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
          <path stroke-linecap="round" d="M24 44h20"/>
        </g>
      </svg>
    `;

    // Создаем элемент меню
    var field = $(`
      <li class="menu__item selector" ${NEW_ITEM_ATTR}>
        <div class="menu__ico">${menuIcon}</div>
        <div class="menu__text">${NEW_ITEM_TEXT}</div>
      </li>
    `);

    // Опции подменю
    var menuOptions = [
      { title: 'Русские фильмы' },
      { title: 'Русские сериалы' },
      { title: 'Русские мультфильмы' },
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

    // Обработчик события hover:enter
    field.on('hover:enter', function () {
      console.log('Открытие подменю "Русское"');
      Lampa.Select.show({
        title: NEW_ITEM_TEXT,
        items: menuOptions,
        onSelect: function (item) {
          console.log('Выбран пункт:', item.title);
          var currentDate = new Date().toISOString().slice(0, 10);
          var source = NEW_ITEM_SOURCES.includes(Lampa.Activity.active().source)
            ? Lampa.Activity.active().source
            : NEW_ITEM_SOURCES[0];

          if (item.title === 'Русские фильмы') {
            Lampa.Activity.push({
              url: `discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'Русские сериалы') {
            Lampa.Activity.push({
              url: 'discover/tv?with_original_language=ru',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              source: source,
              card_type: true,
              sort_by: 'first_air_date.desc',
              page: 1,
            });
          } else if (item.title === 'Русские мультфильмы') {
            Lampa.Activity.push({
              url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'Start') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=1191&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '1191SORT_BYfirst_air_date.desc',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'Premier') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=2859&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '2859',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'СТС') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=4085&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '4085',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'ИВИ') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=2493&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '2493',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'KION') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=3871&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '3871',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'КиноПоиск') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=3827&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '3827',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'Wink') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=5806&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '5806',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'OKKO') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=806&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '806',
              source: source,
              card_type: true,
              page: 1,
            });
          } else if (item.title === 'ТНТ') {
            Lampa.Activity.push({
              url: 'discover/tv?with_networks=3923&sort_by=first_air_date.desc',
              title: `${item.title} - ${source.toUpperCase()}`,
              component: 'category_full',
              networks: '3923',
              source: source,
              card_type: true,
              page: 1,
            });
          }
        },
        onBack: function () {
          Lampa.Controller.toggle('menu');
        },
      });
    });

    // Добавляем пункт в меню после "TV"
    if (window.appready) {
      Lampa.Menu.render().find(ITEM_TV_SELECTOR).after(field);
      moveItemAfter(NEW_ITEM_SELECTOR, ITEM_TV_SELECTOR);
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          Lampa.Menu.render().find(ITEM_TV_SELECTOR).after(field);
          moveItemAfter(NEW_ITEM_SELECTOR, ITEM_TV_SELECTOR);
        }
      });
    }
  })();
})();
