(function(){
  'use strict';

  // Определяем иконки для меню (оставляем их для кнопок меню)
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
  // Компонент для "Русские фильмы" – окно с выбором категорий (постеры вместо надписей)
  function ruFilmsComponent(object) {
    var comp = new Lampa.InteractionCategory(object);
    
    comp.create = function(){
      this.activity.loader(true);
      
      // Создаем контейнер для полноэкранного окна
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
      
      // Заголовок окна (уже отображается в head приложения, поэтому можно его оставить или убрать)
      var header = document.createElement('h1');
      header.innerText = object.title || 'Русские фильмы';
      header.style.color = '#fff';
      header.style.marginBottom = '40px';
      header.style.fontSize = '2em';
      // Если надпись уже есть в верхнем меню, её можно убрать:
      // header.style.display = 'none';
      container.appendChild(header);
      
      // Контейнер для кнопок категорий
      var btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '60px';
      btnContainer.style.justifyContent = 'center';
      btnContainer.style.alignItems = 'center';
      container.appendChild(btnContainer);
      
      // Функция для создания кнопки в виде широкой картинки (без надписи внутри)
      function createCategoryButton(callback, poster) {
        var btn = document.createElement('div');
        // Сделаем кнопку шире, как в плагине коллекций
        btn.style.width = '300px';
        btn.style.height = '200px';
        btn.style.backgroundColor = '#444';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        // Создаем img, который занимает всю кнопку
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        // Если передан poster, используем его, иначе placeholder
        img.src = poster || 'https://via.placeholder.com/300x200?text=Нет+изображения';
        btn.appendChild(img);
        btn.onclick = callback;
        return btn;
      }
      
      // Для кнопок можно использовать постеры из объекта, если они заданы
      // Например: object.poster_new и object.poster_top
      var posterNew = object.poster_new || object.poster || 'https://via.placeholder.com/300x200?text=Новинки';
      var posterTop = object.poster_top || object.poster || 'https://via.placeholder.com/300x200?text=Топ';
      
      // Кнопка "Новинки"
      var btnNew = createCategoryButton(function(){
        var url = `discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0,10)}&category=new`;
        Lampa.Activity.push({
          url: url,
          title: 'Русские фильмы - Новинки',
          component: 'category_full',
          source: 'cp',
          card_type: true,
          page: 1
        });
      }, posterNew);
      
      // Кнопка "Топ"
      var btnTop = createCategoryButton(function(){
        var url = `discover/movie?with_original_language=ru&sort_by=popularity.desc&category=top`;
        Lampa.Activity.push({
          url: url,
          title: 'Русские фильмы - Топ',
          component: 'category_full',
          source: 'cp',
          card_type: true,
          page: 1
        });
      }, posterTop);
      
      btnContainer.appendChild(btnNew);
      btnContainer.appendChild(btnTop);
      
      this.activity.render().html(container);
      this.activity.loader(false);
    };
    
    return comp;
  }
  Lampa.Component.add('ru_films_select', ruFilmsComponent);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Для "Русские сериалы" и "Русские мультфильмы" можно сразу запускать активность с нужным URL:
  function ruSeriesHandler() {
    Lampa.Activity.push({
      url: 'discover/tv?with_original_language=ru&sort_by=first_air_date.desc',
      title: 'Русские сериалы',
      component: 'category_full',
      source: 'cp',
      card_type: true,
      page: 1
    });
  }
  function ruCartoonsHandler() {
    Lampa.Activity.push({
      url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0,10)}`,
      title: 'Русские мультфильмы',
      component: 'category_full',
      source: 'cp',
      card_type: true,
      page: 1
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Функция для добавления кнопки в меню (аналог из плагина коллекций)
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

  // Функция для добавления кнопок в меню
  function addMenuButtons(){
    // "Русские фильмы" – открывает экран с выбором категорий (постерами)
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
    // "Русские сериалы" – сразу открывает активность
    addMenuButton(
      'data-action="ru_movie_series"',
      'Русские сериалы',
      iconSeries,
      ruSeriesHandler
    );
    // "Русские мультфильмы" – сразу открывает активность
    addMenuButton(
      'data-action="ru_movie_cartoons"',
      'Русские мультфильмы',
      iconCartoons,
      ruCartoonsHandler
    );
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
