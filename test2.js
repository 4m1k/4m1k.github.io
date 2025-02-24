(function(){
  'use strict';

  console.log('KP button minimal test started');

  // Иконка для кнопки "Кинопоиск" (можно заменить на нужную)
  var iconKP = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <rect x="6" y="10" width="36" height="22" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="4"/>
      <path fill="currentColor" d="M24 32v8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path fill="currentColor" d="M16 40h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;

  // Функция для добавления кнопки в меню (аналог вашего примера)
  function addMenuButton(newItemAttr, newItemText, iconHTML, onEnterHandler) {
    var field = $(`
      <li class="menu__item selector" ${newItemAttr}>
        <div class="menu__ico">${iconHTML}</div>
        <div class="menu__text">${newItemText}</div>
      </li>
    `);
    field.on('hover:enter', function(){
      try {
        onEnterHandler();
      } catch(e) {
        console.error('Ошибка в обработчике кнопки:', e);
      }
    });
    if(window.appready){
      Lampa.Menu.render().find('[data-action="tv"]').after(field);
    } else {
      Lampa.Listener.follow('app', function(event){
        if(event.type === 'ready'){
          Lampa.Menu.render().find('[data-action="tv"]').after(field);
        }
      });
    }
  }

  // Минимальная функция для открытия окна с тестовым содержимым
  function openKPWindow(){
    try {
      Lampa.Popup.open({
        title: 'Кинопоиск',
        html: '<div>Тестовое окно</div>',
        mask: true,
        onBack: function(){
          Lampa.Popup.close();
        }
      });
    } catch(e) {
      console.error('Ошибка открытия Popup:', e);
    }
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
})();
