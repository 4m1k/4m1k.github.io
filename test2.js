(function(){
  'use strict';

  // Иконка для кнопки "Кинопоиск" (можно заменить на нужную)
  var iconKP = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

  // Функция для добавления кнопки в меню
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnterHandler) {
    var field = $(`
      <li class="menu__item selector" ${newItemAttr}>
        <div class="menu__ico">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);
    field.on('hover:enter', onEnterHandler);
    if(window.appready){
      Lampa.Menu.render().append(field);
    } else {
      Lampa.Listener.follow('app', function(e){
        if(e.type === 'ready'){
          Lampa.Menu.render().append(field);
        }
      });
    }
  }

  // Функция для открытия окна с категориями Кинопоиска
  function openKPWindow(){
    // Создаем контейнер для кнопок категорий
    var container = document.createElement('div');
    container.className = 'kp-categories';

    // Получаем ID страны "Россия" из кэша (если он уже загружен через вызов menu API)
    // В данном примере предполагается, что переменная countries_map уже определена в пространстве плагина
    var rus_id = window.countries_map && window.countries_map['Россия'] ? window.countries_map['Россия'] : '';

    // Список категорий с соответствующими API ссылками
    var categories = [
      { title: 'Топ Фильмы', url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS' },
      { title: 'Популярные Фильмы', url: 'api/v2.2/films?order=NUM_VOTE&type=FILM' },
      { title: 'Российские Фильмы', url: 'api/v2.2/films?order=NUM_VOTE' + (rus_id ? '&countries=' + rus_id : '') + '&type=FILM' },
      { title: 'Российские Сериалы', url: 'api/v2.2/films?order=NUM_VOTE' + (rus_id ? '&countries=' + rus_id : '') + '&type=TV_SERIES' },
      { title: 'Популярные Сериалы', url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES' },
      { title: 'Популярные Телешоу', url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW' }
    ];

    // Для каждой категории создаем кнопку
    categories.forEach(function(cat){
      var btn = document.createElement('button');
      btn.className = 'kp-category-btn';
      btn.textContent = cat.title;
      btn.onclick = function(){
        Lampa.Activity.push({
          url: cat.url,
          title: cat.title,
          component: 'category_full',
          source: 'KP', // источник указываем как KP (Kinopoisk)
          card_type: true,
          page: 1
        });
        Lampa.Popup.close(); // Закрываем окно после выбора
      };
      container.appendChild(btn);
    });

    // Открываем всплывающее окно с созданным контентом
    Lampa.Popup.open({
      title: 'Кинопоиск',
      html: container.outerHTML,
      mask: true,
      onBack: function(){
        Lampa.Popup.close();
      }
    });
  }

  // Добавляем кнопку "Кинопоиск" в меню
  addMenuButton(
    'data-action="kp"',
    'Кинопоиск',
    iconKP,
    function(){
      openKPWindow();
    }
  );

  // Если countries_map еще не загружен, можно вызвать menu() плагина для его инициализации
  if(window.Lampa && Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.KP){
    Lampa.Api.sources.KP.menu(function(menuList){
      // сохраняем для доступа к id страны "Россия"
      window.countries_map = {};
      menuList.forEach(function(item){
        if(item.title === 'Россия' && item.id) window.countries_map['Россия'] = item.id;
      });
    });
  }
})();
