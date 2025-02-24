(function(){
  'use strict';

  // Ждем готовности приложения
  Lampa.Listener.follow('app', function(e){
    if(e.type === 'ready'){
      // Получаем меню
      var menu = Lampa.Menu.render();
      if(!menu || !menu.length){
        console.error('Меню не найдено');
        return;
      }
      
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

      // Обработчик нажатия кнопки – открываем окно выбора категорий через Lampa.Select.show
      kpButton.on('hover:enter', function(){
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
            // При выборе категории открываем ее через Lampa.Activity.push
            Lampa.Activity.push({
              url: item.data.url,
              title: item.title,
              component: 'category_full',
              source: 'KP', // источник можно указать как KP
              card_type: true,
              page: 1
            });
          },
          onBack: function(){
            // При нажатии кнопки "назад" возвращаемся в меню
            Lampa.Controller.toggle("menu");
          }
        });
      });

      // Добавляем кнопку "Кинопоиск" после элемента с data-action="tv"
      var tvItem = menu.find('[data-action="tv"]');
      if(tvItem.length){
        tvItem.after(kpButton);
      } else {
        menu.append(kpButton);
      }
    }
  });
})();
