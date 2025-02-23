(function () {
  'use strict';

  // Устанавливаем платформу для ТВ
  Lampa.Platform.tv();

  // Константы
  var ITEM_TV_SELECTOR = '[data-action="tv"]';
  var ITEM_MOVE_TIMEOUT = 2000;

  // Функция перемещения элемента
  var moveItemAfter = function (item, after) {
    return setTimeout(function () {
      $(item).insertAfter($(after));
    }, ITEM_MOVE_TIMEOUT);
  };

  // Добавляем новый пункт меню "Русское" с подменю для выбора нужного раздела
  (function () {
    var NEW_ITEM_ATTR = 'data-action="ru_movie"';
    var NEW_ITEM_SELECTOR = '[' + NEW_ITEM_ATTR + ']';
    var NEW_ITEM_TEXT = 'Русское';

    // Иконка для главного пункта меню
    var menuIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">
        <g fill="none" stroke="currentColor" stroke-width="4">
          <path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"/>
          <path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path stroke-linecap="round" d="M24 44h20"/>
        </g>
      </svg>
    `;

    // Создаем элемент пункта меню
    var field = $(`
      <li class="menu__item selector" ${NEW_ITEM_ATTR}>
        <div class="menu__ico">${menuIcon}</div>
        <div class="menu__text">${NEW_ITEM_TEXT}</div>
      </li>
    `);

    // Определяем опции подменю – только нужные разделы
    var menuOptions = [
      {
        title: `<div class="settings-folder" style="padding:0!important">
                    <div style="width:2.2em;height:1.7em;padding-right:.5em">
                      <!-- Иконка для "Русские фильмы" (пример) -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                              d="M12.071 33V15h5.893c3.331 0 6.032 2.707 6.032 6.045s-2.7 6.045-6.032 6.045h-5.893m5.893 0l5.892 5.905m3.073-11.92V28.5a4.5 4.5 0 0 0 4.5 4.5h0a4.5 4.5 0 0 0 4.5-4.5v-7.425"/>
                      </svg>
                    </div>
                    <div style="font-size:1.3em">Русские фильмы</div>
                 </div>`
      },
      {
        title: `<div class="settings-folder" style="padding:0!important">
                    <div style="width:2.2em;height:1.7em;padding-right:.5em">
                      <!-- Иконка для "Русские сериалы" (пример) -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                              d="M12.071 33V15h5.893c3.331 0 6.032 2.707 6.032 6.045s-2.7 6.045-6.032 6.045h-5.893m5.893 0l5.892 5.905m3.073-11.92V28.5a4.5 4.5 0 0 0 4.5 4.5h0a4.5 4.5 0 0 0 4.5-4.5v-7.425"/>
                      </svg>
                    </div>
                    <div style="font-size:1.3em">Русские сериалы</div>
                 </div>`
      },
      {
        title: `<div class="settings-folder" style="padding:0!important">
                    <div style="width:2.2em;height:1.7em;padding-right:.5em">
                      <!-- Иконка для "Русские мультфильмы" (пример) -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                              d="M12.071 33V15h5.893c3.331 0 6.032 2.707 6.032 6.045s-2.7 6.045-6.032 6.045h-5.893m5.893 0l5.892 5.905m3.073-11.92V28.5a4.5 4.5 0 0 0 4.5 4.5h0a4.5 4.5 0 0 0 4.5-4.5v-7.425"/>
                      </svg>
                    </div>
                    <div style="font-size:1.3em">Русские мультфильмы</div>
                 </div>`
      }
    ];

    // Обработчик события открытия подменю
    field.on('hover:enter', function () {
      Lampa.Select.show({
        title: NEW_ITEM_TEXT,
        items: menuOptions,
        onSelect: function (item) {
          // Очищаем HTML из заголовка, чтобы получить чистое название
          var cleanTitle = item.title.replace(/<[^>]+>/g, '').trim();
          if (cleanTitle === 'Русские фильмы') {
            Lampa.Activity.push({
              url: `discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0, 10)}`,
              title: 'Русские фильмы',
              component: 'category_full',
              source: 'tmdb',
              card_type: true,
              page: 1,
            });
          } else if (cleanTitle === 'Русские сериалы') {
            Lampa.Activity.push({
              url: 'discover/tv?with_original_language=ru&sort_by=first_air_date.desc',
              title: 'Русские сериалы',
              component: 'category_full',
              source: 'tmdb',
              card_type: true,
              page: 1,
            });
          } else if (cleanTitle === 'Русские мультфильмы') {
            Lampa.Activity.push({
              url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0, 10)}`,
              title: 'Русские мультфильмы',
              component: 'category_full',
              source: 'tmdb',
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

    // Добавляем новый пункт меню после пункта TV
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
