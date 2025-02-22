(function () {
  'use strict';

  Lampa.Platform.tv();

  // Константы
  var ITEM_TV_SELECTOR = '[data-action="tv"]';
  var ITEM_MOVE_TIMEOUT = 2000;

  // Функция для перемещения элемента
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

    // Иконка для главного пункта меню (из первого файла)
    var menuIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">
        <g fill="none" stroke="currentColor" stroke-width="4">
          <path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/>
          <path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
          <path stroke-linecap="round" d="M24 44h20"/>
        </g>
      </svg>
    `;

    // Иконка для "Русские мультфильмы" (из первого файла)
    var cartoonIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12.071 33V15h5.893c3.331 0 6.032 2.707 6.032 6.045s-2.7 6.045-6.032 6.045h-5.893m5.893 0l5.892 5.905m3.073-11.92V28.5a4.5 4.5 0 0 0 4.5 4.5h0a4.5 4.5 0 0 0 4.5-4.5v-7.425m0 7.425V33"/>
        <rect width="37" height="37" x="5.5" y="5.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="4" ry="4"/>
      </svg>
    `;

    // Создаем элемент меню
    var field = $(`
      <li class="menu__item selector" ${NEW_ITEM_ATTR}>
        <div class="menu__ico">${menuIcon}</div>
        <div class="menu__text">${NEW_ITEM_TEXT}</div>
      </li>
    `);

    // Опции подменю с иконкой для "Русские мультфильмы"
    var menuOptions = [
      { title: 'Русские фильмы' },
      { title: 'Русские сериалы' },
      { 
        title: `<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em">${cartoonIcon}</div><div style="font-size:1.3em">Русские мультфильмы</div></div>` 
      },
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

          // Очистка HTML из title
          var cleanTitle = item.title.replace(/<[^>]+>/g, '').trim();
          console.log('Очищенный заголовок:', cleanTitle);

          if (cleanTitle === 'Русские фильмы') {
            Lampa.Activity.push({
              url: `discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
              title: 'Русские фильмы',
              component: 'category_full',
              source: 'tmdb',
              card_type: 'true',
              page: 1,
            });
          } else if (cleanTitle === 'Русские сериалы') {
            Lampa.Activity.push({
              url: 'discover/tv?&with_original_language=ru',
              title: 'Русские сериалы',
              component: 'category_full',
              source: 'tmdb',
              card_type: 'true',
              page: 1,
              sort_by: 'first_air_date.desc',
            });
          } else if (cleanTitle === 'Русские мультфильмы') {
            Lampa.Activity.push({
              url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
              title: 'Русские мультфильмы',
              component: 'category_full',
              source: 'tmdb',
              card_type: 'true',
              page: 1,
            });
          } else if (cleanTitle === 'Start') {
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
          } else if (cleanTitle === 'Premier') {
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
          } else if (cleanTitle === 'СТС') {
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
          } else if (cleanTitle === 'ИВИ') {
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
          } else if (cleanTitle === 'KION') {
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
          } else if (cleanTitle === 'КиноПоиск') {
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
          } else if (cleanTitle === 'Wink') {
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
          } else if (cleanTitle === 'OKKO') {
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
          } else if (cleanTitle === 'ТНТ') {
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
