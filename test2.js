(function(){
  'use strict';

  // Компонент модального окна для "Русские фильмы"
  function ru_films_modal(object) {
    var comp = new Lampa.InteractionCategory(object);
    
    comp.create = function(){
      this.activity.loader(true);
      
      // Создаем модальное окно (overlay)
      var modal = document.createElement('div');
      modal.className = 'ru_films_modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '9999';
      
      // Контейнер окна – аналог стиля плагина "Коллекции"
      var container = document.createElement('div');
      container.className = 'ru_films_modal_content';
      container.style.width  = '80%';
      container.style.maxWidth = '400px';
      container.style.height = '80vh';
      container.style.backgroundColor = '#ffffff';
      container.style.border = '1px solid #ccc';
      container.style.borderRadius = '10px';
      container.style.padding = '20px';
      container.style.boxSizing = 'border-box';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      
      // Заголовок окна (можно скрыть, если уже есть в шапке)
      var title = document.createElement('div');
      title.innerText = object.title || 'Русские фильмы';
      title.style.fontSize = '1.8em';
      title.style.marginBottom = '20px';
      title.style.color = '#333';
      container.appendChild(title);
      
      // Функция создания кнопки
      function createModalButton(label, callback) {
        var btn = document.createElement('button');
        btn.innerText = label;
        btn.style.width = '100%';
        btn.style.padding = '15px';
        btn.style.marginBottom = '10px';
        btn.style.fontSize = '1.2em';
        btn.style.border = '2px solid #ddd';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = '#f5f5f5';
        // Добавляем простой эффект наведения через transition
        btn.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        btn.onmouseover = function(){
          btn.style.transform = 'scale(1.05)';
          btn.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        };
        btn.onmouseout = function(){
          btn.style.transform = 'scale(1)';
          btn.style.boxShadow = 'none';
        };
        btn.onclick = callback;
        return btn;
      }
      
      // Создаем кнопки "Русские новинки" и "Русское популярное"
      var btnNew = createModalButton('Русские новинки', function(){
        var url = `discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().slice(0,10)}&category=new`;
        Lampa.Activity.push({
          url: url,
          title: 'Русские новинки',
          component: 'category_full',
          source: 'cp',
          card_type: true,
          page: 1
        });
      });
      var btnTop = createModalButton('Русское популярное', function(){
        var url = `discover/movie?with_original_language=ru&sort_by=popularity.desc&category=top`;
        Lampa.Activity.push({
          url: url,
          title: 'Русское популярное',
          component: 'category_full',
          source: 'cp',
          card_type: true,
          page: 1
        });
      });
      
      container.appendChild(btnNew);
      container.appendChild(btnTop);
      
      // Добавляем кнопку закрытия модального окна
      var btnClose = createModalButton('Закрыть', function(){
        Lampa.Activity.backward();
      });
      btnClose.style.backgroundColor = '#e5e5e5';
      container.appendChild(btnClose);
      
      modal.appendChild(container);
      
      // Вставляем модальное окно в контейнер активности
      this.activity.render().html(modal);
      this.activity.loader(false);
      
      // Закрытие окна по нажатию клавиши Escape
      modal.addEventListener('keydown', function(e){
        if(e.keyCode === 27) Lampa.Activity.backward();
      });
      modal.focus();
    };
    
    return comp;
  }
  Lampa.Component.add('ru_films_modal', ru_films_modal);

  // Обработчики для "Русские сериалы" и "Русские мультфильмы" остаются без изменений
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

  // Функция для добавления кнопки в меню – с подписью под иконкой
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnterHandler){
    // newItemAttr должен быть вида: data-action="ru_movie_films"
    var field = $(`
      <li class="menu__item selector" ${newItemAttr}>
        <div class="menu__ico animated-icon">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);
    field.on('hover:enter', onEnterHandler);
    Lampa.Menu.render().find('[data-action="tv"]').after(field);
  }
  
  // Функции для добавления кнопок в меню
  function addRuFilmsMenuButton(){
    addMenuButton(
      'data-action="ru_movie_films"',
      'Русские фильмы',
      iconFilms,
      function(){
        Lampa.Activity.push({
          component: 'ru_films_modal',
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
  
  // Добавляем базовые CSS-стили для анимации
  var style = document.createElement('style');
  style.innerHTML = `
    .animated-icon {
      transition: transform 0.3s ease;
    }
    .animated-icon:hover {
      transform: scale(1.1);
    }
    /* Стили для модального окна "Русские фильмы" */
    .ru_films_modal_content {
      font-family: sans-serif;
    }
    .ru_films_modal button {
      background-color: #f5f5f5;
      border: 2px solid #ddd;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .ru_films_modal button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    }
  `;
  document.head.appendChild(style);
  
})();
