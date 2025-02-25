(function(){
  'use strict';

  // Для корректной работы на ТВ-устройствах
  Lampa.Platform.tv();

  // Селектор для кнопки "TV", после которой вставим нашу
  var ITEM_TV_SELECTOR = '[data-action="tv"]';
  var ITEM_MOVE_TIMEOUT = 2000;

  /**
   * Функция "перекидывания" кнопки в меню — вставляем после TV
   */
  function moveItemAfter(item, after) {
    return setTimeout(function() {
      $(item).insertAfter($(after));
    }, ITEM_MOVE_TIMEOUT);
  }

  /**
   * Функция для добавления кнопки в главное меню Lampa
   * @param {String} newItemAttr    например: data-action="kp"
   * @param {String} newItemText    текст кнопки
   * @param {String} iconHTML       HTML-строка с иконкой (svg)
   * @param {Function} onEnter      что делать при нажатии
   */
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnter) {
    var NEW_ITEM_SELECTOR = '[' + newItemAttr + ']';
    var field = $(`
      <li class="menu__item selector" ${newItemAttr}>
        <div class="menu__ico">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);

    field.on('hover:enter', onEnter);

    // Вставляем кнопку
    function doInsert() {
      Lampa.Menu.render().find(ITEM_TV_SELECTOR).after(field);
      moveItemAfter(NEW_ITEM_SELECTOR, ITEM_TV_SELECTOR);
    }

    // Если приложение уже готово — сразу
    if (window.appready) {
      doInsert();
    } else {
      // Иначе ждём событие "app: ready"
      Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
          doInsert();
        }
      });
    }
  }

  // Иконка «Кинопоиск» (пример с буквой «K» в квадрате)
  var iconKP = `
    <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
      <g fill="none" fill-rule="evenodd">
        <g fill="currentColor" fill-rule="nonzero">
          <path fill-rule="evenodd"
            d="M20,4H172A16,16 0 0 1 188,20V172A16,16 0 0 1 172,188H20A16,16 0 0 1 4,172V20A16,16 0 0 1 20,4ZM20,18H172A2,2 0 0 1 174,20V172A2,2 0 0 1 172,174H20A2,2 0 0 1 18,172V20A2,2 0 0 1 20,18Z"
          />
          <g transform="translate(-10.63, 0)">
            <path
              d="M96.5 20 L66.1 75.733 V20 H40.767 v152 H66.1 v-55.733 L96.5 172 h35.467
                 C116.767 153.422 95.2 133.578 80 115
                 c28.711 16.889 63.789 35.044 92.5 51.933
                 v-30.4
                 C148.856 126.4 108.644 115.133 85 105
                 c23.644 3.378 63.856 7.889 87.5 11.267
                 v-30.4
                 L85 90
                 c27.022-11.822 60.478-22.711 87.5-34.533
                 v-30.4
                 C143.789 41.956 108.711 63.11 80 80
                 L131.967 20 z"
            />
          </g>
        </g>
      </g>
    </svg>
  `;

  // Массив категорий с их URL + (для иконок) укажем iconSVG
  var categories = [
    {
      title: 'Популярные Фильмы',
      url: 'api/v2.2/films/top?type=TOP_100_POPULAR_FILMS',
      iconSVG: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path stroke="currentColor" stroke-width="1.5"
              d="M22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16v-4c0-2.828 0-4.243.879-5.121C3.757 6 5.172 6 8 6h8c2.828 0 4.243 0 5.121.879C22 7.757 22 9.172 22 12z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
              d="m9 2l3 3.5L15 2m1 4v16"/>
            <path fill="currentColor"
              d="M20 16a1 1 0 1 0-2 0a1 1 0 0 0 2 0m0-4a1 1 0 1 0-2 0a1 1 0 0 0 2 0"/>
          </g>
        </svg>
      `
    },
    {
      title: 'Топ Фильмы',
      url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS',
      iconSVG: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path stroke="currentColor" stroke-width="1.5"
              d="M22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16v-4c0-2.828 0-4.243.879-5.121C3.757 6 5.172 6 8 6h8c2.828 0 4.243 0 5.121.879C22 7.757 22 9.172 22 12z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
              d="m9 2l3 3.5L15 2m1 4v16"/>
            <path fill="currentColor"
              d="M20 16a1 1 0 1 0-2 0a1 1 0 0 0 2 0m0-4a1 1 0 1 0-2 0a1 1 0 0 0 2 0"/>
          </g>
        </svg>
      `
    },
    {
      title: 'Популярные российские фильмы',
      url: 'api/v2.2/films?order=NUM_VOTE&countries=34&type=FILM',
      iconSVG: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path stroke="currentColor" stroke-width="1.5"
              d="M22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16v-4c0-2.828 0-4.243.879-5.121C3.757 6 5.172 6 8 6h8c2.828 0 4.243 0 5.121.879C22 7.757 22 9.172 22 12z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
              d="m9 2l3 3.5L15 2m1 4v16"/>
            <path fill="currentColor"
              d="M20 16a1 1 0 1 0-2 0a1 1 0 0 0 2 0m0-4a1 1 0 1 0-2 0a1 1 0 0 0 2 0"/>
          </g>
        </svg>
      `
    },
    {
      title: 'Популярные российские сериалы',
      url: 'api/v2.2/films?order=NUM_VOTE&countries=34&type=TV_SERIES',
      iconSVG: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path stroke="currentColor" stroke-width="1.5"
              d="M22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16v-4c0-2.828 0-4.243.879-5.121C3.757 6 5.172 6 8 6h8c2.828 0 4.243 0 5.121.879C22 7.757 22 9.172 22 12z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
              d="m9 2l3 3.5L15 2m1 4v16"/>
            <path fill="currentColor"
              d="M20 16a1 1 0 1 0-2 0a1 1 0 0 0 2 0m0-4a1 1 0 1 0-2 0a1 1 0 0 0 2 0"/>
          </g>
        </svg>
      `
    },
    {
      title: 'Популярные российские мини-сериалы',
      url: 'api/v2.2/films?order=NUM_VOTE&countries=34&type=MINI_SERIES',
      iconSVG: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path stroke="currentColor" stroke-width="1.5"
              d="M22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16v-4c0-2.828 0-4.243.879-5.121C3.757 6 5.172 6 8 6h8c2.828 0 4.243 0 5.121.879C22 7.757 22 9.172 22 12z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
              d="m9 2l3 3.5L15 2m1 4v16"/>
            <path fill="currentColor"
              d="M20 16a1 1 0 1 0-2 0a1 1 0 0 0 2 0m0-4a1 1 0 1 0-2 0a1 1 0 0 0 2 0"/>
          </g>
        </svg>
      `
    },
    {
      title: 'Популярные Сериалы',
      url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SERIES',
      iconSVG: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path stroke="currentColor" stroke-width="1.5"
              d="M22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16v-4c0-2.828 0-4.243.879-5.121C3.757 6 5.172 6 8 6h8c2.828 0 4.243 0 5.121.879C22 7.757 22 9.172 22 12z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
              d="m9 2l3 3.5L15 2m1 4v16"/>
            <path fill="currentColor"
              d="M20 16a1 1 0 1 0-2 0a1 1 0 0 0 2 0m0-4a1 1 0 1 0-2 0a1 1 0 0 0 2 0"/>
          </g>
        </svg>
      `
    },
    {
      title: 'Популярные Телешоу',
      url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW',
      iconSVG: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path stroke="currentColor" stroke-width="1.5"
              d="M22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16v-4c0-2.828 0-4.243.879-5.121C3.757 6 5.172 6 8 6h8c2.828 0 4.243 0 5.121.879C22 7.757 22 9.172 22 12z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
              d="m9 2l3 3.5L15 2m1 4v16"/>
            <path fill="currentColor"
              d="M20 16a1 1 0 1 0-2 0a1 1 0 0 0 2 0m0-4a1 1 0 1 0-2 0a1 1 0 0 0 2 0"/>
          </g>
        </svg>
      `
    }
  ];

  // Добавляем кнопку «Кинопоиск» в главное меню
  addMenuButton(
    'data-action="kp"',
    'Кинопоиск',
    iconKP,
    function() {
      // При нажатии показываем Select.show()
      Lampa.Select.show({
        title: 'Кинопоиск',
        items: categories.map(function(cat){
          // Возвращаем объект, понятный для Select
          // title берём как есть, onSelect тоже можно, но проще "onSelect" на весь Select.show()
          return {
            title: cat.title,
            url: cat.url,
            // subtitle: '', // можно добавить, если надо
            // Сразу же отключим встроенный вызов push — сделаем вручную
            noenter: true
          };
        }),
        onSelect: function(item){
          // Нажали Enter на одном из пунктов
          // Идём в category_full
          Lampa.Activity.push({
            url: item.url,
            title: item.title,
            component: 'category_full',
            source: 'cp',  // <-- ваш источник, который умеет api/v2.2/films
            card_type: true,
            page: 1
          });
        },
        onBack: function(){
          Lampa.Controller.toggle('menu');
        }
      });

      // ----
      // Пост-обработка через небольшой таймаут,
      // чтобы вставить иконку + класс "menu__text" вместо простого текста
      // ----
      setTimeout(function(){
        var domItems = document.querySelectorAll('.selectbox .select__item'); // все пункты
        domItems.forEach(function(domItem, i){
          if(i < categories.length){
            var cat = categories[i];
            // Создаём враппер
            var wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';

            // Блок с иконкой
            var iconDiv = document.createElement('div');
            iconDiv.style.width = '1.8em';
            iconDiv.style.height= '1.3em';
            iconDiv.style.paddingRight = '.5em';
            iconDiv.innerHTML = cat.iconSVG;

            // Блок с текстом (menu__text)
            var textDiv = document.createElement('div');
            textDiv.classList.add('menu__text');
            textDiv.textContent = cat.title;

            // Складываем
            wrapper.appendChild(iconDiv);
            wrapper.appendChild(textDiv);

            // Находим родной .select__item-name и зачищаем
            var nameElem = domItem.querySelector('.select__item-name');
            if(nameElem){
              nameElem.innerHTML = '';
              nameElem.appendChild(wrapper);
            }
          }
        });
      },100);

      console.log("Нажата кнопка Кинопоиск");
    }
  );

})();
