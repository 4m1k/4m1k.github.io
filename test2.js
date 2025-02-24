(function(){
  'use strict';

  console.log('KP minimal test started');

  // Ждем события готовности приложения
  Lampa.Listener.follow('app', function(e){
    if(e.type === 'ready'){
      console.log('App is ready');
      
      // Проверяем, доступно ли меню
      var menu = Lampa.Menu.render();
      if(!menu || !menu.length){
         console.error('Lampa.Menu.render() returned nothing');
         return;
      }
      console.log('Menu found:', menu);

      // Создаем кнопку "Кинопоиск"
      var button = $(`
        <li class="menu__item selector" data-action="kp">
          <div class="menu__ico">[KP]</div>
          <div class="menu__text">Кинопоиск</div>
        </li>
      `);
      
      button.on('hover:enter', function(){
        try{
          console.log('KP button pressed');
          if(Lampa.Popup && typeof Lampa.Popup.open === 'function'){
            Lampa.Popup.open({
              title: 'Кинопоиск',
              html: '<div>Test Popup</div>',
              mask: true,
              onBack: function(){
                Lampa.Popup.close();
              }
            });
            console.log('Popup opened');
          } else {
            console.error('Lampa.Popup.open not found');
          }
        } catch(err){
          console.error('Error in button handler:', err);
        }
      });
      
      // Добавляем кнопку после элемента с data-action="tv", если он найден
      var tvItem = menu.find('[data-action="tv"]');
      if(tvItem.length){
        tvItem.after(button);
        console.log('KP button added after tv item');
      } else {
        menu.append(button);
        console.log('KP button added at end of menu');
      }
    }
  });
})();
