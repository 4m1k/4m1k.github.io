(function(){
  'use strict';

  // Функция для получения рандомного постера (пример – можно заменить реальными данными)
  function getRandomPoster(prefix){
    // Если у вас настроен Lampa.TMDB.image – используйте его, иначе placeholder:
    if(typeof Lampa !== 'undefined' && Lampa.TMDB && Lampa.TMDB.image){
      return Lampa.TMDB.image('t/p/w300/' + prefix);
    }
    return 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(prefix);
  }

  // Иконки для меню (с подписями)
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
      
      // Создаем контейнер окна – не полный экран, а например 80vw x 80vh, с обводкой и закруглением
      var container = document.createElement('div');
      container.className = 'ru_films_select';
      container.style.width  = '80vw';
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
      
      // Можно не выводить заголовок, если он уже отображается в верхней части приложения.
      // Но если нужно – раскомментируйте следующий блок:
      /*
      var header = document.createElement('h1');
      header.innerText = object.title || 'Русские фильмы';
      header.style.color = '#fff';
      header.style.marginBottom = '20px';
      header.style.fontSize = '1.8em';
      container.appendChild(header);
      */
      
      // Контейнер для кнопок категорий
      var btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '40px';
      btnContainer.style.justifyContent = 'center';
      btnContainer.style.alignItems = 'center';
      container.appendChild(btnContainer);
      
      // Функция создания кнопки с постером и подписью
      function createCategoryButton(label, callback, posterUrl) {
        var btn = document.createElement('div');
        // Размер кнопки: 250px x 220px (200px для постера, 20px для подписи, немного отступ)
        btn.style.width = '250px';
        btn.style.height = '220px';
        btn.style.backgroundColor = '#222';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.border = '2px solid #444';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.classList.add('animated-icon');
        
        // Изображение-постер
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '200px';
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
      
      // Определяем постеры для кнопок "Новинки" и "Топ"
      // Здесь можно использовать реальные постеры из коллекций, если они передаются в объекте.
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
      
      // Устанавливаем содержимое активности – вставляем контейнер в область активности
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

  // Функция добавления кнопки в меню – теперь с подписью под иконкой
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnterHandler) {
    var NEW_ITEM_ATTR = newItemAttr;
    var field = $(`
      <li class="menu__item selector" ${NEW_ITEM_ATTR}>
        <div class="menu__ico animated-icon">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);
    field.on('hover:enter', onEnterHandler);
    if (window.appready) {
      Lampa.Menu.render().find('[data-action="tv"]').after(field);
      setTimeout(function(){
        $(NEW_ITEM_ATTR).insertAfter(Lampa.Menu.render().find('[data-action="tv"]'));
      }, 2000);
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          Lampa.Menu.render().find('[data-action="tv"]').after(field);
          setTimeout(function(){
            $(NEW_ITEM_ATTR).insertAfter(Lampa.Menu.render().find('[data-action="tv"]'));
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
    /* Пример стилей для компонента ru_films_select */
    .ru_films_select {
      padding: 20px;
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);
  
})();
