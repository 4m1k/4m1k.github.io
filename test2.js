(function(){
    'use strict';

    // Принудительно указываем, что работаем как на ТВ
    Lampa.Platform.tv();

    /**
     * Основная функция, запускающая всю логику по темам.
     * Проверяет окружение, добавляет пункт «Мои темы» в настройки
     * и регистрирует компонент для управления темами.
     */
    function initThemesComponent(){

        // 1) Защита от отладки: переопределение методов console
        //    (log, warn, info и т.д.), чтобы усложнить «прозрачный» вывод.
        (function protectConsole(){
            try {
                // Попытка получить глобальный объект (window / global)
                const globalObj = Function("return this")() || window;
                const originalConsole = globalObj.console || {};
                const methods = ["log", "warn", "info", "error", "exception", "trace", "table"];

                methods.forEach(function(method){
                    const originalMethod = originalConsole[method];
                    originalConsole[method] = function(){
                        // Здесь можно вставить код, маскирующий логи
                        // либо передать управление «как есть»:
                        if (originalMethod) {
                            originalMethod.apply(originalConsole, arguments);
                        }
                    };
                });
                globalObj.console = originalConsole;
            }
            catch(e){
                // В случае ошибок ничего особенного не делаем
            }
        })();


        // 3) Если в localStorage уже сохранён ключ "selectedTheme", подгружаем его в DOM.
        const savedTheme = localStorage.getItem("selectedTheme");
        if (savedTheme) {
            // Вставляем <link rel="stylesheet" ...> для темы, если она ещё не вставлена
            // (тут автор кода хитро добавляет её внутрь .settings-param).
            const foundLink = document.querySelector(
                `.settings-param > div[data-name="${savedTheme}"]`
            );
            if (foundLink) {
                document.querySelector(".settings-param").append(foundLink);
            }
        }

        // 4) Через API настроек Lampa добавляем новый параметр (Мои темы)
        Lampa.SettingsApi.addParam({
            component: "interface",
            param: { name: "my_themes", type: "card" },
            field: {
                name: "Мои темы",
                description: "Измени палитру элементов приложения"
            },
            onRender: function onRenderThemesParam(element){
                // Когда Lampa отрендерит пункт «Мои темы» в разделе настроек,
                // мы «добавляем» DOM-элемент с категориями.

                setTimeout(function(){
                    // Вставляем нашу обёртку <div class="my_themes category-full"></div>
                    // сразу после .settings-param > div:contains("Мои темы")
                    const paramTitleBlock = document.querySelector(
                        ".settings-param > div:contains('Мои темы')"
                    );
                    if (paramTitleBlock) {
                        paramTitleBlock.insertAdjacentHTML(
                            'afterend',
                            `<div class="my_themes category-full"></div>`
                        );
                    }

                    // Назначаем обработчик на само поле настроек
                    element.on('hover:enter', function(){
                        // Немного тайм-аутов, вероятно, чтобы «скрыть» экран настроек
                        // и перейти к Activity со списком тем
                        setTimeout(function(){
                            // Если на экране остались эти блоки, возможно выходим назад
                            if (
                                document.querySelector(".settings-folder") ||
                                document.querySelector(".settings-param")
                            ) {
                                window.app.back();
                            }
                        }, 50);

                        setTimeout(function(){
                            // Пытаемся прочесть "themesCurrent"
                            let themesCurrent = Lampa.Storage.get('themesCurrent');
                            if (!themesCurrent) {
                                // Если пусто, берём по умолчанию
                                themesCurrent = {
                                    url: "https://bylampa.github.io/themes/categories/stroke.json",
                                    title: "Focus Pack",
                                    component: "themesComponent",
                                    page: 1
                                };
                            } 
                            // Открываем Activity (Lampa.Activity)
                            Lampa.Activity.push(themesCurrent);
                            // И тут же обновляем в Storage
                            Lampa.Storage.set('themesCurrent',
                                JSON.stringify(Lampa.Activity.get())
                            );
                        }, 100);
                    });
                }, 0);
            }
        });

        /**
         * Реализуем сам компонент для просмотра / установки тем.
         * В исходном коде он назывался function _0x243761(...).
         */
        function ThemesComponent(object){
            // Текущее Activity
            const network = new Lampa.Reguest();
            const scroll = new Lampa.Scroll({ mask:true, over:true, step:250 });
            const items = [];

            // Основной контейнер компонента
            const html = $(`<div class="info layer--width">
                <div class="info__left">
                    <div class="info__title"></div>
                    <div class="info__title-original"></div>
                    <div class="info__create"></div>
                </div>
                <div class="info__right">
                    <div id="stantion_filtr"></div>
                </div>
            </div>`);

            // Контейнер для карточек (тематических)
            const content = $(`<div class="my_themes category-full"></div>`);

            let info;       // Ссылка на DOM «правого» блока
            let selected;   // Текущая карточка
            let categories = [
                { title: "Focus Pack", url: "https://bylampa.github.io/themes/categories/stroke.json" },
                { title: "Color Gallery", url: "https://bylampa.github.io/themes/categories/color_gallery.json" }
            ];

            // Создание компонента (activity.loader, network и т.д.)
            this.create = function(){
                // Показываем лоадер
                this.activity.loader(true);

                // Загрузка (network) предполагается, но в исходном коде
                // это завязано на объект: object.url, object.title и т.д.
                // Здесь же вызывается build() => append() => и скрытие лоадера.

                network.silent(object.url, this.build.bind(this), function(){
                    // Если не загрузилось — создаём пустой модуль
                    const empty = new Lampa.Empty();
                    html.append(empty.render());
                    this.activity.loader(false);
                    this.activity.toggle();
                }.bind(this));

                return this.render();
            };

            /**
             * Добавляем карточки (темы) в контент
             */
            this.append = function(arrayOfThemes){
                arrayOfThemes.forEach(theme => {
                    // Создаём карточку
                    const card = Lampa.Template.get('card', {
                        title: theme.title,
                        release_year: ""
                    });

                    card.addClass('card--collection');
                    // «Заглушка» изображения
                    card.find('.card__img').css({
                        cursor: 'pointer',
                        'background-color': '#ffe216',
                        'text-align': 'center'
                    });

                    const imgElem = card.find('.card__img')[0];

                    // onload
                    imgElem.onload = function(){
                        card.addClass('card--loaded');
                    };
                    // onerror
                    imgElem.onerror = function(){
                        imgElem.src = "./img/img_broken.svg";
                    };

                    // Указываем реальную ссылку на картинку
                    imgElem.src = theme.src;

                    // Если это та тема, которая уже стоит (по selectedTheme),
                    // ставим некий визуальный маркер (например, «Установлена»)
                    const currentSelected = localStorage.getItem('selectedTheme');
                    if (currentSelected && theme.css === currentSelected) {
                        // Подпись «Установлена» в правом нижнем углу
                        addInstalledMarker(card);
                    }

                    card.on('hover:focus', () => {
                        // При фокусе на карточке
                        selected = card[0];
                        scroll.update(card, true);
                        info.find('.info__title').text(theme.title);
                    });

                    // Клик/enter по карточке
                    card.on('hover:enter', () => {
                        // Выводим диалог: Установить / Удалить
                        const actions = [
                            { title: "Установить" },
                            { title: "Удалить" }
                        ];
                        Lampa.Select.show({
                            title: "",
                            items: actions,
                            onBack(){
                                Lampa.Controller.toggle('content');
                            },
                            onSelect(action){
                                if (action.title === "Установить") {
                                    // Удаляем старую тему, если есть
                                    const oldLink = document.querySelector(
                                        `link[rel="stylesheet"][href^="https://bylampa.github.io/themes/css/"]`
                                    );
                                    if (oldLink) oldLink.remove();

                                    // Вставляем «link» для css
                                    const linkTag = document.createElement('link');
                                    linkTag.rel  = "stylesheet";
                                    linkTag.href = theme.css;
                                    document.head.appendChild(linkTag);

                                    // Запоминаем выбранную тему
                                    localStorage.setItem("selectedTheme", theme.css);
                                    console.log("Тема установлена:", theme.css);

                                    // Если есть дополнительные флаги (стеклянный стиль и т.д.),
                                    // здесь автор также подменяет «myGlassStyle», «myBlackStyle» и пр.

                                    // Возврат к списку
                                    Lampa.Controller.toggle('content');
                                    addInstalledMarker(card);
                                }
                                else if (action.title === "Удалить") {
                                    // Удаляем «link» с текущей темой
                                    const oldLink = document.querySelector(
                                        `link[rel="stylesheet"][href^="https://bylampa.github.io/themes/css/"]`
                                    );
                                    if (oldLink) oldLink.remove();

                                    // Удаляем из localStorage
                                    localStorage.removeItem("selectedTheme");

                                    // Если были сохранены «myGlassStyle», «myBlackStyle» и т.п., тоже чистим
                                    localStorage.removeItem("myBackground");
                                    localStorage.removeItem("myGlassStyle");
                                    localStorage.removeItem("myBlackStyle");

                                    // Обратно к списку
                                    Lampa.Controller.toggle('content');
                                }
                            }
                        });
                    });

                    // Добавляем карточку в DOM
                    content.append(card);
                    items.push(card);
                });
            };

            /**
             * Псевдочастная функция для вставки пометки «Установлена» на карточку
             */
            function addInstalledMarker(card) {
                // Если уже есть, не добавляем
                if (card.find('.card__quality').length === 0) {
                    const marker = document.createElement('div');
                    marker.innerText = "Установлена";
                    marker.classList.add('card__quality');
                    card.find('.card__view').append(marker);
                    $(marker).css({
                        position: 'absolute',
                        left: '0',
                        bottom: '-3%',
                        padding: '0.4em 0.4em',
                        background: '#353535a6',
                        color: '#fff',
                        fontSize: '0.8em',
                        borderRadius: '0.3em',
                        textTransform: 'uppercase'
                    });
                }
            }

            /**
             * Сборка данных по темам (вызывается network.silent(..., build, ...))
             * В оригинале это коллбек после загрузки JSON.
             */
            this.build = function(json){
                // Предположим, массив тем: [{ title, css, src, ... }, ...]
                // В исходном коде это параметр (arrayOfThemes).
                // Здесь — «json» после запроса network.silent(...).
                const arrayOfThemes = json.results || json; // Зависит от структуры

                // Создаём пустую «заглушку», если вдруг данных нет
                if (!arrayOfThemes || !arrayOfThemes.length) {
                    const empty = new Lampa.Empty();
                    html.append(empty.render());
                    this.activity.loader(false);
                    this.activity.toggle();
                    return;
                }

                // Заполняем карточками
                this.append(arrayOfThemes);

                // Вставляем контент в основной скролл
                html.append(scroll.render());
                scroll.append(content);

                // Прячем лоадер
                this.activity.loader(false);
                // Показываем контент
                this.activity.toggle();
            };

            // Показ диалога выбора категорий
            this.selectGroup = function(){
                Lampa.Select.show({
                    title: "Категории тем",
                    items: categories,
                    onSelect: (selectedCat) => {
                        // Открываем новое Activity с указанным URL
                        Lampa.Activity.push({
                            url: selectedCat.url,
                            title: selectedCat.title,
                            component: "themesComponent",
                            page: 1
                        });
                        // Сохраняем
                        Lampa.Storage.set(
                            "themesCurrent",
                            JSON.stringify(Lampa.Activity.get())
                        );
                    },
                    onBack(){
                        Lampa.Controller.toggle('content');
                    }
                });
            };

            // Методы управления фокусом
            this.start = function(){
                // Добавляем управление контроллером
                Lampa.Controller.add('content',{
                    toggle: ()=>{
                        Lampa.Controller.collectionFocus(scroll.render());
                        Lampa.Controller.collectionSet(selected || false, scroll.render());
                    },
                    left: ()=>{
                        if (Navigator.canmove('left')) Navigator.move('left');
                        else Lampa.Controller.toggle('menu');
                    },
                    right: ()=>{
                        if (Navigator.canmove('right')) Navigator.move('right');
                        else this.selectGroup();
                    },
                    up: ()=>{
                        if (Navigator.canmove('up')) Navigator.move('up');
                        else {
                            // Пробуем переключиться к фильтру ( #stantion_filtr ), если он не в активном классе
                            if (!info.find('.view--category').hasClass('active')) {
                                Lampa.Controller.collectionFocus(info);
                                Navigator.move('right');
                            }
                            else {
                                Lampa.Controller.toggle('head');
                            }
                        }
                    },
                    down: ()=>{
                        if (Navigator.canmove('down')) Navigator.move('down');
                        else if (info.find('.view--category').hasClass('active')) {
                            // Если там активен .view--category, то выходим
                            Lampa.Controller.toggle('content');
                        }
                        else {
                            Lampa.Controller.toggle('content');
                        }
                    },
                    back: ()=>{
                        // Выходим из текущего Activity
                        Lampa.Activity.backward();
                    }
                });
                Lampa.Controller.toggle('content');
            };

            // Пустые заглушки
            this.pause = function(){};
            this.stop  = function(){};

            // Отрисовка главного контейнера (возвращается наружу)
            this.render = function(){
                return html;
            };

            // Уничтожение
            this.destroy = function(){
                network.clear();
                scroll.destroy();
                if (info) info.remove();
                html.remove();
                content.remove();
            };
        }

        // Регистрируем этот компонент в Lampa как "themesComponent"
        Lampa.Component.add("themesComponent", ThemesComponent);

        // Слушаем событие 'activity' от Lampa.Listener,
        // чтобы при переключении экранов убирать блок кнопок, если компонент иной.
        Lampa.Listener.follow("activity", function(e){
            if (e.type === "start"){
                // Если текущий компонент не themesComponent,
                // удаляем кнопку / блок #button_category
                if (Lampa.Activity.get().component !== "themesComponent"){
                    const catBtn = document.querySelector("#button_category");
                    if (catBtn) catBtn.remove();
                }
            }
        });
    }

    // Если приложение уже готово (window.appready === true), запускаем сразу.
    // Иначе — подписываемся на событие "appready" в Lampa.Listener.
    if (window.appready) {
        initThemesComponent();
    }
    else {
        Lampa.Listener.follow("ready", function(e){
            if (e.type === "ready"){
                initThemesComponent();
            }
        });
    }

})();
