(function(){
  'use strict';

  // Пример манифеста плагина (можно изменить по необходимости)
  var manifest = {
    type: 'video',
    version: '1.0.0',
    name: 'Русские фильмы',
    description: 'Выбор категорий для русских фильмов',
    component: 'ru_films_select'
  };
  Lampa.Manifest.plugins = manifest;



///////////////////////////////////////////////////////////////////////////////////////////

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

 // Регистрация компонента "ru_films_select"
  function ruFilmsComponent(object) {
    // Создаем новый экземпляр взаимодействия на основе Lampa.InteractionCategory
    var comp = new Lampa.InteractionCategory(object);
    
    // Переопределяем метод create – он отвечает за построение экрана активности
    comp.create = function(){
      // Показываем loader (если требуется)
      this.activity.loader(true);
      
      // Создаем полный экран с заголовком и блоком кнопок
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
      // (для отладки можно добавить рамку: btnContainer.style.border = '2px solid yellow';)
      
      // Функция создания кнопки – большой квадрат
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
      container.appendChild(btnContainer);
      
      // Устанавливаем собранную разметку как содержимое активности
      this.activity.render().html(container);
      // Останавливаем loader
      this.activity.loader(false);
    };

    return comp;
  }

  // Регистрируем компонент под именем 'ru_films_select'
  Lampa.Component.add('ru_films_select', ruFilmsComponent);

  // Функция добавления кнопки в меню (аналог addMenuButton из плагина коллекций)
  function addRuFilmsMenuButton(){
    var button = $(`
      <li class="menu__item selector" data-action="ru_movie_films">
        <div class="menu__ico">${iconFilms}</div>
        <div class="menu__text">Русские фильмы</div>
      </li>
    `);
    button.on('hover:enter', function(){
      Lampa.Activity.push({
        component: 'ru_films_select',
        title: 'Русские фильмы'
      });
    });
    // Добавляем кнопку после элемента с data-action="tv"
    Lampa.Menu.render().find('[data-action="tv"]').after(button);
  }

  // Ждем, когда приложение будет готово, и добавляем кнопку
  if(window.appready) {
    addRuFilmsMenuButton();
  } else {
    Lampa.Listener.follow('app', function(e){
      if(e.type === 'ready'){
        addRuFilmsMenuButton();
      }
    });
  }
  
})();
