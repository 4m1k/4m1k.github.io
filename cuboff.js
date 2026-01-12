(function () {
  'use strict';
  Lampa.Platform.tv();

  (function () {
    function initLampaHook() {
      if (window.Lampa && Lampa.Player && Lampa.Player.play) {
        var originalPlay = Lampa.Player.play;
        Lampa.Player.play = function (object) {
          object.iptv = true;

          if (object.vast_url) delete object.vast_url;
          if (object.vast_msg) delete object.vast_msg;
          
          return originalPlay.apply(this, arguments);
        };
      } else {
        setTimeout(initLampaHook, 500);
      }
    }

    function removeAdsOnToggle() {
      Lampa.Controller.listener.follow('toggle', function (event) {
        if (event.name === 'select') {
          setTimeout(function () {
            if (Lampa.Activity.active().component === 'full') {
              $('.ad-server, .ad-bot').remove();
            }
          }, 150);
        }
      });
    }

    function removeQRCodeAds() {
      const observer = new MutationObserver(function () {
        // Удаление QR-кода в торрсервере
        $('[class*="torrserver"], [class*="torrent-server"], [class*="torrentserver"]').find('[class*="qr"], [class*="qrcode"], img[src*="qr"], canvas').closest('[class*="ad"], [class*="promo"], [class*="banner"]').remove();
        $('[class*="torrserver"], [class*="torrent-server"], [class*="torrentserver"]').find('[class*="qr"], [class*="qrcode"]').remove();
        
        // Удаление QR-кода в синхронизации
        $('[class*="sync"], [class*="synchronization"]').find('[class*="qr"], [class*="qrcode"], img[src*="qr"], canvas').closest('[class*="ad"], [class*="promo"], [class*="banner"]').remove();
        $('[class*="sync"], [class*="synchronization"]').find('[class*="qr"], [class*="qrcode"]').remove();
        
        // Общее удаление QR-кодов в рекламных блоках
        $('[class*="qr"], [class*="qrcode"]').closest('[class*="ad"], [class*="promo"], [class*="banner"]').remove();
      });

      observer.observe(document.body, { childList: true, subtree: true });
      
      // Также удаляем при загрузке
      setTimeout(function() {
        $('[class*="torrserver"], [class*="torrent-server"], [class*="torrentserver"]').find('[class*="qr"], [class*="qrcode"]').remove();
        $('[class*="sync"], [class*="synchronization"]').find('[class*="qr"], [class*="qrcode"]').remove();
        $('[class*="qr"], [class*="qrcode"]').closest('[class*="ad"], [class*="promo"], [class*="banner"]').remove();
      }, 500);
    }

    function initializeApp() {
      const style = document.createElement('style');
      style.innerHTML = `
        .button--subscribe,
        [class*="subscribe"]:not([class*="sync"]),
        [class*="premium"]:not(.premium-quality):not([class*="sync"]),
        .open--premium,
        .open--feed,
        .open--notice,
        .icon--blink,
        [class*="black-friday"],
        [class*="christmas"],
        .ad-server,
        .ad-bot,
        .full-start__button.button--options,
        .new-year__button,
        .notice--icon,
        [class*="torrserver"] [class*="qr"],
        [class*="torrent-server"] [class*="qr"],
        [class*="torrentserver"] [class*="qr"],
        [class*="sync"] [class*="qr"]:not([class*="sync"]),
        [class*="synchronization"] [class*="qr"],
        [class*="qr"][class*="ad"],
        [class*="qrcode"][class*="ad"] { display: none !important; }
      `;
      document.head.appendChild(style);

      setTimeout(() => {
        $('.open--feed, .open--premium, .open--notice, .icon--blink, [class*="friday"], [class*="christmas"]').remove();
      }, 1000);
    }

    initLampaHook();

    if (window.appready) {
      initializeApp();
      removeAdsOnToggle();
      removeQRCodeAds();
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          initializeApp();
          removeAdsOnToggle();
          removeQRCodeAds();
          $('[data-action="feed"], [data-action="subscribes"], [data-action="myperson"]').remove();
        }
      });
    }
  })();
})();
