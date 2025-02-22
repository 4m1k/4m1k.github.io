(function () {
  'use strict';

  Lampa.Platform.tv();

  // Добавление пользовательского меню "Русское"
  (function () {
    function addCustomMenu() {
      console.log('Запуск функции addCustomMenu');

      // Иконка для пункта меню
      var menuIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-width="4">
            <path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/>
            <path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
            <path stroke-linecap="round" d="M24 44h20"/>
          </g>
        </svg>
      `;

      // Создаем элемент меню
      var menuItem = document.createElement('li');
      menuItem.className = 'menu__item selector';
      menuItem.setAttribute('data-action', 'ru_movie');
      menuItem.innerHTML = `<div class="menu__ico">${menuIcon}</div><div class="menu__text">Русское</div>`;

      // Простые пункты подменю
      var menuOptions = [
        { title: 'Русские фильмы' },
        { title: 'Русские сериалы' },
        { title: 'Русские мультфильмы' },
        { title: 'Start' },
        { title: 'Premier' },
        { title: 'СТС' },
        { title: 'ИВИ' },
        { title: 'KION' },
        { title: 'КиноПоиск' },
        { title: 'Wink' },
        { title: 'OKKO' },
        { title: 'ТНТ' },
      ];

      // Обработчик события
      menuItem.addEventListener('mouseenter', function () {
        console.log('Наведение на пункт "Русское"');
        try {
          Lampa.Select.show({
            title: Lampa.Lang.translate('settings_rest_source'),
            items: menuOptions,
            onSelect: function (item) {
              console.log('Выбран пункт:', item.title);
              var currentDate = new Date().toISOString().slice(0, 10);
              if (item.title === 'Русские фильмы') {
                Lampa.Activity.push({
                  url: `discover/movie?vote_average.gte=5&vote_average.lte=9&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
                  title: 'Русские фильмы',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'Русские сериалы') {
                Lampa.Activity.push({
                  url: 'discover/tv?&with_original_language=ru',
                  title: 'Русские сериалы',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                  sort_by: 'first_air_date.desc',
                });
              } else if (item.title === 'Русские мультфильмы') {
                Lampa.Activity.push({
                  url: `discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${currentDate}`,
                  title: 'Русские мультфильмы',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'Start') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=1191&sort_by=first_air_date.desc',
                  title: 'Start',
                  networks: '1191',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'Premier') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=2859&sort_by=first_air_date.desc',
                  title: 'Premier',
                  networks: '2859',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'СТС') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=4085&sort_by=first_air_date.desc',
                  title: 'СТС',
                  networks: '4085',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'ИВИ') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=2493&sort_by=first_air_date.desc',
                  title: 'ИВИ',
                  networks: '2493',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'KION') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=3871&sort_by=first_air_date.desc',
                  title: 'KION',
                  networks: '3871',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'КиноПоиск') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=3827&sort_by=first_air_date.desc',
                  title: 'КиноПоиск',
                  networks: '3827',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'Wink') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=5806&sort_by=first_air_date.desc',
                  title: 'Wink',
                  networks: '5806',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'OKKO') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=806&sort_by=first_air_date.desc',
                  title: 'OKKO',
                  networks: '806',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              } else if (item.title === 'ТНТ') {
                Lampa.Activity.push({
                  url: 'discover/tv?with_networks=3923&sort_by=first_air_date.desc',
                  title: 'ТНТ',
                  networks: '3923',
                  sort_by: 'first_air_date.desc',
                  component: 'category_full',
                  source: 'tmdb',
                  card_type: 'true',
                  page: 1,
                });
              }
            },
            onBack: function () {
              Lampa.Controller.toggle('menu');
            },
          });
        } catch (e) {
          console.error('Ошибка в обработчике hover:enter:', e);
        }
      });

      // Альтернативный способ добавления в меню
      try {
        var menuList = document.querySelector('.menu .menu__list');
        if (menuList) {
          menuList.appendChild(menuItem);
          console.log('Пункт "Русское" успешно добавлен через appendChild');
        } else {
          console.error('Элемент .menu .menu__list не найден');
          // Попробуем добавить через другой селектор
          var alternativeMenu = document.querySelector('.menu');
          if (alternativeMenu) {
            alternativeMenu.appendChild(menuItem);
            console.log('Пункт "Русское" добавлен в .menu как запасной вариант');
          } else {
            console.error('Не удалось найти подходящий контейнер для меню');
          }
        }
      } catch (e) {
        console.error('Ошибка при добавлении пункта меню:', e);
      }
    }

    if (window.appready) {
      console.log('Приложение готово, вызываем addCustomMenu');
      addCustomMenu();
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          console.log('Событие app ready, вызываем addCustomMenu');
          addCustomMenu();
        }
      });
    }
  })();
})();
