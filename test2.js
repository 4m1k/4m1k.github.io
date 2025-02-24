(function () {
  'use strict';

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


  // Иконка для "Русские фильмы"
  var iconFilms = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

  // Иконка для "Русские сериалы"
  var iconSeries = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

  // Иконка для "Русские мультфильмы"
  var iconCartoons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////





// Изменяем обработчик для кнопки "Русские фильмы"
addMenuButton(
  'data-action="ru_movie_films"',
  'Русские фильмы',
  iconFilms,
  function () {
    Lampa.Activity.push({
      component: 'tv_streaming_select',
      title: 'Русские фильмы'
    });
  }
);


////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
        source: 'cp',
        card_type: true,
        page: 1,
      });
    }
  );


////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
        source: 'cp',
        card_type: true,
        page: 1,
      });
    }
  );

})();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Добавляем компонент для выбора категории (аналог TV SHOW стримингов)
Lampa.Component.add('tv_streaming_select', function(object) {
  var component = {
    html: document.createElement('div'),
    start: function() {
      // Минимальная отладочная разметка
      this.html.innerHTML = 
        '<h1 style="color:#fff; text-align:center; margin-bottom:40px;">' + (object.title || 'Русские фильмы') + '</h1>' +
        '<div style="display:flex; justify-content:center; gap:20px;">' +
          '<button onclick="alert(\'Новинки\')" style="padding:20px; font-size:1.5em;">Новинки</button>' +
          '<button onclick="alert(\'Топ\')" style="padding:20px; font-size:1.5em;">Топ</button>' +
        '</div>';
      
      // Стили для полноэкранного отображения
      this.html.style.position = 'fixed';
      this.html.style.top = '0';
      this.html.style.left = '0';
      this.html.style.width = '100vw';
      this.html.style.height = '100vh';
      this.html.style.backgroundColor = '#f00'; // яркий красный для отладки
      this.html.style.display = 'flex';
      this.html.style.flexDirection = 'column';
      this.html.style.alignItems = 'center';
      this.html.style.justifyContent = 'center';
      this.html.style.zIndex = '9999';
      this.html.tabIndex = 0;
      
      // Добавляем компонент в body для отладки
      document.body.appendChild(this.html);
      this.html.focus();
      Lampa.Controller.toggle('content');
    },
    pause: function() {},
    stop: function() {},
    destroy: function() {
      this.html.remove();
    },
    render: function(js) {
      return this.html;
    }
  };
  console.log('tv_streaming_select init, object:', object);
  return component;
});
