(function(){
  'use strict';

  // Определяем иконки (можете менять по своему вкусу)
  var iconFilms = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;
  var iconSeries = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;
  var iconCartoons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Регистрация компонента для "Русские фильмы" – окно с выбором категорий (Новинки / Топ)
  function ruFilmsComponent(object) {
    // Создаем экземпляр взаимодействия на основе Lampa.InteractionCategory
    var comp = new Lampa.InteractionCategory(object);
    
    comp.create = function(){
      // Отображаем loader, если нужно
      this.activity.loader(true);
      
      // Создаем полноэкранный контейнер
      var container = document.createElement('div');
      container.className = 'ru_films_select';
      container.style.width  = '100vw';
      container.style.height = '100vh';
      container.style.backgroundColor = '#000';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.tabIndex = 0;
      
      // Заголовок
      var header = document.createElement('h1');
      header.innerText = object.title || 'Русские фильмы';
      header.style.color = '#fff';
      header.style.marginBottom = '40px';
      header.style.fontSize = '2em';
      container.appendChild(header);
      
      // Контейнер для кнопок
      var btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '60px';
      btnContainer.style.justifyContent = 'center';
      btnContainer.style.alignItems = 'center';
      container.appendChild(btnContainer);
      
      // Функция для создания большой кнопки
      function createBtn(label, callback) {
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
      var btnNew = createBtn('Новинки', function(){
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
      var btnTop = createBtn('Топ', function(){
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
      
      // Устанавливаем разметку в активность
      this.activity.render().html(container);
      this.activity.loader(false);
    };
    
    return comp;
  }
  Lampa.Component.add('ru_films_select', ruFilmsComponent);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Регистрация компонентов для "Русские сериалы" и "Русские мультфильмы" не требуют отдельного экрана выбора.
  // Их обработчики будут сразу запускать активность с нужным URL.
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Функция для добавления кнопки в меню (аналог addMenuButton из плагина коллекций)
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
      Lampa.Menu.render().find('[data-action="tv"]').after(field);
      // Перемещаем элемент через заданный таймаут
      setTimeout(function(){
        $(NEW_ITEM_SELECTOR).insertAfter(Lampa.Menu.render().find('[data-action="tv"]'));
      }, 2000);
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          Lampa.Menu.render().find('[data-action="tv"]').after(field);
          setTimeout(function(){
            $(NEW_ITEM_SELECTOR).insertAfter(Lampa.Menu.render().find('[data-action="tv"]'));
          }, 2000);
        }
      });
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Добавляем кнопку "Русские фильмы"
  function addRuFilmsMenuButton(){
    addMenuButton(
      'data-action="ru_movie_films"',
      'Русские фильмы',
      iconFilms,
      function () {
        Lampa.Activity.push({
          component: 'ru_films_select',
          title: 'Русские фильмы'
        });
      }
    );
  }

  // Добавляем кнопку "Русские сериалы"
  function addRuSeriesMenuButton(){
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
          page: 1
        });
      }
    );
  }

  // Добавляем кнопку "Русские мультфильмы"
  function addRuCartoonsMenuButton(){
    addMenuButton(
      'data-action="ru_movie_cartoons"',
      'Русские мультфильмы',
      iconCartoons,
      function () {
        Lampa.Activity.push({
          url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0,10)}`,
          title: 'Русские мультфильмы',
          component: 'category_full',
          source: 'cp',
          card_type: true,
          page: 1
        });
      }
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Добавляем кнопки в меню после готовности приложения
  function addMenuButtons(){
    addRuFilmsMenuButton();
    addRuSeriesMenuButton();
    addRuCartoonsMenuButton();
  }

  if(window.appready){
    addMenuButtons();
  } else {
    Lampa.Listener.follow('app', function(e){
      if(e.type === 'ready'){
        addMenuButtons();
      }
    });
  }
  
})();
