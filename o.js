(function() {

var vybor = [
'http://online3.skaz.tv/',
'http://online4.skaz.tv/',
'http://online5.skaz.tv/'
];
var randomIndex = Math.floor(Math.random() * vybor.length);
var randomUrl = vybor[randomIndex];

  var Defined = {
    api: 'lampac',
    localhost: randomUrl,
    apn: 'https://apn.watch/'
  };

  var balansers_with_search;
  
var unic_id = Lampa.Storage.get('lampac_unic_id', '');
if (!unic_id) {
  unic_id = 'ofkrtxdg';
  Lampa.Storage.set('lampac_unic_id', unic_id);
}

if (!Lampa.Storage.get('account_email', '')) {
  Lampa.Storage.set('account_email', 'lisiyvirus@gmail.com');
}

  
  var hostkey = 'http://online3.skaz.tv'.replace('http://', '').replace('https://', '');

  if (!window.rch || !window.rch[hostkey]) {
    Lampa.Utils.putScript(["http://online3.skaz.tv/invc-rch.js"], function() {
      window.rch[hostkey].typeInvoke('http://online3.skaz.tv', function() {});
    }, false, function() {
      console.log('Lampac', 'error load invc-rch.js');
    }, true);
  }

  // 🔽 Компонент для онлайн
  function component(object) {
    var network = new Lampa.Reguest();
    var results = [];
    var last;

    this.create = function() {
      this.activity.loader(true);

      var url = Defined.localhost + 'lampac/' + object.search + (object.clarification ? '?clarification=true' : '');

      network.silent(url, this.build.bind(this), this.fail.bind(this));
    };

    this.build = function(data) {
      this.activity.loader(false);

      if (!data) {
        this.empty();
        return;
      }

      results = data.result || [];

      if (!results.length) {
        this.empty();
        return;
      }

      results.forEach(function(item) {
        item.title = item.name;
        item.original_title = item.orig;
        item.release_year = item.year;
      });

      this.draw(results);
    };

    this.fail = function() {
      this.empty();
    };

    this.empty = function() {
      var empty = Lampa.Template.get('empty');
      this.activity.render().append(empty);
    };

    this.draw = function(items) {
      var scroll = new Lampa.Scroll({mask: true});
      var html = $('<div class="content__view"></div>');

      items.forEach(function(item) {
        var card = Lampa.Template.get('card', item);
        card.on('hover:focus', function() {
          last = card[0];
        });

        html.append(card);
      });

      scroll.render().find('.scroll__body').append(html);
      this.activity.render().append(scroll.render());

      scroll.update();
    };
  }

  function resetTemplates() {
    Lampa.Template.cache = {};
  }
  
  function startPlugin() {
    window.onlyskaz_plugin = true;

    var manifst = {
      type: 'video',
      version: '',
      name: 'Onlyskaz',
      description: 'Плагин для просмотра онлайн сериалов и фильмов',
      component: 'lampacskaz',
      onContextMenu: function onContextMenu(object) {
        return {
          name: Lampa.Lang.translate('lampac_watch'),
          description: ''
        };
      },
      onContextLauch: function onContextLauch(object) {
        resetTemplates();
        Lampa.Component.add('lampacskaz', component);

        var id = Lampa.Utils.hash(object.number_of_seasons ? object.original_name : object.original_title);
        var all = Lampa.Storage.get('clarification_search','{}');

        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'lampacskaz',
          search: all[id] ? all[id] : object.title,
          search_one: object.title,
          search_two: object.original_title,
          movie: object,
          page: 1,
          clarification: all[id] ? true : false
        });
      }
    };

    // ❌ Убрано addSourceSearch (чтобы не было ошибки)
    Lampa.Manifest.plugins = manifst;

    // Переводы
    Lampa.Lang.add({
      lampac_watch: { ru: 'Смотреть онлайн', en: 'Watch online', uk: 'Дивитися онлайн', zh: '在线观看' },
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
      lampac_clear_all_timecodes: { ru: 'Очистить все тайм-коды', uk: 'Очистити всі тайм-коди', en: 'Clear all timecodes', zh: '清除所有时间代码' },
      lampac_change_balanser: { ru: 'Изменить балансер', uk: 'Змінити балансер', en: 'Change balancer', zh: '更改平衡器' },
      lampac_balanser_dont_work: { ru: 'Поиск на ({balanser}) не дал результатов', uk: 'Пошук на ({balanser}) не дав результатів', en: 'Search on ({balanser}) did not return any results', zh: '搜索 ({balanser}) 未返回任何结果' },
      lampac_balanser_timeout: { ru: 'Источник будет переключен автоматически через <span class="timeout">10</span> секунд.', uk: 'Джерело буде автоматично переключено через <span class="timeout">10</span> секунд.', en: 'The source will be switched automatically after <span class="timeout">10</span> seconds.', zh: '平衡器将在<span class="timeout">10</span>秒内自动切换。' },
      lampac_does_not_answer_text: { ru: 'Поиск на ({balanser}) не дал результатов', uk: 'Пошук на ({balanser}) не дав результатів', en: 'Search on ({balanser}) did not return any results', zh: '搜索 ({balanser}) 未返回任何结果' }
    });

    if (Lampa.Manifest.app_digital >= 177) {
      var balansers_sync = ["filmix", "filmixtv", "fxapi", "rezka", "rhsprem", "lumex", "videodb", "collaps", "collaps-dash", "hdvb", "zetflix", "kodik", "ashdi", "kinoukr", "kinotochka", "remux", "iframevideo", "cdnmovies", "anilibria", "animedia", "animego", "animevost", "animebesst", "redheadsound", "alloha", "animelib", "moonanime", "kinopub", "vibix", "vdbmovies", "fancdn", "cdnvideohub", "vokino", "rc/filmix", "rc/fxapi", "rc/rhs", "vcdn", "videocdn", "mirage", "hydraflix","videasy","vidsrc","movpi","vidlink","twoembed","autoembed","smashystream","autoembed","rgshows", "pidtor", "videoseed", "iptvonline", "veoveo"];
      balansers_sync.forEach(function(name) {
        Lampa.Storage.sync('online_choice_' + name, 'object_object');
      });
      Lampa.Storage.sync('online_watched_last', 'object_object');
    }
  }

  if (!window.onlyskaz_plugin) startPlugin();

  $.getScript('http://skaz.tv/lampac-src-filter.js');
  if (Lampa.Storage.get('online_skaz2')==true) {
    $.getScript('http://skaz.tv/play.js');
  }
})();
