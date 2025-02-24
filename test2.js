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
      Lampa.Controller.add('content', {
        link: this,
        toggle: function() {
          Navigator.focused(component.html);
        },
        back: function() {
          Lampa.Activity.backward();
        }
      });
      // Для корректного получения фокуса
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

  // Основной контейнер в стиле lmeCatalog (как у TV SHOW СТРИМИНГИ)
  component.html.className = 'lmeCatalog';
  component.html.style.position = 'fixed';
  component.html.style.top = '0';
  component.html.style.left = '0';
  component.html.style.width = '100vw';
  component.html.style.height = '100vh';
  component.html.style.backgroundColor = '#000';
  component.html.style.display = 'flex';
  component.html.style.flexDirection = 'column';
  component.html.style.alignItems = 'center';
  component.html.style.justifyContent = 'center';
  component.html.style.zIndex = '9999';
  component.html.tabIndex = 0; // чтобы элемент можно было фокусировать

  // Создадим header, в котором разместим кнопки
  var header = document.createElement('div');
  header.className = 'lme-catalog lme-header';
  header.style.width = '100%';
  header.style.display = 'flex';
  header.style.justifyContent = 'center';
  header.style.marginBottom = '40px';

  // Можно добавить заголовок окна, если нужно:
  var titleText = document.createElement('h1');
  titleText.innerText = object.title || 'Русские фильмы';
  titleText.style.color = '#fff';
  titleText.style.fontSize = '2em';
  titleText.style.marginBottom = '20px';
  header.appendChild(titleText);

  // Контейнер для кнопок выбора категории
  var btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.justifyContent = 'center';
  btnContainer.style.alignItems = 'center';
  btnContainer.style.gap = '60px';
  // Отладочно можно добавить рамку:
  // btnContainer.style.border = '2px solid red';

  // Функция для создания кнопки в стиле TV SHOW (большая иконка, надпись)
  function createCategoryButton(label, callback) {
    var btn = document.createElement('div');
    btn.className = 'full-start__button selector';
    btn.style.width = '200px';
    btn.style.height = '200px';
    btn.style.backgroundColor = '#333';
    btn.style.display = 'flex';
    btn.style.flexDirection = 'column';
    btn.style.justifyContent = 'center';
    btn.style.alignItems = 'center';
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
    var url = `discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0, 10)}&category=new`;
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

  // Собираем разметку компонента
  // Можно поместить btnContainer в отдельный блок, если нужно добавить еще элементы (например, поиск, избранное, закладки)
  header.appendChild(btnContainer);
  component.html.appendChild(header);

  // Если нужно добавить дополнительные кнопки (например, для поиска, избранного, закладок), их можно добавить аналогичным образом.
  // Например:
  /*
  var extraContainer = document.createElement('div');
  extraContainer.style.display = 'flex';
  extraContainer.style.justifyContent = 'center';
  extraContainer.style.alignItems = 'center';
  extraContainer.style.gap = '40px';
  // Создаем кнопку "Поиск"
  var btnSearch = createCategoryButton('Поиск', function() {
    Lampa.Input.edit({ free: true, nosave: true, nomic: true, value: '' }, function(val) {
      if(val){
        object.searchQuery = val;
        Lampa.Activity.replace(object);
      } else {
        Lampa.Controller.toggle('content');
      }
    });
  });
  extraContainer.appendChild(btnSearch);
  header.appendChild(extraContainer);
  */

  // Обработчик для клавиши Esc
  component.html.addEventListener('keydown', function(e) {
    if(e.keyCode === 27) {
      Lampa.Activity.backward();
    }
  });

  return component;
});
