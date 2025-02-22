(function () {
  'use strict';

  // Инициализируем платформу для TV
  Lampa.Platform.tv();

  // Основная функция плагина, отвечающая за рендеринг шаблона и стилей
  function initCardify() {
    // Если текущая платформа не TV, выводим сообщение и прекращаем выполнение
    if (!Lampa.Platform.screen('tv')) {
      console.log('Cardify: not a TV platform');
      return;
    }
    
    // Добавляем шаблон для полноэкранного старта (full_start_new)
    Lampa.Template.add("full_start_new",
      "<div class=\"full-start-new cardify\">" +
      "  <div class=\"full-start-new__body\">" +
      "    <div class=\"full-start-new__left hide\">" +
      "      <div class=\"full-start-new__poster\">" +
      "        <img class=\"full-start-new__img full--poster\" />" +
      "      </div>" +
      "    </div>" +
      "    <div class=\"full-start-new__right\">" +
      "      <div class=\"cardify__left\">" +
      "        <div class=\"full-start-new__head\"></div>" +
      "        <div class=\"full-start-new__title\">{title}</div>" +
      "        <div class=\"cardify__details\">" +
      "          <div class=\"full-start-new__details\"></div>" +
      "        </div>" +
      "        <div class=\"full-start-new__buttons\">" +
      "          <div class=\"full-start__button selector button--play\">" +
      "            <svg width=\"28\" height=\"29\" viewBox=\"0 0 28 29\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
      "              <circle cx=\"14\" cy=\"14.5\" r=\"13\" stroke=\"currentColor\" stroke-width=\"2.7\"/>" +
      "              <path d=\"M18.0739 13.634C18.7406 14.0189 18.7406 14.9811 18.0739 15.366L11.751 19.0166C11.0843 19.4015 10.251 18.9204 10.251 18.1506L10.251 10.8494C10.251 10.0796 11.0843 9.5985 11.751 9.9834L18.0739 13.634Z\" fill=\"currentColor\"/>" +
      "            </svg>" +
      "            <span>#{title_watch}</span>" +
      "          </div>" +
      "          <div class=\"full-start__button selector button--book\">" +
      "            <svg width=\"21\" height=\"32\" viewBox=\"0 0 21 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
      "              <path d=\"M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z\" stroke=\"currentColor\" stroke-width=\"2.5\"/>" +
      "            </svg>" +
      "            <span>#{settings_input_links}</span>" +
      "          </div>" +
      "          <div class=\"full-start__button selector button--reaction\">" +
      "            <svg width=\"38\" height=\"34\" viewBox=\"0 0 38 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
      "              <path d=\"M37.208 10.9742C37.1364 10.8013 37.0314 10.6441 36.899 10.5117C36.7666 10.3794 36.6095 10.2744 36.4365 10.2028L12.0658 0.108375C11.7166 -0.0361828 11.3242 -0.0361227 10.9749 0.108542C10.6257 0.253206 10.3482 0.530634 10.2034 0.879836L0.108666 25.2507C0.0369593 25.4236 0 25.609 0 25.7962C0 25.9834 0.0368249 26.1688 0.108469 26.3418C0.180114 26.5147 0.28514 26.6719 0.417545 26.8042C0.54995 26.9366 0.707139 27.0416 0.880127 27.1131L17.2452 33.8917C17.5945 34.0361 17.9869 34.0361 18.3362 33.8917L29.6574 29.2017C29.8304 29.1301 29.9875 29.0251 30.1199 28.8928C30.2523 28.7604 30.3573 28.6032 30.4289 28.4303L37.2078 12.065C37.2795 11.8921 37.3164 11.7068 37.3164 11.5196C37.3165 11.3325 37.2796 11.1471 37.208 10.9742ZM20.425 29.9407L21.8784 26.4316L25.3873 27.885L20.425 29.9407ZM28.3407 26.0222L21.6524 23.252C21.3031 23.1075 20.9107 23.1076 20.5615 23.2523C20.2123 23.3969 19.9348 23.6743 19.79 24.0235L17.0194 30.7123L3.28783 25.0247L12.2918 3.28773L34.0286 12.2912L28.3407 26.0222Z\" fill=\"currentColor\"/>" +
      "              <path d=\"M25.3493 16.976L24.258 14.3423L16.959 17.3666L15.7196 14.375L13.0859 15.4659L15.4161 21.0916L25.3493 16.976Z\" fill=\"currentColor\"/>" +
      "            </svg>" +
      "            <span>#{title_reactions}</span>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "      <div class=\"cardify__right\">" +
      "        <div class=\"full-start-new__reactions selector\">" +
      "          <div>#{reactions_none}</div>" +
      "        </div>" +
      "        <div class=\"full-start-new__rate-line\">" +
      "          <div class=\"full-start__rate rate--tmdb\"><div>{rating}</div><div class=\"source--name\">TMDB</div></div>" +
      "          <div class=\"full-start__rate rate--imdb hide\"><div></div><div>IMDB</div></div>" +
      "          <div class=\"full-start__rate rate--kp hide\"><div></div><div>KP</div></div>" +
      "          <div class=\"full-start__pg hide\"></div>" +
      "          <div class=\"full-start__status hide\"></div>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "  <div class=\"hide buttons--container\">" +
      "    <div class=\"full-start__button view--torrent hide\">" +
      "      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 50 50\" width=\"50px\" height=\"50px\">" +
      "        <path d=\"M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M40.5,30.963c-3.1,0-4.9-2.4-4.9-2.4 S34.1,35,27,35c-1.4,0-3.6-0.837-3.6-0.837l4.17,9.643C26.727,43.92,25.874,44,25,44c-2.157,0-4.222-0.377-6.155-1.039L9.237,16.851" +
      "      c0,0-0.7-1.2,0.4-1.5c1.1-0.3,5.4-1.2,5.4-1.2s1.475-0.494,1.8,0.5c0.5,1.3,4.063,11.112,4.063,11.112S22.6,29,27.4,29" +
      "      c4.7,0,5.9-3.437,5.7-3.937c-1.2-3-4.993-11.862-4.993-11.862s-0.6-1.1,0.8-1.4c1.4-0.3,3.8-0.7,3.8-0.7s1.105-0.163,1.6,0.8" +
      "      c0.738,1.437,5.193,11.262,5.193,11.262s1.1,2.9,3.3,2.9c0.464,0,0.834-0.046,1.152-0.104c-0.082,1.635-0.348,3.221-0.817,4.722" +
      "      C42.541,30.867,41.756,30.963,40.5,30.963z\" fill=\"currentColor\"/>" +
      "      </svg>" +
      "      <span>#{full_torrents}</span>" +
      "    </div>" +
      "    <div class=\"full-start__button selector view--trailer\">" +
      "      <svg height=\"70\" viewBox=\"0 0 80 70\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
      "        <path d=\"M71.2555 2.08955C74.6975 3.2397 77.4083 6.62804 78.3283 10.9306C80 18.7291 80 35 80 35C80 35 80 51.2709 78.3283 59.0694C77.4083 63.372 74.6975 66.7603 71.2555 67.9104C65.0167 70 40 70 40 70C40 70 14.9833 70 8.74453 67.9104C5.3025 66.7603 2.59172 63.372 1.67172 59.0694C0 51.2709 0 35 0 35C0 35 0 18.7291 1.67172 10.9306C2.59172 6.62804 5.3025 3.2395 8.74453 2.08955C14.9833 0 40 0 40 0C40 0 65.0167 0 71.2555 2.08955ZM55.5909 35.0004L29.9773 49.5714V20.4286L55.5909 35.0004Z\" fill=\"currentColor\"/>" +
      "      </svg>" +
      "      <span>#{full_trailers}</span>" +
      "    </div>" +
      "  </div>" +
      "</div>"
    );
    Lampa.Template.add("cardify_css", "\n <style>\n" +
      "  .cardify .full-start-new__body { height: 80vh; }\n" +
      "  .cardify .full-start-new__right { display: flex; align-items: flex-end; }\n" +
      "  .cardify__left { flex-grow: 1; }\n" +
      "  .cardify__right { display: flex; align-items: center; flex-shrink: 0; }\n" +
      "  .cardify__details { display: flex; }\n" +
      "  .cardify .full-start-new__reactions { margin: 0; margin-right: -2.8em; }\n" +
      "  .cardify .full-start-new__reactions:not(.focus) { margin: 0; }\n" +
      "  .cardify .full-start-new__reactions:not(.focus) > div:not(:first-child) { display: none; }\n" +
      "  .cardify .full-start-new__reactions:not(.focus) .reaction { position: relative; }\n" +
      "  .cardify .full-start-new__reactions:not(.focus) .reaction__count { position: absolute; top: 28%; left: 95%; font-size: 1.2em; font-weight: 500; }\n" +
      "  .cardify .full-start-new__rate-line { margin: 0; margin-left: 3.5em; }\n" +
      "  .cardify .full-start-new__rate-line > *:last-child { margin-right: 0 !important; }\n" +
      "  .cardify__background { left: 0; }\n" +
      "  .cardify__background.loaded:not(.dim) { opacity: 1; }\n" +
      "  body:not(.menu--open) .cardify__background { " +
      "     background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%), " +
      "                 linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%), " +
      "                 linear-gradient(to left, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%), " +
      "                 linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%); " +
      "  }\n" +
      "  @keyframes animation-full-background { " +
      "    0% { transform: translate3d(0,-10%,0); } " +
      "    100% { transform: translate3d(0,0,0); } " +
      "  }\n </style>\n ");
    $("body").append(Lampa.Template.get("cardify_css", {}, true));
    Lampa.Listener.follow('full', function (event) {
      if (event.type === "complite") {
        event.object.activity.render().find(".full-start__background").addClass("cardify__background");
      }
    });
  }
  
  // Запускаем инициализацию, когда приложение готово
  if (window.appready) {
    initCardify();
  } else {
    Lampa.Listener.follow("app", function (event) {
      if (event.type === "ready") {
        initCardify();
      }
    });
  }
})();
