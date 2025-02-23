(function () {
  'use strict';

  Lampa.Platform.tv();

  (function () {
    var _0x5e29f6 = function () {
      var _0x5801f7 = true;
      return function (_0x41c9fa, _0x51fa86) {
        var _0x2763c1 = _0x5801f7 ? function () {
          if (_0x51fa86) {
            var _0x21967a = _0x51fa86.apply(_0x41c9fa, arguments);
            _0x51fa86 = null;
            return _0x21967a;
          }
        } : function () {};
        _0x5801f7 = false;
        return _0x2763c1;
      };
    }();

    var _0x5102de = function () {
      var _0x5a3e03 = true;
      return function (_0xd4adfc, _0x186b64) {
        var _0x1b2908 = _0x5a3e03 ? function () {
          if (_0x186b64) {
            var _0x360836 = _0x186b64.apply(_0xd4adfc, arguments);
            _0x186b64 = null;
            return _0x360836;
          }
        } : function () {};
        _0x5a3e03 = false;
        return _0x1b2908;
      };
    }();

    'use strict';
    Lampa.Platform.tv();
    Lampa.Storage.set("parser_use", true);

    Lampa.Controller.listener.follow("toggle", function (_0x53a610) {
      if (_0x53a610.name == 'select') {
        setTimeout(function () {}, 0xa);
      }
    });

    function _0x1fb528() {
      if (Lampa.Storage.get("jackett_urltwo") == "no_parser") {
        Lampa.Storage.set("jackett_url", '') & Lampa.Storage.set('jackett_key', '') & Lampa.Storage.set('jackett_interview', "all") & Lampa.Storage.set("parse_in_search", false) & Lampa.Storage.set("parse_lang", 'lg');
      }
    }

    Lampa.SettingsApi.addParam({
      'component': "parser",
      'param': {
        'name': "jackett_urltwo",
        'type': "select",
        'values': {
          'no_parser': "Свой вариант",
          'jac_lampa32_ru': "Lampa32",
          'bylampa_jackett': "ByLampa Jackett",
          'jacred_xyz': "Jacred.xyz",
          'jr_maxvol_pro': "Jacred Maxvol Pro",
          'jacred_my_to': "Jacred Pro",
          'jacred_viewbox_dev': "Viewbox",
          'spawn_jacred': "JAOS My To Jacred",
          'spawn_jackett': "Spawn Jackett",
          'altjacred_duckdns_org': "Johnny Jacred"
        },
        'default': 'jacred_xyz'
      },
      'field': {
        'name': "Выбрать парсер",
        'description': "Нажмите для выбора парсера из списка"
      },
      'onChange': function (_0x2d4567) {
        _0x1fb528();
        Lampa.Settings.update();
      }
    });

    Lampa.Storage.listener.follow("change", function (_0x2b78c6) {
      if (_0x2b78c6.name == "activity") {
        if (Lampa.Activity.active().component == "torrents") {
          _0x378c48();
        } else {
          _0x35cf9d();
        }
      }
    });

    function _0x378c48() {
      _0x35cf9d();
      var _0x5c2ff7 = document.body;
      var _0x2fae70 = {
        'childList': true,
        'subtree': true
      };
      var _0x5a3fae = new MutationObserver(function (_0x490a1b) {
        _0x490a1b.forEach(function (_0x203c12) {
          if ($('.empty__title').length && Lampa.Storage.field('parser_torrent_type') == 'jackett') {
            _0x23967c();
            _0x35cf9d();
          }
        });
      });
      _0x5a3fae.observe(_0x5c2ff7, _0x2fae70);
    }

    function _0x35cf9d() {
      if (_0x5a3fae) {
        _0x5a3fae.disconnect();
        _0x5a3fae = null;
      }
    }
  })();
})();
