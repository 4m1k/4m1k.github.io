(function() {
  'use strict';
  var Defined = {
    api: 'lampac',
    localhost: 'http://89.110.72.185:9118/',
    apn: ''
  };
  var unic_id = Lampa.Storage.get('lampac_unic_id', '');
  if (!unic_id) {
    unic_id = Lampa.Utils.uid(8).toLowerCase();
    Lampa.Storage.set('lampac_unic_id', unic_id);
  }
  if (!window.rch) {
    Lampa.Utils.putScript(["http://89.110.72.185:9118/invc-rch.js"], function() {}, false, function() {
      if (!window.rch.startTypeInvoke)
        window.rch.typeInvoke('http://89.110.72.185:9118', function() {});
    }, true);
  }
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
  function component(object) {
    // ... (остальной код компонента)
  }
  function startPlugin() {
    window.lampac_plugin = true;
    var manifst = {
      type: 'video',
      version: '1.4.3',
      name: 'Lampac',
      description: 'Плагин для просмотра онлайн сериалов и фильмов',
      component: 'lampac',
      onContextMenu: function onContextMenu(object) {
        return {
          name: Lampa.Lang.translate('lampac_watch'),
          description: 'Плагин для просмотра онлайн сериалов и фильмов'
        };
      },
      onContextLauch: function onContextLauch(object) {
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
      lampac_watch: { //
        ru: 'Смотреть онлайн',
        en: 'Watch online',
        uk: 'Дивитися онлайн',
        zh: '在线观看'
      },
      lampac_video: { //
        ru: 'Видео',
        en: 'Video',
        uk: 'Відео',
        zh: '视频'
      },
      lampac_no_watch_history: {
        ru: 'Нет истории просмотра',
        en: 'No browsing history',
        ua: 'Немає історії перегляду',
        zh: '没有浏览历史'
      },
      lampac_nolink: {
        ru: 'Не удалось извлечь ссылку',
        uk: 'Неможливо отримати посилання',
        en: 'Failed to fetch link',
        zh: '获取链接失败'
      },
      lampac_balanser: { //
        ru: 'Источник',
        uk: 'Джерело',
        en: 'Source',
        zh: '来源'
      },
      helper_online_file: { //
        ru: 'Удерживайте клавишу "ОК" для вызова контекстного меню',
        uk: 'Утримуйте клавішу "ОК" для виклику контекстного меню',
        en: 'Hold the "OK" key to bring up the context menu',
        zh: '按住“确定”键调出上下文菜单'
      },
      title_online: { //
        ru: 'Онлайн',
        uk: 'Онлайн',
        en: 'Online',
        zh: '在线的'
      },
      lampac_voice_subscribe: { //
        ru: 'Подписаться на перевод',
        uk: 'Підписатися на переклад',
        en: 'Subscribe to translation',
        zh: '订阅翻译'
      },
      lampac_voice_success: { //
        ru: 'Вы успешно подписались',
        uk: 'Ви успішно підписалися',
        en: 'You have successfully subscribed',
        zh: '您已成功订阅'
      },
      lampac_voice_error: { //
        ru: 'Возникла ошибка',
        uk: 'Виникла помилка',
        en: 'An error has occurred',
        zh: '发生了错误'
      },
      lampac_clear_all_marks: { //
        ru: 'Очистить все метки',
        uk: 'Очистити всі мітки',
        en: 'Clear all labels',
        zh: '清除所有标签'
      },
      lampac_clear_all_timecodes: { //
        ru: 'Очистить все тайм-коды',
        uk: 'Очистити всі тайм-коди',
        en: 'Clear all timecodes',
        zh: '清除所有时间代码'
      },
      lampac_change_balanser: { //
        ru: 'Изменить балансер',
        uk: 'Змінити балансер',
        en: 'Change balancer',
        zh: '更改平衡器'
      },
      lampac_balanser_dont_work: { //
        ru: 'Поиск на ({balanser}) не дал результатов',
        uk: 'Пошук на ({balanser}) не дав результатів',
        en: 'Search on ({balanser}) did not return any results',
        zh: '搜索 ({balanser}) 未返回任何结果'
      },
      lampac_balanser_timeout: { //
        ru: 'Источник будет переключен автоматически через 10 секунд.',
        uk: 'Джерело буде автоматично переключено через 10 секунд.',
        en: 'The source will be switched automatically after 10 seconds.',
        zh: 'Балансер будет автоматически переключен через 10 секунд.'
      },
      lampac_does_not_answer_text: {
        ru: 'Поиск на ({balanser}) не дал результатов',
        uk: 'Пошук на ({balanser}) не дав результатів',
        en: 'Search on ({balanser}) did not return any results',
        zh: 'Поиск ({balanser}) не дал результатов'
      }
    });
    Lampa.Template.add('lampac_css', "\n\t\n    ");
    $('body').append(Lampa.Template.get('lampac_css', {}, true));
    function resetTemplates() {
      Lampa.Template.add('lampac_prestige_full', "\n\t\n\t\n\t\n\t\n\t\n\t{title}\n\t{time}\n\t\n\n\t\n\n\t\n\t{info}\n\t{quality}\n\t\n\t\n\t");
      Lampa.Template.add('lampac_content_loading', "\n\t\n\t\t\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t");
      Lampa.Template.add('lampac_does_not_answer', "\n\t\n\t#{lampac_balanser_dont_work}\n\t\n\t\n\t#{lampac_balanser_timeout}\n\t\n\t\n\t#{cancel}\n\t#{lampac_change_balanser}\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t");
      Lampa.Template.add('lampac_prestige_rate', "\n\t\n\t\n\t\n\t{rate}\n\t");
      Lampa.Template.add('lampac_prestige_folder', "\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t{title}\n\t{time}\n\t\n\n\t\n\t{info}\n\t\n\t\n\t");
      Lampa.Template.add('lampac_prestige_watched', "\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t");
    }
    var button = "\n\t\n\t\n\t\n\t\n\t\n\t\n\n\t#{title_online}\n    "; // нужна заглушка, а то при страте лампы говорит пусто
    Lampa.Component.add('lampac', component); //то же самое
    resetTemplates();
    function addButton(e) {
      if (e.render.find('.showy--button').length) return;
      var btn = $(Lampa.Lang.translate(button));
      btn.on('hover:enter', function() {
        resetTemplates();
        Lampa.Component.add('showy', component);
        var id = Lampa.Utils.hash(e.movie.number_of_seasons ? e.movie.original_name : e.movie.original_title);
        var all = Lampa.Storage.get('clarification_search', '{}');
        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'showy',
          search: all[id] ? all[id] : e.movie.title,
          search_one: e.movie.title,
          search_two: e.movie.original_title,
          movie: e.movie,
          page: 1,
          clarification: all[id] ? true : false
        });
      });
      e.render.before(btn);
    }
    Lampa.Listener.follow('full', function(e) {
      if (e.type == 'complite') {
        if (Lampa.Storage.get('card_interfice_type') === 'new') {
          addButton({
            render: e.object.activity.render().find('.button--play'),
            movie: e.data.movie
          });
        } else {
          addButton({
            render: e.object.activity.render().find('.view--torrent'),
            movie: e.data.movie
          });
        }
      }
    });
    try {
      if (Lampa.Activity.active().component == 'full') {
        addButton({
          render: Lampa.Activity.active().activity.render().find('.view--torrent'),
          movie: Lampa.Activity.active().card
        });
      }
    } catch (e) {}
    if (Lampa.Manifest.app_digital >= 177) {
      var balansers_sync = ["filmix", 'filmixtv', "fxapi", "rezka", "rhsprem", "lumex", "videodb", "collaps", "hdvb", "zetflix", "kodik", "ashdi", "kinoukr", "kinotochka", "remux", "iframevideo", "cdnmovies", "anilibria", "animedia", "animego", "animevost", "animebesst", "redheadsound", "alloha", "animelib", "moonanime", "kinopub", "vibix", "vdbmovies", "fancdn", "cdnvideohub", "vokino", "rc/filmix", "rc/fxapi", "rc/kinopub", "rc/rhs", "vcdn"];
      balansers_sync.forEach(function(name) {
        Lampa.Storage.sync('online_choice_' + name, 'object_object');
      });
      Lampa.Storage.sync('online_watched_last', 'object_object');
    }
  }
  if (!window.lampac_plugin) startPlugin();
})();