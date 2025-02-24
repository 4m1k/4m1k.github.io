(function(){
  'use strict';

  // Пример массива рандомных постеров (замените URL на реальные из плагина коллекций)
  var randomPosters = [
    'https://via.placeholder.com/300x200?text=Poster+1',
    'https://via.placeholder.com/300x200?text=Poster+2',
    'https://via.placeholder.com/300x200?text=Poster+3'
  ];
  function getRandomPoster(){
    return randomPosters[Math.floor(Math.random() * randomPosters.length)];
  }

  // Определяем иконки для меню – здесь они будут использоваться в пункте меню,
  // но в самом окне активности для "Русские фильмы" будут показаны постеры.
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
  // Компонент для "Русские фильмы" – окно выбора категорий (постеры вместо надписей)
  function ruFilmsComponent(object) {
    var comp = new Lampa.InteractionCategory(object);
    
    comp.create = function(){
      this.activity.loader(true);
      
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
      
      // Если заголовок уже отображается в шапке приложения, можно скрыть его:
      // var header = document.createElement('h1');
      // header.innerText = object.title || 'Русские фильмы';
      // header.style.color = '#fff';
      // header.style.marginBottom = '40px';
      // header.style.fontSize = '2em';
      // container.appendChild(header);
      
      // Контейнер для кнопок
      var btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '60px';
      btnContainer.style.justifyContent = 'center';
      btnContainer.style.alignItems = 'center';
      container.appendChild(btnContainer);
      
      // Функция создания кнопки с постером
      function createCategoryButton(callback, posterUrl) {
        var btn = document.createElement('div');
        // Кнопка делаем широкой, как в плагине коллекций
        btn.style.width = '300px';
        btn.style.height = '200px';
        btn.style.backgroundColor = '#444';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        // Добавляем CSS-класс для анимации (аналогичный класс из коллекций, например "animated-icon")
        btn.classList.add('animated-icon');
        // Создаем изображение – оно занимает всю кнопку
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.src = posterUrl;
        btn.appendChild(img);
        btn.onclick = callback;
        return btn;
      }
      
      // Рандомные постеры для кнопок (можно заменить реальными URL из плагина коллекций)
      var posterNew = getRandomPoster();
      var posterTop = getRandomPoster();
      
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
  // Для "Русские сериалы" и "Русские мультфильмы" сразу запускаем активность
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

  // Функция добавления кнопки в меню – теперь без текстовой подписи (оставляем только иконку)
  function addMenuButton(newItemAttr, iconHTML, onEnterHandler) {
    var NEW_ITEM_ATTR = newItemAttr;
    var NEW_ITEM_SELECTOR = '[' + NEW_ITEM_ATTR + ']';
    // Здесь в разметке убираем блок с текстом
    var field = $(`
      <li class="menu__item selector" ${NEW_ITEM_ATTR}>
        <div class="menu__ico animated-icon">${iconHTML}</div>
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

  // Функции для добавления кнопок меню
  function addRuFilmsMenuButton(){
    addMenuButton(
      'data-action="ru_movie_films"',
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
      iconSeries,
      ruSeriesHandler
    );
  }
  function addRuCartoonsMenuButton(){
    addMenuButton(
      'data-action="ru_movie_cartoons"',
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
  
  // Пример CSS для анимации (вы можете добавить этот стиль в основной CSS вашего плагина)
  var style = document.createElement('style');
  style.innerHTML = `
    .animated-icon {
      transition: transform 0.3s ease;
    }
    .animated-icon:hover {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
  
})();
