(function(){
  'use strict';

  // Функция для получения рандомного постера (пример – заменить на реальные данные)
  function getRandomPoster(prefix){
    if(typeof Lampa !== 'undefined' && Lampa.TMDB && Lampa.TMDB.image){
      return Lampa.TMDB.image('t/p/w300/' + prefix);
    }
    return 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(prefix);
  }

  // Иконки для меню с подписями
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
  // Компонент для "Русские фильмы" – экран выбора категорий
  function ruFilmsComponent(object) {
    var comp = new Lampa.InteractionCategory(object);
    
    comp.create = function(){
      this.activity.loader(true);
      
      // Контейнер окна: адаптивный размер с максимальной шириной
      var container = document.createElement('div');
      container.className = 'ru_films_select';
      container.style.width  = '80%';
      container.style.maxWidth = '800px';
      container.style.height = '80vh';
      container.style.backgroundColor = '#1a1a1a';
      container.style.border = '2px solid #333';
      container.style.borderRadius = '10px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.margin = 'auto';
      container.tabIndex = 0;
      
      // Контейнер для кнопок – растягивается по ширине
      var btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.width = '100%';
      btnContainer.style.justifyContent = 'space-evenly';
      btnContainer.style.alignItems = 'center';
      container.appendChild(btnContainer);
      
      // Функция создания адаптивной кнопки с постером и подписью под ним
      function createCategoryButton(label, callback, posterUrl) {
        var btn = document.createElement('div');
        // Используем flex-свойства для адаптивности – минимальная ширина и гибкий рост
        btn.style.flex = '1';
        btn.style.maxWidth = '300px';
        btn.style.height = 'auto';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.margin = '10px';
        btn.style.backgroundColor = '#222';
        btn.style.border = '2px solid #444';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.classList.add('animated-icon');
        
        // Изображение – занимает 100% ширины кнопки, высота определяется автоматически
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.maxHeight = '200px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.src = posterUrl;
        btn.appendChild(img);
        
        // Подпись под изображением
        var caption = document.createElement('div');
        caption.innerText = label;
        caption.style.color = '#fff';
        caption.style.fontSize = '1.3em';
        caption.style.marginTop = '5px';
        btn.appendChild(caption);
        
        btn.onclick = callback;
        return btn;
      }
      
      // Определяем постеры – если объект содержит собственные URL, иначе рандомные
      var posterNew = object.poster_new || getRandomPoster('Новинки');
      var posterTop = object.poster_top || getRandomPoster('Топ');
      
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
  // Обработчики для "Русские сериалы" и "Русские мультфильмы" – сразу запускают активность
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

  // Функция для добавления кнопки в меню – возвращаем подписи в меню
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnterHandler) {
    var field = $(`
      <li class="menu__item selector" ${newItemAttr}>
        <div class="menu__ico animated-icon">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);
    field.on('hover:enter', onEnterHandler);
    if (window.appready) {
      Lampa.Menu.render().find('[data-action="tv"]').after(field);
      setTimeout(function(){
        $(newItemAttr).insertAfter(Lampa.Menu.render().find('[data-action="tv"]'));
      }, 2000);
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          Lampa.Menu.render().find('[data-action="tv"]').after(field);
          setTimeout(function(){
            $(newItemAttr).insertAfter(Lampa.Menu.render().find('[data-action="tv"]'));
          }, 2000);
        }
      });
    }
  }

  // Функции для добавления кнопок меню
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
      if(e.type === 'ready'){
        addMenuButtons();
      }
    });
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // CSS для анимации и оформления, аналогичный плагину коллекций
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
  `;
  document.head.appendChild(style);
  
})();
