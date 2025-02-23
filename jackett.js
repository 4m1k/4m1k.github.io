(function () {
    'use strict';

    function translate() {
        Lampa.Lang.add({
            lme_parser: {
                ru: 'Каталог парсеров',
                en: 'Parsers catalog',
                uk: 'Каталог парсерів',
                zh: '解析器目录'
            },
            lme_parser_description: {
                ru: 'Нажмите для выбора парсера из ',
                en: 'Click to select a parser from the ',
                uk: 'Натисніть для вибору парсера з ',
                zh: '单击以从可用的 '
            }
        });
    }
    var Lang = {
        translate: translate
    };

    var parsersInfo = [
        { title: "79.137.204.8:2601", url: "79.137.204.8:2601", apiKey: "" },
        { title: "jacred.xyz", url: "jacred.xyz", apiKey: "" },
        { title: "jacred.pro", url: "jacred.pro", apiKey: "" },
        { title: "jacred.viewbox.dev", url: "jacred.viewbox.dev", apiKey: "viewbox" },
        { title: "trs.my.to:9117", url: "trs.my.to:9117", apiKey: "" },
        { title: "altjacred.duckdns.org", url: "altjacred.duckdns.org", apiKey: "" }
    ];

    var proto = location.protocol === "https:" ? 'https://' : 'http://';
    var cache = {};

    function checkAlive(type) {
        if (type === 'parser') {
            var requests = parsersInfo.map(function (parser) {
                var myLink = proto + parser.url;
                var mySelector = $('div.selectbox-item__title').filter(function () {
                    return $(this).text().trim() === parser.title;
                });

                if (cache[myLink]) {
                    $(mySelector).css('color', cache[myLink].color);
                    return Promise.resolve();
                }
                return new Promise(function (resolve) {
                    $.ajax({
                        url: myLink,
                        method: 'GET',
                        success: function (response, textStatus, xhr) {
                            var color = xhr.status === 200 ? '1aff00' : 'ff2e36';
                            $(mySelector).css('color', color);
                            cache[myLink] = { color: color };
                        },
                        error: function () {
                            $(mySelector).css('color', 'ff2e36');
                        },
                        complete: resolve
                    });
                });
            });
            return Promise.all(requests).then(() => console.log('All requests completed'));
        }
    }

    Lampa.Controller.listener.follow('toggle', function (e) {
        if (e.name === 'select') {
            checkAlive("parser");
        }
    });

    function changeParser() {
        var selectedParser = parsersInfo.find(p => p.url === Lampa.Storage.get("lme_url_two"));
        if (selectedParser) {
            Lampa.Storage.set("jackett_url", selectedParser.url);
            Lampa.Storage.set("jackett_key", selectedParser.apiKey);
        }
    }

    var s_values = parsersInfo.reduce((prev, p) => {
        prev[p.url] = p.title;
        return prev;
    }, { no_parser: 'Не выбран' });

    function parserSetting() {
        Lampa.SettingsApi.addParam({
            component: 'parser',
            param: {
                name: 'lme_url_two',
                type: 'select',
                values: s_values,
                "default": 'no_parser'
            },
            field: {
                name: `<div class="settings-folder" style="padding:0!important"><div style="font-size:1.0em">${Lampa.Lang.translate('lme_parser')}</div></div>` ,
                description: `${Lampa.Lang.translate('lme_parser_description')} ${parsersInfo.length}`
            },
            onChange: function (value) {
                changeParser();
                Lampa.Settings.update();
            }
        });
    }

    var Parser = {
        parserSetting: parserSetting
    };

    function add() {
        Lang.translate();
        Parser.parserSetting();
    }

    function startPlugin() {
        window.plugin_lmepublictorr_ready = true;
        if (window.appready) add();
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') add();
            });
        }
    }

    if (!window.plugin_lmepublictorr_ready) startPlugin();

})();
