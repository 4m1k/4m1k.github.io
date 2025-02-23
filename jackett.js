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
            },
            lme_pubtorr: {
                ru: 'Каталог TorrServer',
                en: 'TorrServer catalog',
                uk: 'Каталог TorrServer',
                zh: '解析器目录'
            },
            lme_pubtorr_description: {
                ru: 'Бесплатные серверы от проекта LME',
                en: 'Free servers from the LME project',
                uk: 'Безкоштовні сервери від проєкту LME',
                zh: '来自 LME 项目的免费服务器'
            }
        });
    }
    var Lang = {
        translate: translate
    };

    var parsersInfo = [
        {
            base: 'custom_1',
            name: '79.137.204.8:2601',
            settings: {
                url: '79.137.204.8:2601',
                key: '',
                parser_torrent_type: 'jackett'
            }
        },
        {
            base: 'custom_2',
            name: 'jacred.xyz',
            settings: {
                url: 'jacred.xyz',
                key: '',
                parser_torrent_type: 'jackett'
            }
        },
        {
            base: 'custom_3',
            name: 'jacred.pro',
            settings: {
                url: 'jacred.pro',
                key: '',
                parser_torrent_type: 'jackett'
            }
        },
        {
            base: 'custom_4',
            name: 'jacred.viewbox.dev',
            settings: {
                url: 'jacred.viewbox.dev',
                key: 'viewbox',
                parser_torrent_type: 'jackett'
            }
        },
        {
            base: 'custom_5',
            name: 'trs.my.to:9117',
            settings: {
                url: 'trs.my.to:9117',
                key: '',
                parser_torrent_type: 'jackett'
            }
        },
        {
            base: 'custom_6',
            name: 'altjacred.duckdns.org',
            settings: {
                url: 'altjacred.duckdns.org',
                key: '',
                parser_torrent_type: 'jackett'
            }
        }
    ];

    function changeParser() {
        var jackettUrlTwo = Lampa.Storage.get("lme_url_two");
        var selectedParser = parsersInfo.find(function (parser) {
            return parser.base === jackettUrlTwo;
        });
        if (selectedParser) {
            var settings = selectedParser.settings;
            Lampa.Storage.set(settings.parser_torrent_type === 'prowlarr' ? "prowlarr_url" : "jackett_url", settings.url);
            Lampa.Storage.set(settings.parser_torrent_type === 'prowlarr' ? "prowlarr_key" : "jackett_key", settings.key);
            Lampa.Storage.set("parser_torrent_type", settings.parser_torrent_type);
        } else {
            console.warn("Jackett URL not found in parsersInfo");
        }
    }

    var s_values = parsersInfo.reduce(function (prev, _ref) {
        var base = _ref.base,
            name = _ref.name;
        prev[base] = name;
        return prev;
    }, {
        no_parser: 'Не выбран'
    });

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
