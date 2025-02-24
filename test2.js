(function(){
  'use strict';

  // Функции для получения постеров (аналогично плагину коллекции, где postер берётся из element.img)
  function getPosterNew(object){
    return object.poster_new || 'https://via.placeholder.com/300x200?text=Новинки';
  }
  function getPosterTop(object){
    return object.poster_top || 'https://via.placeholder.com/300x200?text=Топ';
  }

  // Иконки для меню (возвращаются подписи вместе с иконкой)
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
  // Компонент "ru_films_select" – экран выбора категорий для "Русских фильмов"
  function ruFilmsComponent(object) {
    var comp = new Lampa.InteractionCategory(object);
    
    comp.create = function(){
      this.activity.loader(true);
      
      // Контейнер окна – адаптивный (80% ширины, макс. 800px, 80vh по высоте)
      var container = document.createElement('div');
      container.className = 'ru_films_select';
      container.style.width  = '80%';
      container.style.maxWidth = '800px';
      container.style.height = '80vh';
      container.style.backgroundColor = '#ffffff';
      container.style.border = '1px solid #ccc';
      container.style.borderRadius = '10px';
      container.style.margin = 'auto';
      container.style.padding = '20px';
      container.style.boxSizing = 'border-box';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.tabIndex = 0;
      
      // Контейнер для кнопок категорий – растягивается по ширине
      var btnContainer = document.createElement('div');
      btnContainer.className = 'category-buttons';
      btnContainer.style.display = 'flex';
      btnContainer.style.width = '100%';
      btnContainer.style.justifyContent = 'space-evenly';
      btnContainer.style.alignItems = 'center';
      container.appendChild(btnContainer);
      
      // Функция создания кнопки категории – кнопка содержит изображение (постер) и подпись под ним
      function createCategoryButton(label, callback, posterUrl) {
        var btn = document.createElement('div');
        btn.className = 'category-button selector';
        // Используем flex для адаптивного размера
        btn.style.flex = '1 1 300px';
        btn.style.margin = '10px';
        btn.style.backgroundColor = '#f5f5f5';
        btn.style.border = '2px solid #ddd';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        // Добавляем класс для анимации при наведении (аналогичный плагину коллекции)
        btn.classList.add('animated-icon');
        
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.maxHeight = '200px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.src = posterUrl;
        btn.appendChild(img);
        
        var caption = document.createElement('div');
        caption.className = 'caption';
        caption.innerText = label;
        caption.style.color = '#333';
        caption.style.fontSize = '1.3em';
        caption.style.marginTop = '5px';
        btn.appendChild(caption);
        
        btn.onclick = callback;
        return btn;
      }
      
      // Постеры для кнопок "Новинки" и "Топ" – берутся из объекта
      var posterNew = getPosterNew(object);
      var posterTop = getPosterTop(object);
      
      var btnNew = createCategoryButton('Новинки', function(){
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
      
      var btnTop = createCategoryButton('Топ', function(){
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

  // Обработчики для "Русские сериалы" и "Русские мультфильмы"
  function ruSeriesHandler(){
    Lampa.Activity.push({
      url: 'discover/tv?with_original_language=ru&sort_by=first_air_date.desc',
      title: 'Русские сериалы',
      component: 'category_full',
      source: 'cp',
      card_type: true,
      page: 1
    });
  }
  function ruCartoonsHandler(){
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

  // Функция добавления кнопки в меню – возвращает подписи и иконку
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnterHandler){
    // newItemAttr ожидается как строка вида: data-action="ru_movie_films"
    var field = $(`
      <li class="menu__item selector" ${newItemAttr}>
        <div class="menu__ico animated-icon">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);
    field.on('hover:enter', onEnterHandler);
    // Добавляем кнопку сразу в меню
    Lampa.Menu.render().find('[data-action="tv"]').after(field);
  }
  
  // Функции для добавления кнопок меню
  function addRuFilmsMenuButton(){
    addMenuButton(
      'data-action="ru_movie_films"',
      'Русские фильмы',
      iconFilms,
      function(){
        Lampa.Activity.push({
          component: 'ru_films_select',
          title: 'Русские фильмы'
        });
      }
    );
  }
  function addRuSeriesMenuButton(){
    addMenuButton(
      'data-action="ru_movie_series"',
      'Русские сериалы',
      iconSeries,
      ruSeriesHandler
    );
  }
  function addRuCartoonsMenuButton(){
    addMenuButton(
      'data-action="ru_movie_cartoons"',
      'Русские мультфильмы',
      iconCartoons,
      ruCartoonsHandler
    );
  }
  
  function addMenuButtons(){
    addRuFilmsMenuButton();
    addRuSeriesMenuButton();
    addRuCartoonsMenuButton();
  }
  
  if(window.appready){
    addMenuButtons();
  } else {
    Lampa.Listener.follow('app', function(e){
      if(e.type==='ready'){
        addMenuButtons();
      }
    });
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Добавляем CSS-стили, аналогичные плагину коллекций
  var style = document.createElement('style');
  style.innerHTML = `
    .animated-icon {
      transition: transform 0.3s ease;
    }
    .animated-icon:hover {
      transform: scale(1.1);
    }
    /* Стили для экрана выбора категорий "Русские фильмы" */
    .ru_films_select {
      padding: 20px;
      box-sizing: border-box;
    }
    .category-button {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .category-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    }
    .category-button .caption {
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
  
})();
