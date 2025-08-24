(function () {
  'use strict';

  Lampa.Platform.tv();
  
  
  // Включает программную обработку m3u8 если устройсвто его не поддерживает, в частности актуально для кинопаб
//   if (!Lampa.Storage.get('player_hls_method')) {
//       var obj = document.createElement("video");
//       var canHlsValue = obj.canPlayType("application/vnd.apple.mpegurl")

//       if (!canHlsValue || canHlsValue === 'maybe') {
//         Lampa.Storage.set('player_hls_method', 'hlsjs')
//       }
//   }
 
  // Вынесенные параметры
var apiKey = "4ef0d7355d9ffb5151e987764708ce96";
var apiProxyUrl = "https://lampa.maxvol.pro/proxy/"; // Прокси для API
var imgProxyUrl = "https://lampa.maxvol.pro/proxyimg/"; // Прокси для изображений

Lampa.Listener.follow("full", function(a) {
    if (a.type === "complite") {
        var e = a.data.movie;
        var urlType = e.name ? "tv" : "movie"; // Определяем тип

        var o = apiProxyUrl + "http://api.themoviedb.org/3/" + urlType + "/" + e.id + "/images?api_key=" + apiKey + "&language=" + Lampa.Storage.get("language");

        $.get(o, function(response) {
            if (response.logos && response.logos[0]) {
                var logoPath = response.logos[0].file_path;
                if (logoPath !== "") {
                    $(".full-start-new__title").html(
                        '<img style="margin-top: 5px; max-height: 125px;" src="' + imgProxyUrl + "http://image.tmdb.org/t/p/w500" + logoPath.replace(".svg", ".png") + '" />'
                    );
                }
            }
        });
    }
});

  
//   function fixSisi() {
//     var plugins = Array.isArray(Lampa.Storage.get('plugins')) ? Lampa.Storage.get('plugins') : [];
//     var fixedPlugins = plugins.map(function (obj) {
//       if (obj.url === 'http://45.67.228.34/sisi.js') {
//           obj.url = '/sisi.js'
//       };
      
//       return obj
//     });
//     Lampa.Storage.set('plugins', fixedPlugins);
//   }

// TODO удалить
    // fixSisi()
 // if (Lampa.Platform.is('android')) Lampa.Storage.set('internal_torrclient', true);
  // Lampa.Storage.set('torrserver_use_link', 'one');
  // Lampa.Storage.set('torrserver_url', 'http://95.165.134.227:5550');
  // Lampa.Storage.set('torrserver_url', location.protocol + '//tor.ab2024.ru');

// Список скриптов, которые нужно загружать, если пользователь авторизован и оплачен
window.abScriptList = [
    '/text1.js?v=' + Math.random(),
].concat(Lampa.Storage.field('SISI_fix') == 2 ? ['/sisi.js?v=' + Math.random()] : []) 

  /*Запуск сторонних плагинов*/
  Lampa.Utils.putScriptAsync(['/online.js?v=' + Math.random()], function () {
    window.lampac_localhost = '//' + location.hostname + '/';
    Lampa.Utils.putScriptAsync(['/ab.js?v=' + Math.random()], function() {})
  });
  Lampa.Utils.putScriptAsync(
    [
      '/tmdbproxy.js?v=' + Math.random(),
    //   '/metrika.js',
    //   '/guide.js',
    //   '/text1.js',
    //  '/jackett.js',
    //   '//cub.abmsx.tech/plugin/collections',
    //   '//cub.abmsx.tech/plugin/tracks',
//      '/torrserver.js',
    //  '/qual.js',
    //  '//lampame.github.io/main/music.js'
    ],
    function () {}
  );

  /*Удаляем ненужное из меню настроек*/

  window.lampa_settings.torrents_use = true;
  // window.lampa_settings.plugins_use = false;
  window.lampa_settings.account_use = false;
  Lampa.Settings.listener.follow('open', function (e) {
    if (e.name == 'main') {
      setTimeout(function () {
        $('div[data-component="my_iptv"]').remove();
        $('div[data-component="sisi"]').remove();
        $('div[data-component="my_iptv2"]').remove();
      }, 5);
    }
  });
  /*Удаляем верхние кнопки*/

  setTimeout(function () {
    $('.open--feed').remove();
    $('.open--premium').remove();
  }, 1000);

  /*Ставим Cub источником по умолчанию,клавиатуру системную,а безопасное соединение - нет*/

  Lampa.Storage.set('source', 'cub');
  Lampa.Storage.set('keyboard_type', 'integrate');
  Lampa.Storage.set('protocol', 'http');
  Lampa.Storage.set('parser_use', 'false');

  /*Удаляем ненужное из главного меню*/

  Lampa.Listener.follow('app', function (e) {
    if (e.type == 'ready') {
      setTimeout(function () {
        //                        $("[data-action=anime]").eq(0).remove();
        $('[data-action=relise]').eq(0).remove();
        $('[data-action=mytorrents]').eq(0).remove();
        $('[data-action=about]').eq(0).remove();
        // $('[data-action=console]').eq(0).remove();
        $('[data-action=feed]').eq(0).remove();
        $('[data-action=subscribes]').eq(0).remove();
      }, 10);
    }
  });

  /*Заменяем иконки и названия в кнопках Онлайн и Трейлеры
               Убираем кнопки из раздела смотреть*/

  //  Lampa.Listener.follow('full', function(e) {
  //  if (e.type == 'complite') {
  //  setTimeout(function(){
  //	 $('.button--subscribe').remove();
  //     $('.view--online').insertBefore($('.button--play'));
  //       $('.view--trailer').insertBefore($('.button--play'));
  //     $('.view--torrent').insertBefore($('.button--play'));
  //	 $('.button--play').remove();
  //  $(".view--trailer", Lampa.Activity.active().activity.render()).empty().append("<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><g><path d='m31.77 234.14c-3.12-3.22-2.66-128.58 0-132 1.83-2.34 186.58-2.34 190.26 0 3.4 2.16 2.48 129.93 0 132-5.5 4.55-186.38 4-190.26 0z' fill='#191919'/><path d='m130.77 245.35h-4.49c-24.1 0-46.88-.35-64.17-.88-32.45-1-33.59-2.18-36.09-4.75s-4.54-4.72-4.42-71.52c0-16.69.25-32.56.61-44.68.69-23 1.49-24 3.26-26.29 2.61-3.34 6.09-3.48 14.52-3.83 5.12-.21 12.4-.4 21.63-.55 17.1-.28 40-.44 64.59-.44s47.61.16 64.93.44c32 .52 32.85 1.08 35.18 2.56 4 2.53 4.44 6.86 4.95 14.94 1 16.3 1.11 49.25.87 72.51-.56 53.77-1.68 54.7-5 57.45-2.44 2-4.06 3.36-36.37 4.32-16.06.46-37.23.72-60 .72zm-92.05-18c26.43 2.62 150.17 2.66 176.21.07 1.41-20.23 2-97 .31-118-27.17-1.42-148.84-1.42-176.47 0-1.58 21.46-1.62 98-.05 117.93z' fill='#191919'/></g><g><path d='m31.77 234.14c-3.12-3.22-2.66-128.58 0-132 1.83-2.34 186.58-2.34 190.26 0 3.4 2.16 2.48 129.93 0 132-5.5 4.55-186.38 4-190.26 0z' fill='#e83a2a'/></g><path d='m223.21 123.51c.74-1.1.94-31.2-1-32-5.6-2.46-186.21-2.29-190.8.49-1.74 1-1.88 30.31-1.1 31.55s192.16 1.06 192.9-.04z' fill='#191919'/><path d='m120.37 132.4c-28.37 0-57.78-.1-75.37-.4-4.73-.07-8.4-.15-10.92-.23-4.74-.16-8.17-.27-10.53-4-1.15-1.83-1.85-2.94-1.65-18 .08-6.37.37-14.77 1.29-18.61a9.26 9.26 0 0 1 4.13-6.05c2.23-1.34 3.46-2.08 34.93-2.73 17-.35 39.77-.57 64.21-.62 24.07 0 46.95.08 64.39.36 31.12.49 32.73 1.19 34.58 2a8.75 8.75 0 0 1 4.92 5.88c.32 1.1 1.31 4.43 1.39 19.28.08 15.72-.65 16.83-1.88 18.66-2.42 3.61-5.14 3.68-12.43 3.86-3.69.09-9 .18-15.88.25-12.8.14-30.33.24-50.71.3-9.57.04-19.94.05-30.47.05zm-82.52-16.48c29.32.63 148.34.59 177.85-.05.09-5.19 0-12.37-.26-17.08-27.44-1.5-150.44-1.22-177.2.41-.3 4.63-.43 11.64-.39 16.72z' fill='#191919'/><path d='m223.21 123.51c.74-1.1.94-31.2-1-32-5.6-2.46-186.21-2.29-190.8.49-1.74 1-1.88 30.31-1.1 31.55s192.16 1.06 192.9-.04z' fill='#fff'/><path d='m28.25 125.61s38.89-36.44 38.35-37.61c-.79-1.66-38-1.52-38.84-.43s-6.56 40.6.49 38.04z' fill='#191919'/><path d='m221.34 51.57c.57-1.2-3.72-29.95-5.73-30.48-5.92-1.58-184.88 24.52-189.04 27.91-1.57 1.32 2.6 30.29 3.56 31.4s190.65-27.63 191.21-28.83z' fill='#191919'/><path d='m30.56 88.4a7.85 7.85 0 0 1 -6.51-2.79c-1.4-1.61-2.25-2.61-4.28-17.56-.86-6.31-1.81-14.67-1.47-18.6a9.26 9.26 0 0 1 3.19-6.6c2-1.66 3.13-2.57 34.23-7.75 16.74-2.79 39.31-6.28 63.55-9.84 23.84-3.5 46.52-6.66 63.87-8.9 30.9-4 32.58-3.53 34.53-3a8.81 8.81 0 0 1 5.78 5.13c1.29 2.78 2.71 8.93 4.22 18.28 2.42 15 1.85 16.23.9 18.23-1.86 3.92-4.4 4.37-11.93 5.69-3.76.66-9.21 1.57-16.2 2.7-13.08 2.11-30.91 4.9-51.56 8.06-36.08 5.55-82.61 12.45-105.23 15.48-4 .54-7.1.93-9.23 1.17a35 35 0 0 1 -3.86.3zm3.83-33.23c.38 4.63 1.29 11.55 2.08 16.56 29.15-3.73 147.12-21.54 176.29-26.59-.68-4.9-1.79-11.49-2.74-15.85-27.27 2.43-149.27 20.41-175.63 25.88z' fill='#191919'/><path d='m221.34 51.57c.57-1.2-3.72-29.95-5.73-30.48-5.92-1.58-184.88 24.52-189.04 27.91-1.57 1.32 2.6 30.29 3.56 31.4s190.65-27.63 191.21-28.83z' fill='#fff'/><path d='m26.57 49s40.36 28.35 40 29.57c-.53 1.76-37.35 7.09-38.35 6.13s-9.01-37.16-1.65-35.7z' fill='#191919'/><path d='m64.63 38.94c-.18 1 43.79 34.37 46 34l37.83-5.62c1.92-.29-44.9-35.19-47.14-34.86s-36.51 5.47-36.69 6.48z' fill='#191919'/><path d='m142.53 27.36c-.18 1 43.79 34.37 46 34l37.83-5.62c1.92-.29-44.9-35.19-47.14-34.86s-36.51 5.48-36.69 6.48z' fill='#191919'/><path d='m70.55 125.77c-.32-1 38.25-40.43 40.51-40.43h38.25c1.94 0-39.22 41.4-41.49 41.4s-36.95 0-37.27-.97z' fill='#191919'/><path d='m149.31 125.77c-.32-1 38.25-40.43 40.51-40.43s34.36.65 34.36 2.59c0 .65-35.33 38.82-37.6 38.82s-36.95-.01-37.27-.98z' fill='#191919'/><g><path d='m129.27 217.89c-15.12 0-30.17-.12-41.29-.32-20.22-.37-20.88-.8-22.06-1.57-1.94-1.25-2.44-3.15-2.83-10.66-.34-6.72-.44-17.33-.24-27 .37-18.14 1.21-18.82 2.74-20 1.37-1.1 1.48-1.19 21-1.39 10.56-.11 24.73-.17 39.89-.17 58.31 0 59.89.63 60.73 1 2.82 1.13 3.22 3.93 3.58 11.09.33 6.65.4 17.33.17 27.21-.11 4.76-.28 8.87-.49 11.87-.33 4.81-.6 7.17-2.91 8.37-1.05.43-3.25 1.57-58.29 1.57z' fill='#fff'/><path d='m126.48 160.7c29 0 58.11.23 59.25.68 2.1.84 1.54 50.47 0 51.27s-28.7 1.25-56.45 1.25c-29.58 0-59.95-.44-61.19-1.25-1.93-1.25-1.65-49.94 0-51.27.57-.45 29.41-.68 58.39-.68m0-8c-15.18 0-29.36.06-39.94.17-5.71.06-10.21.13-13.38.22-5.82.15-7.78.2-10.09 2.06-3.18 2.56-3.44 6.28-3.76 11-.21 3.08-.37 7.26-.47 12.11-.2 9.8-.1 20.53.25 27.33.33 6.48.57 11.15 4.65 13.79 2.21 1.43 2.8 1.81 24.17 2.21 11.14.21 26.22.32 41.37.32 14.62 0 28.17-.11 38.17-.3 19.15-.38 20.09-.87 22-1.84 4.4-2.29 4.72-6.83 5.05-11.64.21-3.06.38-7.22.5-12 .23-10 .16-20.75-.18-27.5-.13-2.55-.29-4.53-.49-6-.25-1.83-.9-6.7-5.6-8.57-1.69-.67-2.2-.88-22.07-1.08-10.71-.11-25-.17-40.15-.17z' fill='#191919'/></g><path d='m83.5 173.88c-5.25 0-5.5 7.75-.5 8.13s79.38.38 82.88 0 5.25-7.5-.37-7.87-75.51-.26-82.01-.26z' fill='#191919'/><path d='m83.5 190.38c-5.25 0-5.5 7.75-.5 8.13s43.38.38 46.88 0 5.25-7.5-.37-7.87-39.51-.26-46.01-.26z' fill='#191919'/></svg>Трейлеры");
  //	 $(".view--online", Lampa.Activity.active().activity.render()).empty().append('<svg viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32"><path d="m17 14.5 4.2-4.5L4.9 1.2c-.1-.1-.3-.1-.6-.2L17 14.5zM23 21l5.9-3.2c.7-.4 1.1-1 1.1-1.8s-.4-1.5-1.1-1.8L23 11l-4.7 5 4.7 5zM2.4 1.9c-.3.3-.4.7-.4 1.1v26c0 .4.1.8.4 1.2L15.6 16 2.4 1.9zM17 17.5 4.3 31c.2 0 .4-.1.6-.2L21.2 22 17 17.5z" fill="currentColor" fill="#ffffff" class="fill-000000"></path></svg>Начать просмотр');
  //   },10);
  //   }
  //  })

  /*Загружаем плагин радио в зависимости от платформы*/

  if (Lampa.Platform.is('android') || Lampa.Platform.is('tizen')) {
    Lampa.Utils.putScriptAsync(['//cub.red/plugin/radio'], function () {});
  } else {
    // Lampa.Utils.putScriptAsync(['//lampame.github.io/main/rradio.js'], function () {});
    Lampa.Utils.putScriptAsync(['/radio.js'], function () {});
  }

  if (Lampa.Platform.screen('mobile')) {
    Lampa.Storage.set('video_quality_default', '1080');
  } else {
    Lampa.Storage.set('video_quality_default', '2160');
  }

  /*  Принудительный выбор плеера*/

  if (!Lampa.Storage.get('player_def')) {
    Lampa.Storage.set('player', 'inner');
    Lampa.Storage.set('player_iptv', 'inner');
    if (Lampa.Platform.is('apple')) {
      Lampa.Storage.set('player_iptv', 'ios');
      Lampa.Storage.set('player', 'ios');
    }
    Lampa.Storage.set('player_def', true);
  }
  /*Добавление раздела 18+ и ТВ плагина*/

  Lampa.SettingsApi.addComponent({
    component: 'ero',
    name: '18+',
    icon: '<svg width="256px" height="256px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione-monotone" preserveAspectRatio="xMidYMid meet" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M51.348 15.912c-3.332-3.347-7.33-4.796-11.498-4.796c-.359 0-.721.016-1.08.038C37.734 6.492 36.295 2 36.295 2s-6.291 3.991-9.97 7.716c-4.255-3.327-9.149-6.391-9.149-6.391s-1.044 7.646-.678 13.247c-5.577-.361-13.188.692-13.188.692s3.051 4.912 6.368 9.185C5.97 30.146 2 36.47 2 36.47s4.646 1.497 9.382 2.538c-.159 4.421 1.261 8.681 4.776 12.213C23.599 58.692 36.494 62 46.373 62c5.729-.001 10.445-1.113 12.492-3.17c5.522-5.549 4.184-31.161-7.517-42.918m6.074 41.482c-1.236 1.242-4.789 2.57-11.049 2.571c-9.275 0-21.77-3.147-28.771-10.18c-8.058-8.096-3.363-20.183 4.41-27.987c5.389-5.413 12.057-8.646 17.838-8.646c3.9.001 7.283 1.411 10.055 4.198c4.908 4.93 8.424 13.172 9.643 22.61c1.147 8.891-.2 15.499-2.126 17.434" fill="#ffffff"></path><path d="M40.172 18.321c.578.403 1.215.606 1.771.607c.541 0 1.006-.19 1.271-.573c.545-.775.063-2.052-1.072-2.848c-.58-.405-1.215-.607-1.773-.607c-.539 0-1.006.19-1.273.572c-.543.776-.063 2.054 1.076 2.849" fill="#ffffff"></path><path d="M44.074 32.729a1.34 1.34 0 0 0-.891.31c-.715.621-.557 1.976.352 3.025c.604.695 1.389 1.081 2.057 1.08c.34.001.65-.099.891-.309c.717-.621.557-1.975-.352-3.024c-.604-.696-1.387-1.081-2.057-1.082" fill="#ffffff"></path><path d="M35.293 23.932a1.306 1.306 0 0 0-.865.294c-.727.609-.592 1.968.303 3.031c.602.715 1.391 1.114 2.064 1.115c.33 0 .629-.097.867-.295c.727-.61.59-1.966-.303-3.033c-.601-.714-1.392-1.113-2.066-1.112" fill="#ffffff"></path><path d="M52.404 26.469c-.518-.945-1.369-1.53-2.111-1.53a1.264 1.264 0 0 0-.604.148c-.832.456-.967 1.813-.301 3.032c.52.945 1.367 1.529 2.111 1.529c.213 0 .418-.047.604-.148c.833-.455.967-1.812.301-3.031" fill="#ffffff"></path><path d="M54.955 38.393c-.102 0-.203.014-.303.039c-.918.24-1.379 1.521-1.027 2.866c.313 1.198 1.162 2.037 1.994 2.038c.102 0 .203-.013.303-.038c.918-.239 1.379-1.523 1.027-2.868c-.312-1.196-1.164-2.037-1.994-2.037" fill="#ffffff"></path><path d="M53.76 51.021c-.354.001-.674.105-.918.327c-.703.636-.518 1.987.414 3.019c.607.671 1.381 1.038 2.041 1.039c.354-.001.676-.106.922-.329c.701-.636.516-1.987-.418-3.017c-.606-.669-1.379-1.039-2.041-1.039" fill="#ffffff"></path><path d="M32.923 50.042c-.569-.384-1.189-.573-1.736-.572c-.559 0-1.041.198-1.309.598c-.527.788-.02 2.054 1.135 2.825c.57.383 1.191.573 1.736.573c.561 0 1.042-.2 1.309-.6c.528-.786.02-2.053-1.135-2.824" fill="#ffffff"></path><path d="M21.165 46.683c-.569-.382-1.189-.571-1.735-.571c-.561 0-1.042.199-1.309.597c-.527.787-.02 2.055 1.134 2.825c.57.382 1.191.574 1.738.573c.559 0 1.041-.199 1.307-.6c.526-.786.02-2.052-1.135-2.824" fill="#ffffff"></path><path d="M42.547 54.622a3.435 3.435 0 0 0-1.275-.259c-.797-.001-1.463.326-1.701.91c-.354.877.404 2.013 1.691 2.531c.434.175.871.258 1.275.257c.797 0 1.465-.324 1.699-.908c.356-.878-.4-2.012-1.689-2.531" fill="#ffffff"></path><path d="M45.164 44.696c-.543-.323-1.119-.481-1.633-.481c-.617-.001-1.143.229-1.406.672c-.486.814.09 2.053 1.283 2.763c.543.322 1.119.48 1.635.48c.615 0 1.141-.229 1.404-.672c.485-.816-.09-2.054-1.283-2.762" fill="#ffffff"></path><path d="M34.568 37.753c-.602-.5-1.295-.758-1.895-.757c-.465-.001-.873.155-1.138.474c-.604.729-.229 2.042.839 2.928c.603.498 1.297.758 1.897.758c.465 0 .871-.156 1.137-.475c.604-.73.231-2.043-.84-2.928" fill="#ffffff"></path><path d="M23.867 23.223c-.385.001-.73.119-.982.368c-.676.665-.434 2.008.539 2.997c.611.618 1.364.953 2.009.954c.384-.001.729-.119.981-.368c.676-.666.435-2.008-.539-2.996c-.612-.621-1.364-.954-2.008-.955" fill="#ffffff"></path><path d="M22.812 34.974c-.598-.473-1.275-.716-1.863-.715c-.484 0-.909.163-1.175.5c-.589.741-.184 2.046.904 2.906c.598.474 1.276.715 1.864.715c.484 0 .908-.161 1.174-.499c.587-.742.184-2.045-.904-2.907" fill="#ffffff"></path></g></svg>',
  });
  Lampa.SettingsApi.addParam({
    component: 'ero',
    param: {
      name: 'SISI_fix',
      type: 'select',
      values: {
        1: 'Да',
        2: 'Нет',
      },
      default: '1',
    },
    field: {
      name: 'Удалить плагин 18+ в главном меню',
      //Название подпункта меню
      description: 'Нажмите для выбора, после этого приложение будет перезагружено', //Комментарий к подпункту
    },
    onChange: function (value) {
      if (Lampa.Storage.field('SISI_fix') == 2) {
        //$('#app > div.wrap.layer--height.layer--width > div.wrap__left.layer--height > div > div > div > div > div:nth-child(1) > ul > li:contains("Клубничка")').show();
        var pluginsArray = Lampa.Storage.get('plugins');
        pluginsArray.push({ url: '/sisi.js', status: 1 });
        Lampa.Storage.set('plugins', pluginsArray);
        location.reload();
      }
      if (Lampa.Storage.field('SISI_fix') == 1) {
        //$('#app > div.wrap.layer--height.layer--width > div.wrap__left.layer--height > div > div > div > div > div:nth-child(1) > ul > li:contains("Клубничка")').hide();
        var plugSisiArray = Lampa.Storage.get('plugins');
        var delpluginSisi = plugSisiArray.filter(function (obj) {
          return obj.url !== '/sisi.js';
        });
        Lampa.Storage.set('plugins', delpluginSisi);
        location.reload();
      }
    },
  });
  if (Lampa.Storage.field('SISI_fix') == 1) {
    setTimeout(function () {
      $(
        '#app > div.wrap.layer--height.layer--width > div.wrap__left.layer--height > div > div > div > div > div:nth-child(1) > ul > li:contains("Клубничка")'
      ).hide();
    }, 2500);
  }
  if (Lampa.Storage.field('SISI_fix') == 1) $('[data-action=sisi_]').eq(0).hide();

  /*               Lampa.SettingsApi.addParam({
                               component: 'ero',
                               param: {
                                       name: 'HidenErotic',
                                       type: 'select',
                       values: {
                                1:	'Да',
                                2:	'Нет',
                            },
                                       default: '1',
                                       },
                                       field: {
                                               name: 'Скрыть каналы 18+ из Телевизора',
                                               description: 'Нажмите для выбора, после этого приложение будет перезагружено'
                               },
                               onChange: function (value) {
                                if (value == '1') {
                                      Lampa.Utils.putScriptAsync([getPath('/newtv2.js')], function () {});
                                      location.reload();
                                  }
                                  if (value == '2') {
                                    Lampa.Utils.putScriptAsync([getPath('/newtv.js')], function () {});
                                    location.reload();
                                  }
                               }
             });

             if (Lampa.Storage.field('HidenErotic') == '1'){
               Lampa.Utils.putScriptAsync([getPath('/newtv2.js')], function () {});
             }
             if (Lampa.Storage.field('HidenErotic') == '2'){
               Lampa.Utils.putScriptAsync([getPath('/newtv.js')], function () {});
             }*/

  /*Добавляем раздел Мультфильмы в главное меню*/

  function multstart() {
    var ico =
      '<svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="256px" viewBox="0 0 76.688 76.687" xml:space="preserve" stroke="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M75.191,30.104h-0.598c-0.574-6.778-4.99-12.47-11.062-14.894C57.993,7.232,48.773,1.992,38.345,1.992 c-10.427,0-19.647,5.237-25.187,13.217c-6.07,2.424-10.485,8.114-11.06,14.895H1.5c-0.828,0-1.5,0.673-1.5,1.5 c0,0.828,0.672,1.5,1.5,1.5h0.598C2.56,38.56,5.502,43.321,9.802,46.233l4.249,27.192c0.114,0.73,0.743,1.271,1.482,1.271h11.248 c0.828,0,1.5-0.672,1.5-1.5c0-5.55,4.515-10.063,10.063-10.063c5.548,0,10.063,4.517,10.063,10.063c0,0.828,0.672,1.5,1.5,1.5 h11.248c0.737,0,1.366-0.539,1.479-1.271l4.25-27.192c4.301-2.914,7.242-7.673,7.703-13.129h0.6c0.826,0,1.5-0.672,1.5-1.5 C76.689,30.777,76.02,30.104,75.191,30.104z M38.345,4.992c8.084,0,15.374,3.49,20.434,9.042c-0.582-0.059-1.172-0.09-1.77-0.09 c-9.229,0-16.816,7.123-17.582,16.157h-2.167c-0.765-9.034-8.352-16.156-17.582-16.156c-0.597,0-1.186,0.03-1.768,0.09 C22.972,8.484,30.259,4.992,38.345,4.992z M65.993,32.527l-1.854,11.874c-2.113,1.185-4.541,1.86-7.129,1.86 c-8.082,0-14.658-6.574-14.658-14.657c0-8.083,6.576-14.657,14.658-14.657c1.598,0,3.131,0.266,4.569,0.738 C64.35,21.97,65.973,27.061,65.993,32.527z M10.699,32.527c0.021-5.466,1.645-10.557,4.413-14.842 c1.439-0.474,2.973-0.738,4.569-0.738c8.083,0,14.658,6.574,14.658,14.657c0,8.082-6.575,14.658-14.658,14.658 c-2.587,0-5.015-0.682-7.127-1.86L10.699,32.527z M5.025,31.604c0-4.497,2.04-8.523,5.237-11.215 c-1.645,3.755-2.563,7.896-2.563,12.252c0,0.077,0.006,0.155,0.018,0.23l1.382,8.846C6.58,39.083,5.025,35.526,5.025,31.604z M59.872,71.696h-8.549c-0.746-6.5-6.281-11.563-12.979-11.563c-6.697,0-12.23,5.063-12.977,11.563h-8.55l-3.705-23.715 c2.032,0.817,4.246,1.28,6.567,1.28c9.23,0,16.817-7.123,17.582-16.158h2.167c0.765,9.035,8.353,16.158,17.582,16.158 c2.322,0,4.535-0.463,6.566-1.28L59.872,71.696z M67.596,41.716l1.381-8.846c0.012-0.075,0.018-0.153,0.018-0.23 c0-4.354-0.918-8.497-2.562-12.252c3.199,2.69,5.24,6.718,5.24,11.215C71.67,35.526,70.111,39.083,67.596,41.716z"></path> <path d="M25.777,25.671c0-3.36-2.734-6.095-6.096-6.095c-3.36,0-6.094,2.732-6.094,6.095c0,3.36,2.733,6.094,6.094,6.094 S25.777,29.032,25.777,25.671z M19.68,28.765c-0.373,0-0.727-0.077-1.058-0.197c1.995-0.157,3.575-1.812,3.575-3.846 c0-0.356-0.064-0.696-0.155-1.024c0.451,0.538,0.733,1.222,0.733,1.977C22.777,27.377,21.387,28.765,19.68,28.765z M19.198,24.721 c0,0.482-0.395,0.876-0.877,0.876c-0.483,0-0.876-0.394-0.876-0.876s0.393-0.877,0.876-0.877 C18.803,23.844,19.198,24.239,19.198,24.721z"></path> <path d="M49.7,25.671c0,3.359,2.731,6.094,6.095,6.094c3.36,0,6.094-2.732,6.094-6.094c0-3.362-2.732-6.095-6.094-6.095 C52.432,19.576,49.7,22.311,49.7,25.671z M53.559,24.721c0-0.482,0.393-0.877,0.877-0.877c0.481,0,0.875,0.395,0.875,0.877 s-0.394,0.876-0.875,0.876C53.95,25.597,53.559,25.203,53.559,24.721z M55.795,28.765c-0.373,0-0.728-0.077-1.06-0.197 c1.996-0.157,3.573-1.812,3.573-3.846c0-0.356-0.063-0.696-0.153-1.025c0.451,0.538,0.731,1.222,0.731,1.977 C58.889,27.377,57.501,28.765,55.795,28.765z"></path> <path d="M46.2,50.151h-8.555c-0.827,0-1.5,0.672-1.5,1.5c0,0.827,0.673,1.5,1.5,1.5H46.2c0.828,0,1.5-0.673,1.5-1.5 C47.7,50.823,47.029,50.151,46.2,50.151z"></path> </g> </g> </g></svg>';
    var mult = $(
      '<li class="menu__item selector" data-action="mult"><div class="menu__ico">' +
        ico +
        '</div><div class="menu__text">Мультфильмы</div></li>'
    );
    mult.on('hover:enter', function () {
      Lampa.Activity.push({
        url: '',
        title: 'Мультфильмы - CUB',
        component: 'category',
        genres: 16,
        id: 16,
        source: 'cub',
        card_type: true,
        page: 1,
      });
    });
    $('.menu .menu__list').eq(0).append(mult);
    setTimeout(function () {
      $('[data-action=mult]').insertBefore($('[data-action=catalog]'));
    }, 2000);
  }
  setTimeout(function () {
    multstart();
  }, 1500);

  /*Start FIX*/

  var dcma_timer = setInterval(function () {
    if (!window.lampa_settings.dcma) return;
      
    if (window.location.host !== 'ab2024.ru') {
      clearInterval(dcma_timer);
      window.lampa_settings.dcma = false;
      var plugArray = Lampa.Storage.get('plugins') || [];
      var delplugin = plugArray.filter(function (obj) {
        return obj.url !== 'http://cub.red/plugin/tmdb-proxy';
      });
      Lampa.Storage.set('plugins', delplugin);

      var pluginArray = Lampa.Storage.get('plugins') || [];
      var deleteplugin = pluginArray.filter(function (obj) {
        return obj.url !== 'https://cub.red/plugin/tmdb-proxy';
      });
      Lampa.Storage.set('plugins', deleteplugin);
    } else {
    }
  }, 1000);
  
    function createHintText(html) {
        return '<div style="display: block;"><div class="myBot" style="display:none; line-height: 0.5;color: #ffffff;font-family: &quot;SegoeUI&quot;, sans-serif;font-size: 1em;box-sizing: border-box;outline: none;user-select: none;display: flex;-webkit-box-align: start;align-items: flex-start;position: relative;background-color: rgba(255, 255, 255, 0.1);border-radius: 0.3em;margin-bottom: 1.5em;"><div style="background-color: rgba(255, 255, 255, 0.1);    padding: 1em;    -webkit-box-flex: 1;    -webkit-flex-grow: 1;    -moz-box-flex: 1;    -ms-flex-positive: 1;    flex-grow: 1;    line-height: 1.7;"><b style="background: #ffe216;color: #000;border-radius: 0.3em;padding: 0.3em;margin-right: 0.5em;">Подсказка</b>' + html + '</div></div></div>'   
    }
  
    var hint1 = $(createHintText('Тормозит или не воспроизводится видео? Переключи <b>Источник</b> с помощью кнопки над текстом.'));
    var hint2 = $(createHintText('Для просмотра в 4К переключи <b>Источник</b>'));
    
    var hints = [hint1]

Lampa.Storage.listener.follow('change', function (event) {
              if (event.name == 'activity') {
                  console.log('Lampa.Activity.active().component', Lampa.Activity.active().component)
                if (Lampa.Activity.active().component == 'lampac') {
                    var randomHint = hints[Math.floor(Math.random() * hints.length)]
                   var add_ads = setInterval(function() {
			if (document.querySelector('.online-prestige-watched') !== null) {
	                    $('.online-prestige-watched').before(randomHint);
                            clearInterval(add_ads);
                        }
                   }, 50);
                }
              }
          })   
})();

