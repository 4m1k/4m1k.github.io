(function(){
  'use strict';

  var originalSource = null;

  // Ждем, когда приложение будет готово
  Lampa.Listener.follow('app', function(e){
    if(e.type === 'ready'){
      // Сохраняем исходный источник из настроек (если он задан)
      if(Lampa.Params && Lampa.Params.values && Lampa.Params.values.source){
        originalSource = Object.assign({}, Lampa.Params.values.source);
      } else {
        originalSource = { tmdb: 'TMDB' }; // значение по умолчанию, если не задано
      }
      console.log('Исходный источник сохранён:', originalSource);

      var menu = Lampa.Menu.render();
      if(!menu || !menu.length){
        console.error('Меню не найдено');
        return;
      }
      console.log('Меню найдено, добавляем кнопку Кинопоиск');

      // Создаем кнопку "Кинопоиск"
      var kpButton = $(`
        <li class="menu__item selector" data-action="kp">
          <div class="menu__ico">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
              <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
              <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="menu__text">Кинопоиск</div>
        </li>
      `);

      // Обработчик нажатия – здесь используем событие click
      kpButton.on('click', function(){
        console.log('Нажата кнопка Кинопоиск');
        if(typeof Lampa.Select !== 'undefined' && typeof Lampa.Select.show === 'function'){
          Lampa.Select.show({
            title: 'Кинопоиск',
            items: [
              { title: 'Топ Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS' } },
              { title: 'Популярные Фильмы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=FILM' } },
              { title: 'Российские Фильмы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=FILM&countries=225' } },
              { title: 'Российские Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES&countries=225' } },
              { title: 'Популярные Сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES' } },
              { title: 'Популярные Телешоу', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW' } }
            ],
            onSelect: function(item){
              console.log('Выбран пункт:', item);
              // При переходе в категорию временно подставляем источник "KP"
              Lampa.Activity.push({
                url: item.data.url,
                title: item.title,
                component: 'category_full',
                source: 'KP', // здесь временно используем KP для загрузки категорий
                card_type: true,
                page: 1,
                onBack: function(){
                  // При выходе из категории возвращаем исходный источник
                  if(originalSource){
                    Lampa.Params.select('source', originalSource);
                  }
                  Lampa.Controller.toggle("menu");
                }
              });
            },
            onBack: function(){
              // При выходе из окна выбора категорий возвращаем исходный источник
              if(originalSource){
                Lampa.Params.select('source', originalSource);
              }
              Lampa.Controller.toggle("menu");
            }
          });
          console.log('Окно выбора категорий открыто');
        } else {
          console.error('Lampa.Select.show недоступен');
        }
      });

      // Добавляем кнопку после элемента с data-action="tv", если он найден
      var tvItem = menu.find('[data-action="tv"]');
      if(tvItem.length){
        tvItem.after(kpButton);
        console.log('Кнопка Кинопоиск добавлена после элемента TV');
      } else {
        menu.append(kpButton);
        console.log('Кнопка Кинопоиск добавлена в конец меню');
      }
    }
  });
})();
