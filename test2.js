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
  console.log('tv_streaming_select init:', object);
  var component = {
    html: document.createElement('div'),
    start: function() {
      console.log('tv_streaming_select start');
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

  // Создаём основной контейнер в стиле wrap с классами, похожими на TV SHOW стриминги
  component.html.className = 'wrap layer--height layer--width lmeCatalog';
  component.html.style.width = '100vw';
  component.html.style.height = '100vh';

  // Header – как в стандартном окне (можно взять стили из TV SHOW окна)
  var head = document.createElement('div');
  head.className = 'head';
  head.style.width = '100%';
  head.style.height = '60px';
  head.style.display = 'flex';
  head.style.alignItems = 'center';
  head.style.justifyContent = 'center';
  head.style.backgroundColor = '#111';
  head.style.boxSizing = 'border-box';
  // Заголовок
  var headTitle = document.createElement('div');
  headTitle.className = 'head__title';
  headTitle.style.fontSize = '2em';
  headTitle.style.color = '#fff';
  headTitle.innerText = object.title || 'Русские фильмы';
  head.appendChild(headTitle);
  component.html.appendChild(head);

  // Контейнер для основного контента (аналог wrap__content)
  var content = document.createElement('div');
  content.className = 'wrap__content layer--height layer--width';
  content.style.width = '100vw';
  content.style.height = 'calc(100vh - 60px)'; // учитываем высоту header
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.justifyContent = 'center';
  content.style.backgroundColor = '#000';
  component.html.appendChild(content);

  // Контейнер для кнопок выбора (похож на блок с большими кнопками)
  var btnContainer = document.createElement('div');
  btnContainer.className = 'tv_streaming_buttons';
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '60px';
  btnContainer.style.justifyContent = 'center';
  btnContainer.style.alignItems = 'center';
  // Для отладки можно временно добавить рамку:
  // btnContainer.style.border = '2px solid yellow';
  
  // Функция для создания кнопки – стиль большой квадратной кнопки, как в TV SHOW
  function createCategoryButton(label, callback) {
    var btn = document.createElement('div');
    btn.className = 'full-start__button selector';
    btn.style.width = '200px';
    btn.style.height = '200px';
    btn.style.backgroundColor = '#444';
    btn.style.display = 'flex';
    btn.style.flexDirection = 'column';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.borderRadius = '10px';
    btn.style.fontSize = '1.5em';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.innerText = label;
    btn.onclick = callback;
    return btn;
  }

  // Кнопка "Новинки"
  var btnNew = createCategoryButton('Новинки', function() {
    var url = `discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0,10)}&category=new`;
    Lampa.Activity.push({
      url: url,
      title: 'Русские фильмы - Новинки',
      component: 'category_full',
      source: 'cp',
      card_type: true,
      page: 1
    });
  });

  // Кнопка "Топ"
  var btnTop = createCategoryButton('Топ', function() {
    var url = `discover/movie?with_original_language=ru&sort_by=popularity.desc&category=top`;
    Lampa.Activity.push({
      url: url,
      title: 'Русские фильмы - Топ',
      component: 'category_full',
      source: 'cp',
      card_type: true,
      page: 1
    });
  });

  btnContainer.appendChild(btnNew);
  btnContainer.appendChild(btnTop);
  content.appendChild(btnContainer);

  // Обработчик для клавиши Esc (возврат назад)
  component.html.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      Lampa.Activity.backward();
    }
  });

  console.log('tv_streaming_select HTML:', component.html.innerHTML);
  return component;
});

