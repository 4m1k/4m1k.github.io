(function() {
  'use strict';

  var Defined = {
    api: 'lampac',
    localhost: 'https://akter-black.com/',
    apn: '10'
  };

  function BlazorNet() {
    this.net = new Lampa.Reguest();
    this.timeout = function(time) {
      this.net.timeout(time);
    };
    this.req = function(type, url, secuses, error, post) {
      var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      var path = url.split(Defined.localhost).pop().split('?');
      if (path[0].indexOf('http') >= 0) return this.net[type](url, secuses, error, post, params);
      DotNet.invokeMethodAsync("JinEnergy", path[0], path[1]).then(function(result) {
        if (params.dataType == 'text') secuses(result);
        else secuses(Lampa.Arrays.decodeJson(result, {}));
      })["catch"](function(e) {
        console.log('Blazor', 'error:', e);
        error(e);
      });
    };
    this.silent = function(url, secuses, error, post) {
      var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      this.req('silent', url, secuses, error, post, params);
    };
    this["native"] = function(url, secuses, error, post) {
      var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      this.req('native', url, secuses, error, post, params);
    };
    this.clear = function() {
      this.net.clear();
    };
  }

  var Network = Lampa.Reguest;
  // Если нужно использовать BlazorNet, раскомментируйте следующую строку:
  // var Network = Defined.api.indexOf('pwa') == 0 && typeof Blazor !== 'undefined' ? BlazorNet : Lampa.Reguest;

  function component(object) {
    var network = new Network();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);
    var sources = {};
    var last;
    var source;
    var balanser;
    var initialized;
    var balanser_timer;
    var images = [];
    var number_of_requests = 0;
    var number_of_requests_timer;
    var life_wait_times = 0;
    var life_wait_timer;
    var hubConnection;
    var hub_timer;
    var filter_sources = {};
    var filter_translate = {
      season: Lampa.Lang.translate('torrent_serial_season'),
      voice: Lampa.Lang.translate('torrent_parser_voice'),
      source: Lampa.Lang.translate('settings_rest_source')
    };
    var filter_find = {
      season: [],
      voice: []
    };
    var balansers_with_search = [
      'kinotochka', 'kinopub', 'lumex', 'filmix', 'filmixtv', 'redheadsound',
      'animevost', 'animego', 'animedia', 'animebesst', 'anilibria', 'rezka',
      'rhsprem', 'kodik', 'remux', 'animelib', 'kinoukr', 'rc/filmix',
      'rc/fxapi', 'rc/kinopub', 'rc/rhs', 'vcdn'
    ];

    // ============================================================================
    // Изменённая функция account – теперь жёстко добавляется ab_token
    function account(url) {
      url = url + '';
      if (url.indexOf('account_email=') === -1) {
        var email = Lampa.Storage.get('account_email');
        if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));
      }
      if (url.indexOf('uid=') === -1) {
        var uid = Lampa.Storage.get('lampac_unic_id', '');
        if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));
      }
      // Вместо получения токена из хранилища, добавляем фиксированное значение:
      url = Lampa.Utils.addUrlComponent(url, 'ab_token=Z18GTIeNYL801YzUSii7Qjfo');
      return url;
    }
    // ============================================================================

    function balanserName(j) {
      var bals = j.balanser;
      var name = j.name.split(' ')[0];
      return (bals || name).toLowerCase();
    }

    function clarificationSearchAdd(value) {
      var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
      var all = Lampa.Storage.get('clarification_search', '{}');
      all[id] = value;
      Lampa.Storage.set('clarification_search', all);
    }

    function clarificationSearchDelete() {
      var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
      var all = Lampa.Storage.get('clarification_search', '{}');
      delete all[id];
      Lampa.Storage.set('clarification_search', all);
    }

    function clarificationSearchGet() {
      var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
      var all = Lampa.Storage.get('clarification_search', '{}');
      return all[id];
    }

    this.initialize = function() {
      var _this = this;
      this.loading(true);
      filter.onSearch = function(value) {
        clarificationSearchAdd(value);
        Lampa.Activity.replace({
          search: value,
          clarification: true
        });
      };
      filter.onBack = function() {
        _this.start();
      };
      filter.render().find('.selector').on('hover:enter', function() {
        clearInterval(balanser_timer);
      });
      filter.render().find('.filter--search').appendTo(filter.render().find('.torrent-filter'));
      filter.onSelect = function(type, a, b) {
        if (type === 'filter') {
          if (a.reset) {
            clarificationSearchDelete();
            _this.replaceChoice({
              season: 0,
              voice: 0,
              voice_url: '',
              voice_name: ''
            });
            setTimeout(function() {
              Lampa.Select.close();
              Lampa.Activity.replace({ clarification: 0 });
            }, 10);
          } else {
            var url = filter_find[a.stype][b.index].url;
            var choice = _this.getChoice();
            if (a.stype === 'voice') {
              choice.voice_name = filter_find.voice[b.index].title;
              choice.voice_url = url;
            }
            choice[a.stype] = b.index;
            _this.saveChoice(choice);
            _this.reset();
            _this.request(url);
            setTimeout(Lampa.Select.close, 10);
          }
        } else if (type === 'sort') {
          Lampa.Select.close();
          object.lampac_custom_select = a.source;
          _this.changeBalanser(a.source);
        }
      };
      if (filter.addButtonBack) filter.addButtonBack();
      filter.render().find('.filter--sort span').text(Lampa.Lang.translate('lampac_balanser'));
      scroll.body().addClass('torrent-list');
      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.minus(files.render().find('.explorer__files-head'));
      scroll.body().append(Lampa.Template.get('lampac_content_loading'));
      Lampa.Controller.enable('content');
      this.loading(false);
      this.externalids().then(function() {
        return _this.createSource();
      }).then(function(json) {
        if (!balansers_with_search.find(function(b) {
            return balanser.slice(0, b.length) === b;
          })) {
          filter.render().find('.filter--search').addClass('hide');
        }
        _this.search();
      })["catch"](function(e) {
        _this.noConnectToServer(e);
      });
    };

    // ... остальные функции плагина (request, parse, display, reset, etc.) остаются без изменений ...

    this.start = function() {
      if (Lampa.Activity.active().activity !== this.activity) return;
      if (!initialized) {
        initialized = true;
        this.initialize();
      }
      Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
      Lampa.Controller.add('content', {
        toggle: function() {
          Lampa.Controller.collectionSet(scroll.render(), files.render());
          Lampa.Controller.collectionFocus(last || false, scroll.render());
        },
        gone: function() {
          clearTimeout(balanser_timer);
        },
        up: function() {
          if (Navigator.canmove('up')) {
            Navigator.move('up');
          } else {
            Lampa.Controller.toggle('head');
          }
        },
        down: function() {
          Navigator.move('down');
        },
        right: function() {
          if (Navigator.canmove('right')) Navigator.move('right');
          else filter.show(Lampa.Lang.translate('title_filter'), 'filter');
        },
        left: function() {
          if (Navigator.canmove('left')) Navigator.move('left');
          else Lampa.Controller.toggle('menu');
        },
        back: this.back.bind(this)
      });
      Lampa.Controller.toggle('content');
    };

    this.render = function() {
      return files.render();
    };

    this.back = function() {
      Lampa.Activity.backward();
    };

    this.pause = function() {};
    this.stop = function() {};
    this.destroy = function() {
      network.clear();
      // Очистка изображений и остановка таймеров
      images.forEach(function(img) {
        img.onerror = null;
        img.onload = null;
        img.src = '';
      });
      files.destroy();
      scroll.destroy();
      clearInterval(balanser_timer);
      clearTimeout(life_wait_timer);
      clearTimeout(hub_timer);
      if (hubConnection) {
        hubConnection.stop();
        hubConnection = null;
      }
    };
  } // end component

  function startPlugin() {
    window.lampac_plugin = true;
    var manifst = {
      type: 'video',
      version: '2',
      name: '4m1K',
      description: 'Плагин для просмотра онлайн сериалов и фильмов',
      component: 'lampac',
      onContextMenu: function(object) {
        return {
          name: Lampa.Lang.translate('lampac_watch'),
          description: 'Плагин для просмотра онлайн сериалов и фильмов'
        };
      },
      onContextLauch: function(object) {
        resetTemplates();
        Lampa.Component.add('lampac', component);
        var id = Lampa.Utils.hash(object.number_of_seasons ? object.original_name : object.original_title);
        var all = Lampa.Storage.get('clarification_search', '{}');
        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'lampac',
          search: all[id] ? all[id] : object.title,
          search_one: object.title,
          search_two: object.original_title,
          movie: object,
          page: 1,
          clarification: all[id] ? true : false
        });
      }
    };
    Lampa.Manifest.plugins = manifst;
    Lampa.Lang.add({
      lampac_watch: { ru: 'Онлайн', en: 'Online', uk: 'Онлайн', zh: '在线观看' },
      lampac_video: { ru: 'Видео', en: 'Video', uk: 'Відео', zh: '视频' },
      lampac_no_watch_history: { ru: 'Нет истории просмотра', en: 'No browsing history', ua: 'Немає історії перегляду', zh: '没有浏览历史' },
      lampac_nolink: { ru: 'Не удалось извлечь ссылку', uk: 'Неможливо отримати посилання', en: 'Failed to fetch link', zh: '获取链接失败' },
      lampac_balanser: { ru: 'Источник', uk: 'Джерело', en: 'Source', zh: '来源' },
      helper_online_file: { ru: 'Удерживайте клавишу "ОК" для вызова контекстного меню', uk: 'Утримуйте клавішу "ОК" для виклику контекстного меню', en: 'Hold the "OK" key to bring up the context menu', zh: '按住“确定”键调出上下文菜单' },
      title_online: { ru: 'Онлайн', uk: 'Онлайн', en: 'Online', zh: '在线的' },
      lampac_voice_subscribe: { ru: 'Подписаться на перевод', uk: 'Підписатися на переклад', en: 'Subscribe to translation', zh: '订阅翻译' },
      lampac_voice_success: { ru: 'Вы успешно подписались', uk: 'Ви успішно підписалися', en: 'You have successfully subscribed', zh: '您已成功订阅' },
      lampac_voice_error: { ru: 'Возникла ошибка', uk: 'Виникла помилка', en: 'An error has occurred', zh: '发生了错误' },
      lampac_clear_all_marks: { ru: 'Очистить все метки', uk: 'Очистити всі мітки', en: 'Clear all labels', zh: '清除所有标签' },
      lampac_clear_all_timecodes: { ru: 'Очистить все тайм-коды', uk: 'Очистити всі тайм-коды', en: 'Clear all timecodes', zh: '清除所有时间代码' },
      lampac_change_balanser: { ru: 'Изменить балансер', uk: 'Змінити балансер', en: 'Change balancer', zh: '更改平衡器' },
      lampac_balanser_dont_work: { ru: 'Поиск на ({balanser}) не дал результатов', uk: 'Пошук на ({balanser}) не дав результатів', en: 'Search on ({balanser}) did not return any results', zh: '搜索 ({balanser}) 未返回任何结果' },
      lampac_balanser_timeout: { ru: 'Источник будет переключен автоматически через <span class="timeout">10</span> секунд.', uk: 'Джерело буде автоматично переключено через <span class="timeout">10</span> секунд.', en: 'The source will be switched automatically after <span class="timeout">10</span> seconds.', zh: '平衡器将在<span class="timeout">10</span>秒内自动切换。' },
      lampac_does_not_answer_text: { ru: 'Поиск на ({balanser}) не дал результатов', uk: 'Пошук на ({balanser}) не дав результатів', en: 'Search on ({balanser}) did not return any results', zh: '搜索 ({balanser}) 未返回任何结果' }
    });
    Lampa.Template.add('lampac_css', "\n        <style>\n        /* CSS стили опущены для краткости */\n        </style>\n    ");
    $('body').append(Lampa.Template.get('lampac_css', {}, true));

    function resetTemplates() {
      Lampa.Template.add('lampac_prestige_full', "<div class=\"online-prestige online-prestige--full selector\">\n            <div class=\"online-prestige__img\">\n                <img alt=\"\">\n                <div class=\"online-prestige__loader\"></div>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n                <div class=\"online-prestige__timeline\"></div>\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                    <div class=\"online-prestige__quality\">{quality}</div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_content_loading', "<div class=\"online-empty\">\n            <div class=\"broadcast__scan\"><div></div></div>\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template selector\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_does_not_answer', "<div class=\"online-empty\">\n            <div class=\"online-empty__title\">\n                #{lampac_balanser_dont_work}\n            </div>\n            <div class=\"online-empty__time\">\n                #{lampac_balanser_timeout}\n            </div>\n            <div class=\"online-empty__buttons\">\n                <div class=\"online-empty__button selector cancel\">#{cancel}</div>\n                <div class=\"online-empty__button selector change\">#{lampac_change_balanser}</div>\n            </div>\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
    }
  }

  if (!window.lampac_plugin) startPlugin();

})();
