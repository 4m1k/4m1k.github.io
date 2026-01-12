(function () {
    'use strict';
    Lampa.Platform.tv();

    (function () {
        function hideLastAddedSection() {
            const titles = document.querySelectorAll('.items-line__title');
            titles.forEach(function(title) {
                if (title.textContent.trim() === 'Последнее добавление') {
                    const itemsLine = title.closest('.items-line');
                    if (itemsLine) {
                        itemsLine.style.display = 'none';
                    }
                }
            });
        }

        function hideUnneededContent() {
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
                .notice--icon {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);

            setTimeout(() => {
                $('.open--feed, .open--premium, .open--notice, .icon--blink, [class*="friday"], [class*="christmas"]').remove();
            }, 1000);

            // Скрываем секцию "Последнее добавление" сразу и периодически
            hideLastAddedSection();
            setTimeout(hideLastAddedSection, 500);
            setTimeout(hideLastAddedSection, 1000);
            setTimeout(hideLastAddedSection, 2000);
            setTimeout(hideLastAddedSection, 3000);

            // Отслеживаем появление новых элементов
            if (window.MutationObserver) {
                const observer = new MutationObserver(function() {
                    hideLastAddedSection();
                });
                observer.observe(document.body || document.documentElement, {
                    childList: true,
                    subtree: true
                });
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

        function blockPrerollViaPlayer() {
            function hookPlayer() {
                if (window.Lampa && Lampa.Player && Lampa.Player.play) {
                    const originalPlay = Lampa.Player.play;
                    Lampa.Player.play = function (object) {
                        object.iptv = true;
                        if (object.vast_url) delete object.vast_url;
                        if (object.vast_msg) delete object.vast_msg;
                        return originalPlay.apply(this, arguments);
                    };
                } else {
                    setTimeout(hookPlayer, 500);
                }
            }
            hookPlayer();
        }

        function initialize() {
            hideUnneededContent();
            removeAdsOnToggle();
            blockPrerollViaPlayer();
        }

        if (window.appready) {
            initialize();
        } else {
            Lampa.Listener.follow('app', function (event) {
                if (event.type === 'ready') {
                    initialize();
                }
            });
        }
    })();
})();
