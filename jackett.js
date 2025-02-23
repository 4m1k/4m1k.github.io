(function () {
    'use strict';

    function checkParser(parser) {
        return new Promise((resolve) => {
            const protocol = location.protocol === "https:" ? "https://" : "http://";
            const apiUrl = protocol + parser.url + "/api/v2.0/indexers/status:healthy/results?apikey=" + parser.apiKey;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", apiUrl, true);
            xhr.timeout = 3000;
            xhr.onload = function () {
                parser.status = (xhr.status === 200);
                resolve(parser);
            };
            xhr.onerror = function () {
                parser.status = false;
                resolve(parser);
            };
            xhr.ontimeout = function () {
                parser.status = false;
                resolve(parser);
            };
            xhr.send();
        });
    }

    var parsersInfo = [
        { title: "79.137.204.8:2601", url: "79.137.204.8:2601", apiKey: "" },
        { title: "jacred.xyz", url: "jacred.xyz", apiKey: "" },
        { title: "jacred.pro", url: "jacred.pro", apiKey: "" },
        { title: "jacred.viewbox.dev", url: "jacred.viewbox.dev", apiKey: "viewbox" },
        { title: "trs.my.to:9117", url: "trs.my.to:9117", apiKey: "" },
        { title: "altjacred.duckdns.org", url: "altjacred.duckdns.org", apiKey: "" }
    ];

    function checkAllParsers() {
        return Promise.all(parsersInfo.map(parser => checkParser(parser)));
    }

    function updateParserField(selected) {
        $("div[data-name='jackett_urltwo']").html(
            parsersInfo.map(parser => {
                let borderColor = parser.title === selected ? '#ffd700' : 'transparent';
                return `
                    <div class="settings-folder" style="padding:0!important">
                        <div style="width:1.3em;height:1.3em;padding-right:.1em"></div>
                        <div style="font-size:1.2em; font-weight: bold;">
                            <div style="padding: 0.5em 0.5em; padding-top: 0;">
                                <div style="background: #d99821; padding: 0.7em; border-radius: 0.5em; border: 4px solid ${borderColor};">
                                    <div style="line-height: 0.3; color: black; text-align: center;">${parser.title}</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }).join('')
        );
    }

    function parserSetting() {
        Lampa.SettingsApi.addParam({
            component: 'parser',
            param: {
                name: 'jackett_urltwo',
                type: 'select',
                values: parsersInfo.reduce((prev, parser) => {
                    prev[parser.title] = parser.title;
                    return prev;
                }, { no_parser: 'Свой вариант' }),
                default: 'jacred.xyz'
            },
            field: {
                name: `<div class="settings-folder" style="padding:0!important">
                          <div style="width:1.3em;height:1.3em;padding-right:.1em"></div>
                          <div style="font-size:1.0em">
                            <div style="padding: 0.3em 0.3em; padding-top: 0;">
                              <div style="background: #d99821; padding: 0.5em; border-radius: 0.4em; border: 3px solid #d99821;">
                                <div style="line-height: 0.3;">Выбрать парсер</div>
                              </div>
                            </div>
                          </div>
                        </div>`,
                description: "Нажмите для выбора парсера из списка"
            },
            onChange: function (value) {
                updateParserField(value);
                Lampa.Settings.update();
            }
        });
    }

    function initPlugin() {
        parserSetting();
        Lampa.Controller.listener.follow('toggle', function (e) {
            if (e.name === 'select') {
                checkAllParsers();
            }
        });
    }

    if (!window.plugin_parser_ready) {
        window.plugin_parser_ready = true;
        if (window.appready) {
            initPlugin();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') initPlugin();
            });
        }
    }
})();
