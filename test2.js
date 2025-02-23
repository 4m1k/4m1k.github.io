(function () {
  'use strict';

  // Устанавливаем платформу для ТВ
  Lampa.Platform.tv();

  // Константы: селектор для кнопки TV и таймаут перемещения
  var ITEM_TV_SELECTOR = '[data-action="tv"]';
  var ITEM_MOVE_TIMEOUT = 2000;

  // Функция для перемещения элемента
  var moveItemAfter = function (item, after) {
    return setTimeout(function () {
      $(item).insertAfter($(after));
    }, ITEM_MOVE_TIMEOUT);
  };

  // Функция для добавления отдельной кнопки в меню
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnterHandler) {
    var NEW_ITEM_ATTR = newItemAttr;
    var NEW_ITEM_SELECTOR = '[' + NEW_ITEM_ATTR + ']';
    var field = $(`
      <li class="menu__item selector" ${NEW_ITEM_ATTR}>
        <div class="menu__ico">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);
    field.on('hover:enter', onEnterHandler);
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
  }

  // Иконки, как были раньше для [RU]

  // Иконка для "Русские фильмы" (пример — clapperboard)
  var iconFilms = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="10" y="12" width="28" height="24" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="M10 12l14 12L38 12" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  // Иконка для "Русские сериалы" (пример — телевизор)
  var iconSeries = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

  // Иконка для "Русские мультфильмы" (пример — оригинальный вид, как был в плагине)
  var iconCartoons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
            d="M12.071 33V15h5.893c3.331 0 6.032 2.707 6.032 6.045s-2.7 6.045-6.032 6.045h-5.893m5.893 0l5.892 5.905m3.073-11.92V28.5a4.5 4.5 0 0 0 4.5 4.5h0a4.5 4.5 0 0 0 4.5-4.5v-7.425"/>
    </svg>
  `;

  // Добавляем кнопку "Русские фильмы"
  addMenuButton(
    'data-action="ru_movie_films"',
    'Русские фильмы',
    iconFilms,
    function () {
      Lampa.Activity.push({
        url: `discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0, 10)}`,
        title: 'Русские фильмы',
        component: 'category_full',
        source: 'tmdb',
        card_type: true,
        page: 1,
      });
    }
  );

  // Добавляем кнопку "Русские сериалы"
  addMenuButton(
    'data-action="ru_movie_series"',
    'Русские сериалы',
    iconSeries,
    function () {
      Lampa.Activity.push({
        url: 'discover/tv?with_original_language=ru&sort_by=first_air_date.desc',
        title: 'Русские сериалы',
        component: 'category_full',
        source: 'tmdb',
        card_type: true,
        page: 1,
      });
    }
  );

  // Добавляем кнопку "Русские мультфильмы"
  addMenuButton(
    'data-action="ru_movie_cartoons"',
    'Русские мультфильмы',
    iconCartoons,
    function () {
      Lampa.Activity.push({
        url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0, 10)}`,
        title: 'Русские мультфильмы',
        component: 'category_full',
        source: 'tmdb',
        card_type: true,
        page: 1,
      });
    }
  );

  // Если раньше была кнопка "Русское", её можно не добавлять.
})();
