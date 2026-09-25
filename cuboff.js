(function () {
  'use strict';
  Lampa.Platform.tv();

  (function () {
    function initLampaHook() {
      if (window.Lampa && Lampa.Player && Lampa.Player.listener) {
        $.ajaxTransport('+json', function (options) {
          if (/\/api\/ad\/get\/banner(?:[?#]|$)/.test(options.url)) {
            return {
              send: function (headers, complete) {
                complete(200, 'OK', { json: { ad: [] } });
              },
              abort: function () {}
            };
          }
        });

        var listener = Lampa.Player.listener;
        var originalSend = listener.send;
        var restore;

        listener.send = function (type, event) {
          if (restore && (type === 'create' || type === 'start' || type === 'external' || type === 'destroy')) {
            restore();
            restore = null;
          }

          var result = originalSend.apply(this, arguments);

          if (type === 'create' && event && event.data) {
            var data = event.data;
            var hadIptv = Object.prototype.hasOwnProperty.call(data, 'iptv');
            var iptv = data.iptv;

            restore = function () {
              if (hadIptv) data.iptv = iptv;
              else delete data.iptv;
            };

            data.iptv = true;
            delete data.vast_url;
            delete data.vast_msg;
          }

          return result;
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
        .notice--icon
        { display: none !important; }
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
    } else {
      Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
          initializeApp();
          removeAdsOnToggle();
          $('[data-action="feed"], [data-action="subscribes"], [data-action="myperson"]').remove();
        }
      });
    }
  })();
})();
