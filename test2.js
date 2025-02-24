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
      console.log('tv_streaming_select: start');
      Lampa.Controller.add('content', {
        link: this,
        toggle: function() {
          Navigator.focused(component.html);
        },
        back: function() {
          Lampa.Activity.backward();
        }
      });
      component.html.focus();
      Lampa.Controller.toggle('content');
    },
    pause: function() {},
    stop: function() {},
    destroy: function() {
      this.html.remove();
    },
    render: function(js) {
      return js ? this.html : $(this.html);
    }
  };

  // Основной контейнер
  component.html.style.position = 'fixed';
  component.html.style.top = '0';
  component.html.style.left = '0';
  component.html.style.width = '100vw';
  component.html.style.height = '100vh';
  // Яркий фон для отладки:
  component.html.style.backgroundColor = '#ff0000';
  component.html.style.display = 'flex';
  component.html.style.flexDirection = 'column';
  component.html.style.alignItems = 'center';
  component.html.style.justifyContent = 'center';
  component.html.style.zIndex = '9999';
  component.html.tabIndex = 0;

  // Заголовок окна
  var header = document.createElement('h1');
  header.innerText = object.title || 'Выберите категорию';
  header.style.color = '#fff';
  header.style.marginBottom = '40px';
  header.style.fontSize = '2em';
  component.html.appendChild(header);

  // Контейнер для кнопок
  var container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '60px';
  container.style.justifyContent = 'center';
  container.style.width = '100%';
  // Для отладки добавляем рамку:
  container.style.border = '2px solid yellow';

  function createButton(text, callback) {
    var btn = document.createElement('button');
    btn.innerText = text;
    btn.style.padding = '20px 40px';
    btn.style.fontSize = '1.5em';
    btn.style.cursor = 'pointer';
    btn.style.border = '2px solid #fff';
    btn.style.borderRadius = '10px';
    btn.style.backgroundColor = '#444';
    btn.style.color = '#fff';
    btn.onclick = callback;
    return btn;
  }

  var btnNew = createButton('Новинки', function() {
    var url = `discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0, 10)}&category=new`;
    Lampa.Activity.push({
      url: url,
      title: 'Русские фильмы - Новинки',
      component: 'category_full',
      source: 'cp',
      card_type: true,
      page: 1,
    });
  });
  
  var btnTop = createButton('Топ', function() {
    var url = `discover/movie?with_original_language=ru&sort_by=popularity.desc&category=top`;
    Lampa.Activity.push({
      url: url,
      title: 'Русские фильмы - Топ',
      component: 'category_full',
      source: 'cp',
      card_type: true,
      page: 1,
    });
  });
  
  container.appendChild(btnNew);
  container.appendChild(btnTop);
  component.html.appendChild(container);

  component.html.addEventListener('keydown', function(e) {
    if(e.keyCode === 27) {
      Lampa.Activity.backward();
    }
  });

  return component;
});

