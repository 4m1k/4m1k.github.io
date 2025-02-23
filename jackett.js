(function () {
    'use strict';

    Lampa.Platform.tv();

    // Список парсеров из твоего кода
    const parsers = [
        { title: "Lampa32", url: "79.137.204.8:2601", apiKey: "" },
        { title: "Jacred.xyz", url: "jacred.xyz", apiKey: "" },
        { title: "Jacred Pro", url: "jacred.pro", apiKey: "" },
        { title: "Viewbox", url: "jacred.viewbox.dev", apiKey: "viewbox" },
        { title: "JAOS My To Jacred", url: "trs.my.to:9117", apiKey: "" },
        { title: "Johnny Jacred", url: "altjacred.duckdns.org", apiKey: "" }
    ];

    const proto = location.protocol === "https:" ? "https://" : "http://";
    let cache = {}; // Кеширование запросов

    function checkParser(parser) {
        return new Promise((resolve) => {
            const apiUrl = `${proto}${parser.url}/api/v2.0/indexers/status:healthy/results?apikey=${parser.apiKey}`;
            if (cache[apiUrl]) {
                parser.status = cache[apiUrl].status;
                return resolve(parser);
            }
            const xhr = new XMLHttpRequest();
            xhr.open("GET", apiUrl, true);
            xhr.timeout = 3000;
            xhr.onload = function () {
                parser.status = xhr.status === 200;
                cache[apiUrl] = { status: parser.status };
                resolve(parser);
            };
            xhr.onerror = xhr.ontimeout = function () {
                parser.status = false;
                cache[apiUrl] = { status: parser.status };
                resolve(parser);
            };
            xhr.send();
        });
    }

    function checkAllParsers() {
        return Promise.all(parsers.map(parser => checkParser(parser)));
    }

    function showParserSelectionMenu() {
        checkAllParsers().then(results => {
            results.unshift({ title: "Свой вариант", url: "", apiKey: "", status: null });
            const currentSelected = Lampa.Storage.get('selected_parser');
            const items = results.map(parser => {
                let color = parser.title !== "Свой вариант" ? (parser.status ? "#64e364" : "#ff2121") : "inherit";
                let activeMark = parser.title === currentSelected ? '<span style="color: #4285f4; margin-right: 5px;">✔</span>' : '';
                return { title: `${activeMark}<span style="color: ${color};">${parser.title}</span>`, parser };
            });
            Lampa.Select.show({
                title: "Меню смены парсера",
                items,
                onBack: () => Lampa.Controller.toggle("settings_component"),
                onSelect: item => {
                    Lampa.Storage.set('jackett_url', item.parser.url);
                    Lampa.Storage.set('jackett_key', item.parser.apiKey);
                    Lampa.Storage.set('selected_parser', item.parser.title);
                    updateParserField(item.parser.title);
                    Lampa.Controller.toggle("settings_component");
                    Lampa.Settings.update();
                }
            });
        });
    }

    function updateParserField(text) {
        $("div[data-name='jackett_urltwo']").html(
            `<div class="settings-folder" style="padding:0!important">
                <div style="font-size:1.0em">
                    <div style="padding: 0.3em 0.3em;">
                        <div style="background: #d99821; padding: 0.5em; border-radius: 0.4em;">
                            <div style="line-height: 0.3;">${text}</div>
                        </div>
                    </div>
                </div>
            </div>`
        );
    }

    Lampa.SettingsApi.addParam({
        component: "parser",
        param: {
            name: "jackett_urltwo",
            type: "select",
            values: Object.fromEntries(parsers.map(p => [p.url, p.title])),
            default: parsers[0]?.url || 'no_parser'
        },
        field: {
            name: `<div class="settings-folder" style="padding:0!important">
                      <div style="font-size:1.0em">Выбрать парсер</div>
                    </div>`,
            description: "Нажмите для выбора парсера из списка"
        },
        onChange: () => Lampa.Settings.update(),
        onRender: elem => {
            setTimeout(() => {
                if (Lampa.Storage.field("parser_use")) {
                    elem.show();
                    $(".settings-param__name", elem).css("color", "ffffff");
                    $("div[data-name='jackett_urltwo']").insertAfter("div[data-name='parser_torrent_type']");
                    elem.off("click").on("click", showParserSelectionMenu);
                    updateParserField(Lampa.Storage.get('selected_parser') || "Выбрать парсер");
                } else {
                    elem.hide();
                }
            }, 5);
        }
    });

})();
