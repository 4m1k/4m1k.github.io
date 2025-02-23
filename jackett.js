(function () {
    'use strict';

    Lampa.Platform.tv();

    const parsersInfo = [
        { name: "Lampa32", url: "79.137.204.8:2601", key: "" },
        { name: "Jacred.xyz", url: "jacred.xyz", key: "" },
        { name: "Jacred Pro", url: "jacred.pro", key: "" },
        { name: "Viewbox", url: "jacred.viewbox.dev", key: "viewbox" },
        { name: "JAOS My To Jacred", url: "trs.my.to:9117", key: "" },
        { name: "Johnny Jacred", url: "altjacred.duckdns.org", key: "" }
    ];

    const proto = location.protocol === "https:" ? "https://" : "http://";
    let cache = {};

    function checkAlive() {
        const requests = parsersInfo.map(parser => {
            const myLink = `${proto}${parser.url}/api/v2.0/indexers/status:healthy/results?apikey=${parser.key}`;
            if (cache[myLink]) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                $.ajax({
                    url: myLink,
                    method: 'GET',
                    success: function (response, textStatus, xhr) {
                        const color = xhr.status === 200 ? '1aff00' : 'ff2e36';
                        cache[myLink] = { color };
                    },
                    error: function () {
                        cache[myLink] = { color: 'ff2e36' };
                    },
                    complete: function () {
                        resolve();
                    }
                });
            });
        });
        return Promise.all(requests);
    }

    function showParserSelectionMenu() {
        checkAlive().then(() => {
            const currentSelected = Lampa.Storage.get('selected_parser');
            const items = parsersInfo.map(parser => {
                const color = cache[`${proto}${parser.url}/api/v2.0/indexers/status:healthy/results?apikey=${parser.key}`]?.color || 'inherit';
                const activeMark = parser.name === currentSelected ? '<span style="color: #4285f4; margin-right: 5px;">✔</span>' : '';
                return { title: `${activeMark}<span style="color: #${color};">${parser.name}</span>`, parser };
            });
            Lampa.Select.show({
                title: "Меню смены парсера",
                items,
                onBack: () => Lampa.Controller.toggle("settings_component"),
                onSelect: item => {
                    Lampa.Storage.set('jackett_url', item.parser.url);
                    Lampa.Storage.set('jackett_key', item.parser.key);
                    Lampa.Storage.set('selected_parser', item.parser.name);
                    updateParserField(item.parser.name);
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
            values: Object.fromEntries(parsersInfo.map(p => [p.url, p.name])),
            default: parsersInfo[0]?.url || 'no_parser'
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
