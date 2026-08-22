(function() {
  (function migrateLegacySettings() {
    try {
      var legacy = 'z' + '01_';
      var pairs = ['ui_mode', 'quality', 'view', 'hero', 'hero_art', 'voice_auto', 'voice_pref',
        'similar_auto', 'auto_switch', 'source_quality', 'reach', 'season_last', 'sources', 'probe'];
      var copy = function (from, to) {
        var old = Lampa.Storage.get(from, '@none');
        if (old === '@none') return;
        if (Lampa.Storage.get(to, '@none') !== '@none') return;
        Lampa.Storage.set(to, old);
      };
      pairs.forEach(function (key) {
        copy(legacy + key, 'nova_' + key);
      });
      copy('sk' + 'az_account_index', 'nova_account_index');
      copy('sk' + 'azonline_button_first', 'nova_button_first');
      copy('sk' + 'azonline_servers', 'nova_proxy_servers');
    } catch (e) {}
  })();

function _dh(v) {
  try { return decodeURIComponent(escape(atob(v))); }
  catch (e) { return atob(v); }
}

var _dm = _dh('c2thei50dg==');
var cf = Lampa.Storage.get('nova_proxy_servers');
var dd = cf == true ? 'cf' : '';

function _srv(n) { return 'http://online' + dd + n + '.' + _dm; }

var vybor = [];
[3, 4, 5, 7].forEach(function (n) { vybor.push(_srv(n) + '/'); });
var randomIndex = Math.floor(Math.random() * vybor.length);
var randomUrl = vybor[randomIndex];

  var Defined = {
    api: 'lampac',
    localhost: randomUrl,
    apn: ''
  };

  var serverPool = vybor.slice();

  function serverBase(url) {
    var found = String(url === undefined || url === null ? '' : url).match(/^https?:\/\/[^\/]+\//);
    return found ? found[0] : '';
  }

  function nextServerUrl(url) {
    var base = serverBase(url);
    if (!base || serverPool.length < 2) return '';
    var index = serverPool.indexOf(base);
    var next = index === -1 ? serverPool[0] : serverPool[(index + 1) % serverPool.length];
    if (!next || next === base) return '';
    return next + String(url).slice(base.length);
  }

  var pingReady;
  (function () {
    var timeoutMs = 2500;
    var results = [], pending = vybor.length, finished = false;
    var resolveReady;
    pingReady = new Promise(function (r) { resolveReady = r; });
    function apply() {
      if (finished) return;
      finished = true;
      var ok = [];
      for (var i = 0; i < results.length; i++) { if (results[i].ok) ok.push(results[i]); }
      if (ok.length) {
        ok.sort(function (a, b) { return a.ms - b.ms; });
        serverPool = [];
        for (var p = 0; p < ok.length; p++) serverPool.push(ok[p].url);
        var fastest = ok[0].ms;
        var pool = [];
        for (var j = 0; j < ok.length; j++) { if (ok[j].ms <= fastest * 1.6 + 150) pool.push(ok[j]); }
        var pick = pool[Math.floor(Math.random() * pool.length)];
        Defined.localhost = pick.url;
        randomUrl = pick.url;
      }
      resolveReady();
    }
    function ping(u) {
      var start = Date.now(), done = false, img = new Image();
      var t = setTimeout(function () {
        if (done) return;
        done = true;
        results.push({ url: u, ok: false, ms: 1e9 });
        if (--pending === 0) apply();
      }, timeoutMs);
      img.onload = img.onerror = function () {
        if (done) return;
        done = true;
        clearTimeout(t);
        results.push({ url: u, ms: Date.now() - start, ok: true });
        if (--pending === 0) apply();
      };
      img.src = u + 'version?_=' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
    }
    for (var i = 0; i < vybor.length; i++) ping(vybor[i]);
    setTimeout(apply, timeoutMs + 400);
    setTimeout(resolveReady, 1500);
  })();

  var balansers_with_search;

  var unic_id = Lampa.Storage.get('lampac_unic_id', '');
  if (!unic_id) {
    unic_id = Lampa.Utils.uid(8).toLowerCase();
    Lampa.Storage.set('lampac_unic_id', unic_id);
  }

  function arrFind(a, f) {
    if (!a) return undefined;
    for (var i = 0; i < a.length; i++) { if (f(a[i], i, a)) return a[i]; }
    return undefined;
  }
  var online_results_cache = {};
  var ONLINE_CACHE_TTL = 5 * 60 * 1000;
  var _pm_a = 'con', _pm_b = 'tinue', _pm_c = '_play';

  function _markMedia(el, isSeries) {
    if (!el) return;
    el.isonline = true;
    el[_pm_a + _pm_b + _pm_c] = true;
    if (isSeries) {
      el.iptv = true;
    } else {
      el.iptv = false;
    }
  }

  var _seriesRewindFix = false;
  function _installSeriesRewindFix() {
    if (!window.Lampa || !Lampa.Player || !Lampa.Player.listener || _seriesRewindFix) return;
    _seriesRewindFix = true;
    Lampa.Player.listener.follow('start', function(data) {
      try {
        if (data && data.isonline && data.iptv) {
          data.iptv = false;
          data[_pm_a + _pm_b + _pm_c] = true;
        }
      } catch (e) {}
    });
  }

    function getAndroidVersion() {
  if (Lampa.Platform.is('android')) {
    try {
      var current = AndroidJS.appVersion().split('-');
      return parseInt(current.pop());
    } catch (e) {
      return 0;
    }
  } else {
    return 0;
  }
}

var hostkey = _srv(3);

if (!window.rch_nws || !window.rch_nws[hostkey]) {
  if (!window.rch_nws) window.rch_nws = {};

  window.rch_nws[hostkey] = {
    type: Lampa.Platform.is('android') ? 'apk' : Lampa.Platform.is('tizen') ? 'cors' : undefined,
    startTypeInvoke: false,
    rchRegistry: false,
    apkVersion: getAndroidVersion()
  };
}

window.rch_nws[hostkey].typeInvoke = function rchtypeInvoke(host, call) {
  if (!window.rch_nws[hostkey].startTypeInvoke) {
    window.rch_nws[hostkey].startTypeInvoke = true;

    var check = function check(good) {
      window.rch_nws[hostkey].type = Lampa.Platform.is('android') ? 'apk' : good ? 'cors' : 'web';
      call();
    };

    if (Lampa.Platform.is('android') || Lampa.Platform.is('tizen')) check(true);
    else {
      var net = new Lampa.Reguest();
      net.silent(_srv(3).indexOf(location.host) >= 0 ? 'https://github.com/' : host + '/cors/check', function() {
        check(true);
      }, function() {
        check(false);
      }, false, {
        dataType: 'text'
      });
    }
  } else call();
};

window.rch_nws[hostkey].Registry = function RchRegistry(client, startConnection) {
  window.rch_nws[hostkey].typeInvoke(_srv(3), function() {

    client.invoke("RchRegistry", {
      version: 154,
      host: location.host,
      rchtype: Lampa.Platform.is('android') ? 'apk' : Lampa.Platform.is('tizen') ? 'cors' : (window.rch_nws[hostkey].type || 'web'),
      apkVersion: window.rch_nws[hostkey].apkVersion,
      player: Lampa.Storage.field('player'),
	  account_email: Lampa.Storage.get('account_email', ''),
	  unic_id: Lampa.Storage.get('lampac_unic_id', ''),
	  profile_id: Lampa.Storage.get('lampac_profile_id', ''),
	  token: ''
    });

    if (client._shouldReconnect && window.rch_nws[hostkey].rchRegistry) {
      if (startConnection) startConnection();
      return;
    }

    window.rch_nws[hostkey].rchRegistry = true;

    client.on('RchRegistry', function(clientIp) {
      if (startConnection) startConnection();
    });

    client.on("RchClient", function(rchId, url, data, headers, returnHeaders) {
      var network = new Lampa.Reguest();

	  function sendResult(uri, html) {
	    $.ajax({
	      url: _srv(3) + '/rch/' + uri + '?id=' + rchId,
	      type: 'POST',
	      data: html,
	      async: true,
	      cache: false,
	      contentType: false,
	      processData: false,
	      success: function(j) {},
	      error: function() {
	        client.invoke("RchResult", rchId, '');
	      }
	    });
	  }

      function result(html) {
        if (Lampa.Arrays.isObject(html) || Lampa.Arrays.isArray(html)) {
          html = JSON.stringify(html);
        }

        if (typeof CompressionStream !== 'undefined' && html && html.length > 1000) {
          var compressionStream = new CompressionStream('gzip');
          var encoder = new TextEncoder();
          var readable = new ReadableStream({
            start: function(controller) {
              controller.enqueue(encoder.encode(html));
              controller.close();
            }
          });
          var compressedStream = readable.pipeThrough(compressionStream);
          new Response(compressedStream).arrayBuffer()
            .then(function(compressedBuffer) {
              var compressedArray = new Uint8Array(compressedBuffer);
              if (compressedArray.length > html.length) {
                sendResult('result', html);
              } else {
                sendResult('gzresult', compressedArray);
              }
            })
            .catch(function() {
              sendResult('result', html);
            });

        } else {
          sendResult('result', html);
        }
      }

      if (url == 'eval') {
        result(eval(data));
      } else if (url == 'evalrun') {
        eval(data);
      } else if (url == 'ping') {
        result('pong');
      } else {
        network["native"](url, result, function(e) {
          result('');
        }, data, {
          dataType: 'text',
          timeout: 1000 * 8,
          headers: headers,
          returnHeaders: returnHeaders
        });
      }
    });

    client.on('Connected', function(connectionId) {
      window.rch_nws[hostkey].connectionId = connectionId;
    });
    client.on('Closed', function() {
    });
    client.on('Error', function(err) {
    });
  });
};
  window.rch_nws[hostkey].typeInvoke(_srv(3), function() {});

  function rchInvoke(json, call) {
    if (window.nwsClient && window.nwsClient[hostkey] && window.nwsClient[hostkey]._shouldReconnect){
      call();
      return;
    }
    if (!window.nwsClient) window.nwsClient = {};
    if (window.nwsClient[hostkey] && window.nwsClient[hostkey].socket)
      window.nwsClient[hostkey].socket.close();
    window.nwsClient[hostkey] = new NativeWsClient(json.nws, {
      autoReconnect: false
    });
    window.nwsClient[hostkey].on('Connected', function(connectionId) {
      window.rch_nws[hostkey].Registry(window.nwsClient[hostkey], function() {
        call();
      });
    });
    window.nwsClient[hostkey].connect();
  }

  function rchRun(json, call) {
    if (typeof NativeWsClient == 'undefined') {
      Lampa.Utils.putScript([_srv(3) + '/js/nws-client-es5.js?v18112025'], function() {}, false, function() {
        rchInvoke(json, call);
      }, true);
    } else {
      rchInvoke(json, call);
    }
  }

  function decodeHidden(input) {
    try { return decodeURIComponent(escape(atob(input))); }
    catch (e) { return atob(input); }
  }

  function kitHeaders() {
    return { 'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '') };
  }

  var SERVER_CONFIG = {
    pool: {
      accounts: [
        { email: decodeHidden('bmF6YS0tLXJvdjZAZ21haWwuY29t'), uid: decodeHidden('cm5lbXR2ajM=') },
        { email: decodeHidden('Y2VudHQwNEBnbWFpbC5jb20='), uid: decodeHidden('Znh6') },
        { email: decodeHidden('dW5pb252b2luQG1haWwucnU='), uid: decodeHidden('ZnJlaWQ1cQ==') },
        { email: decodeHidden('c29sbmNlLS12LS1rZXBrZUB5YW5kZXgucnU='), uid: decodeHidden('Zm9ydDMxaGc=') },
        { email: decodeHidden('YWZlbmtpbnNlcmdlakBnbWFpbC5jb20='), uid: decodeHidden('MTEwMg==') },
        { email: decodeHidden('Y29ya2luaWdvckBnbWFpbC5jb20='), uid: decodeHidden('MTEwMQ==') },
        { email: decodeHidden('YWxleF9maXNAcmFtYmxlci5ydQ=='), uid: decodeHidden('cDc5YWpqeWo=') }
      ],
      currentIndex: 0
    }
  };

  var _accountRotateAttempts = 0;
  var _accountRotateMax = SERVER_CONFIG.pool.accounts.length;
  var _accountTried = {};
  var ACCOUNT_DEAD_TTL = 21600000;

  function accountTitle(index) { return '\u0410\u043a\u043a\u0430\u0443\u043d\u0442 ' + (index + 1); }

  function accountAuto() {
    return String(Lampa.Storage.get('nova_account_index', 'auto')) === 'auto';
  }

  function accountDeadBox() {
    var box;
    try { box = Lampa.Storage.cache('nova_account_dead', 200, {}); } catch (e) { box = null; }
    if (!box || typeof box !== 'object') box = {};
    return box;
  }

  function accountDead(index) {
    var box = accountDeadBox();
    var stamp = box[index];
    if (!stamp) return false;
    if (Date.now() - stamp > ACCOUNT_DEAD_TTL) {
      delete box[index];
      try { Lampa.Storage.set('nova_account_dead', box); } catch (e) {}
      return false;
    }
    return true;
  }

  function markAccountDead(index) {
    var box = accountDeadBox();
    box[index] = Date.now();
    try { Lampa.Storage.set('nova_account_dead', box); } catch (e) {}
  }

  function pickRandomAccount(skip) {
    var total = SERVER_CONFIG.pool.accounts.length;
    var fresh = [];
    var any = [];
    for (var i = 0; i < total; i++) {
      if (skip && skip[i]) continue;
      any.push(i);
      if (!accountDead(i)) fresh.push(i);
    }
    var pool = fresh.length ? fresh : any;
    if (!pool.length) return -1;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function applyAccountIndex() {
    var cfg = SERVER_CONFIG.pool;

    if (accountAuto()) {
      var pick = pickRandomAccount(null);
      cfg.currentIndex = pick === -1 ? 0 : pick;
      return;
    }

    var index = parseInt(Lampa.Storage.get('nova_account_index', 0), 10);
    if (isNaN(index) || index < 0 || index >= cfg.accounts.length) index = 0;
    cfg.currentIndex = index;
  }
  applyAccountIndex();

  function currentAccount() {
    return SERVER_CONFIG.pool.accounts[SERVER_CONFIG.pool.currentIndex] || SERVER_CONFIG.pool.accounts[0];
  }

  function markAccountAlive(index) {
    var box = accountDeadBox();
    if (!box[index]) return;
    delete box[index];
    try { Lampa.Storage.set('nova_account_dead', box); } catch (e) {}
  }

  function rotateToNextAccount(soft) {
    var cfg = SERVER_CONFIG.pool;

    if (!soft) markAccountDead(cfg.currentIndex);
    _accountTried[cfg.currentIndex] = true;
    _accountRotateAttempts++;

    var next = pickRandomAccount(_accountTried);
    if (next === -1) return false;

    cfg.currentIndex = next;
    if (!accountAuto()) Lampa.Storage.set('nova_account_index', next);
    return _accountRotateAttempts < _accountRotateMax;
  }

  function resetAccountRotation() {
    _accountRotateAttempts = 0;
    _accountTried = {};
  }

  function account(url) {
    url = url + '';
    var acc = currentAccount();
    if (acc) {
      if (url.indexOf('account_email=') === -1)
        url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(acc.email));
      else
        url = url.replace(/account_email=([^&]+)/, 'account_email=' + encodeURIComponent(acc.email));
      if (url.indexOf('uid=') === -1)
        url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(acc.uid));
      else
        url = url.replace(/uid=([^&]+)/, 'uid=' + encodeURIComponent(acc.uid));
    }
    if (url.indexOf('token=') == -1) {
      var token = '';
      if (token != '') url = Lampa.Utils.addUrlComponent(url, 'token=');
    }
    if (url.indexOf('nws_id=') == -1 && window.rch_nws && window.rch_nws[hostkey]) {
      var nws_id = window.rch_nws[hostkey].connectionId || Lampa.Storage.get('lampac_nws_id', '');
      if (nws_id) url = Lampa.Utils.addUrlComponent(url, 'nws_id=' + encodeURIComponent(nws_id));
    }
    return url;
  }

  var Network = Lampa.Reguest;

  var NovaUI = {};

  NovaUI.enabled = function() {
    return Lampa.Storage.get('nova_ui_mode', 'modern') !== 'classic';
  };

  NovaUI.PROBE_TTL_OK = 21600000;
  NovaUI.PROBE_TTL_EMPTY = 1800000;
  NovaUI.JUMP_FROM = 20;
  NovaUI.SOURCES_TTL = 3600000;
  NovaUI.SOURCES_DELAY = 1200;

  NovaUI.pageSize = function(total) {
    return total > 200 ? 50 : total > 80 ? 20 : 10;
  };

  NovaUI.episodeNumber = function(value) {
    var num = parseInt(value, 10);
    if (!num && num !== 0) return String(value === undefined || value === null ? '' : value);
    return num < 10 ? '0' + num : String(num);
  };

  NovaUI.pages = function(total) {
    var size = NovaUI.pageSize(total);
    var out = [];
    for (var start = 0; start < total; start += size) {
      out.push({
        start: start,
        end: Math.min(start + size, total) - 1
      });
    }
    if (out.length > 1) {
      var tail = out[out.length - 1];
      if (tail.end - tail.start + 1 <= size / 2) {
        out[out.length - 2].end = tail.end;
        out.pop();
      }
    }
    return out;
  };

  NovaUI.pageAt = function(pages, index) {
    for (var i = 0; i < pages.length; i++) {
      if (index >= pages[i].start && index <= pages[i].end) return pages[i];
    }
    return pages[0] || {
      start: 0,
      end: -1
    };
  };
  NovaUI.REQUEST_TIMEOUT = 20000;
  NovaUI.WATCHDOG = 24;
  NovaUI.WATCHDOG_FIRST = 40;

  NovaUI.esc = function(str) {
    return (str === undefined || str === null ? '' : String(str))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  NovaUI.shortQuality = function(text) {
    if (!text) return '';
    text = String(text);
    var match = text.match(/(2160|1440|1080|720|576|480|360)\s*p?/i);
    if (match) {
      var value = parseInt(match[1]);
      if (value >= 2160) return '4K';
      if (value >= 1080) return 'FHD';
      if (value >= 720) return 'HD';
      return 'SD';
    }
    if (/4k|uhd/i.test(text)) return '4K';
    if (/fhd/i.test(text)) return 'FHD';
    if (/\bhd\b/i.test(text)) return 'HD';
    return '';
  };

  NovaUI.VOICE_KINDS = [{
    key: 'dub',
    title: 'nova_voice_dub',
    re: /дубляж|дублирован|\bdub\b|\bdubbing\b/i
  }, {
    key: 'mvo',
    title: 'nova_voice_mvo',
    re: /многоголос|\bmvo\b|\bpmvo\b/i
  }, {
    key: 'dvo',
    title: 'nova_voice_dvo',
    re: /двухголос|\bdvo\b/i
  }, {
    key: 'avo',
    title: 'nova_voice_avo',
    re: /авторск|одноголос|\bavo\b|\bvo\b/i
  }, {
    key: 'orig',
    title: 'nova_voice_orig',
    re: /оригинал|original|\beng\b|\bua\b|\bukr\b/i
  }, {
    key: 'sub',
    title: 'nova_voice_sub',
    re: /субтитр|sub(title)?s?\b/i
  }];

  NovaUI.VOICE_STUDIOS = [{
    key: 'mvo',
    re: /lostfilm|лостфильм|tvshows|dniprofilm|невафильм|newstudio|newcomers|baibako|байбако|alexfilm|jaskier|coldfilm|колдфильм|hdrezka|rezkastudio|red head sound|sunshine|amedia|zakadry|закадры|linefilm|le-production|1win|kerob|profix|selena|октопус/i
  }, {
    key: 'dvo',
    re: /кубик в кубе|kubik|viruseproject|вирус|green ?tea|paradox/i
  }, {
    key: 'avo',
    re: /яроцк|гаврилов|володарск|сербин|горчаков|михал[её]в|живов|пучков|гоблин|кураж|дольск|есарев|карповск|визгунов/i
  }];

  NovaUI.voiceKind = function(title) {
    var text = String(title || '');
    var i;
    for (i = 0; i < NovaUI.VOICE_KINDS.length; i++) {
      if (NovaUI.VOICE_KINDS[i].re.test(text)) return NovaUI.VOICE_KINDS[i].key;
    }
    for (i = 0; i < NovaUI.VOICE_STUDIOS.length; i++) {
      if (NovaUI.VOICE_STUDIOS[i].re.test(text)) return NovaUI.VOICE_STUDIOS[i].key;
    }
    return 'other';
  };

  NovaUI.voiceKindTitle = function(key) {
    for (var i = 0; i < NovaUI.VOICE_KINDS.length; i++) {
      if (NovaUI.VOICE_KINDS[i].key == key) return Lampa.Lang.translate(NovaUI.VOICE_KINDS[i].title);
    }
    return Lampa.Lang.translate('nova_voice_other');
  };

  NovaUI.voiceGroups = function(list) {
    var order = [];
    var map = {};
    (list || []).forEach(function(entry, index) {
      var key = NovaUI.voiceKind(entry.title);
      if (!map[key]) {
        map[key] = {
          key: key,
          title: NovaUI.voiceKindTitle(key),
          items: []
        };
        order.push(key);
      }
      map[key].items.push({
        index: index,
        title: entry.title,
        url: entry.url
      });
    });

    var rank = function(key) {
      for (var i = 0; i < NovaUI.VOICE_KINDS.length; i++) {
        if (NovaUI.VOICE_KINDS[i].key == key) return i;
      }
      return 90;
    };
    order.sort(function(a, b) {
      return rank(a) - rank(b);
    });
    return order.map(function(key) {
      return map[key];
    });
  };

  NovaUI.splitSourceName = function(name) {
    name = String(name || '');
    var badge = '';
    var match = name.match(/\s*[-~–]\s*(2160p?|1440p?|1080p?|720p?|480p?|4k|uhd|fhd|hd)\b[^,]*$/i);
    if (match) {
      badge = NovaUI.shortQuality(match[1]);
      if (badge) name = name.slice(0, match.index);
    }
    return {
      name: name.replace(/\s+$/, ''),
      badge: badge
    };
  };

  NovaUI.isSeasonLabel = function(text) {
    text = String(text || '').trim();
    return /^\d+\s*(-?[йя])?\s*(сезон|season)$/i.test(text) || /^(сезон|season)\s*\d+$/i.test(text);
  };

  NovaUI.MOVIE_ONLY = ['xvideocdnultra', 'xvideocdn60fps'];

  NovaUI.isMovieOnlySource = function(key, title) {
    if (NovaUI.MOVIE_ONLY.indexOf(String(key || '').toLowerCase()) !== -1) return true;
    return /^xvideocdn/i.test(key || '') && /ultra|60\s*\/?\s*120|60fps/i.test(title || '');
  };

  NovaUI.serverDenial = function(answer) {
    if (!answer || typeof answer !== 'object') return null;
    var denied = !!(answer.accsdb || answer.blocked || answer.error ||
      (typeof answer.code === 'number' && answer.code >= 300));
    if (!denied) return null;
    var text = String(answer.msg || answer.message || answer.text || '');

    return {
      msg: text || Lampa.Lang.translate('nova_no_access_text')
    };
  };

  NovaUI.networkFail = function(error) {
    if (!error || typeof error !== 'object') return false;
    if (error instanceof Error) return false;
    if (NovaUI.serverDenial(error)) return false;
    if (error.timeout) return true;
    if (typeof error.status === 'number') return error.status === 0 || error.status >= 500;
    return false;
  };

  NovaUI.providerName = function(url) {
    var path = String(url || '').split('?')[0].split('#')[0];
    var parts = path.split('/');
    var last = '';
    while (parts.length && !last) last = parts.pop();
    return last;
  };

  NovaUI.seasonNumber = function(title) {
    var match = String(title || '').match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  NovaUI.normName = function(text) {
    text = String(text === undefined || text === null ? '' : text).toLowerCase();
    text = text.replace(/\u0451/g, '\u0435').replace(/[^0-9a-z\u0430-\u044f]+/g, ' ');
    return text.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  NovaUI.nameParts = function(text) {
    var raw = String(text || '').split(/\s*[\/|]\s*/);
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var norm = NovaUI.normName(raw[i]);
      if (norm) out.push(norm);
    }
    return out;
  };

  NovaUI.yearOf = function(value) {
    var match = String(value === undefined || value === null ? '' : value).match(/\d{4}/);
    var year = match ? parseInt(match[0], 10) : 0;
    return year > 1900 && year < 2200 ? year : 0;
  };

  NovaUI.movieNames = function(movie) {
    var fields = ['title', 'name', 'original_title', 'original_name'];
    var out = [];
    for (var i = 0; i < fields.length; i++) {
      var parts = NovaUI.nameParts(movie && movie[fields[i]]);
      for (var j = 0; j < parts.length; j++) {
        if (out.indexOf(parts[j]) === -1) out.push(parts[j]);
      }
    }
    return out;
  };

  NovaUI.matchScore = function(elem, movie) {
    if (!elem || !movie) return 0;
    var mine = NovaUI.movieNames(movie);
    var theirs = NovaUI.nameParts(elem.title || elem.text || '');
    var score = 0;
    for (var i = 0; i < theirs.length; i++) {
      for (var j = 0; j < mine.length; j++) {
        var a = theirs[i];
        var b = mine[j];
        var hit = 0;
        if (a === b) hit = 60;
        else if (a.length > 3 && b.length > 3 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)) hit = 34;
        else if (a.length > 5 && b.length > 5 && (a.indexOf(b) !== -1 || b.indexOf(a) !== -1)) hit = 22;
        if (hit > score) score = hit;
      }
    }
    var my_year = NovaUI.yearOf(movie.release_date || movie.first_air_date || movie.year);
    var their_year = NovaUI.yearOf(elem.year || elem.start_date);
    if (my_year && their_year) {
      var diff = Math.abs(my_year - their_year);

      if (diff === 0) score += 34;
      else if (diff === 1) score += 16;
      else score -= 30;
    }
    return score;
  };

  NovaUI.rankSimilars = function(list, movie) {
    var ranked = [];
    for (var i = 0; i < (list || []).length; i++) {
      ranked.push({
        elem: list[i],
        index: i,
        score: NovaUI.matchScore(list[i], movie)
      });
    }
    ranked.sort(function(a, b) {
      return b.score - a.score || a.index - b.index;
    });
    var best = ranked[0];
    var second = ranked[1];
    var gap = best ? best.score - (second ? second.score : -100) : 0;
    return {
      list: ranked,
      best: best || null,

      likely: !!(best && best.score >= 45 && gap >= 10),

      sure: !!(best && best.score >= 70 && gap >= 25)
    };
  };

  NovaUI.SEEN_PERCENT = 90;
  NovaUI.LOGO_DARK = 0.4;
  NovaUI.LOGO_DARK_SHARE = 0.45;

  NovaUI.percentOf = function(element) {
    if (!element) return 0;
    var line = element.timeline;
    if (!line) return 0;
    var value = parseFloat(line.percent);
    return isNaN(value) || value < 0 ? 0 : value;
  };

  NovaUI.isMarked = function(element) {
    if (!element || !element.hash_behold) return false;
    try {
      return Lampa.Storage.cache('online_view', 5000, []).indexOf(element.hash_behold) !== -1;
    } catch (e) {
      return false;
    }
  };

  NovaUI.isSeen = function(element) {
    if (NovaUI.percentOf(element) >= NovaUI.SEEN_PERCENT) return true;
    return NovaUI.isMarked(element);
  };

  NovaUI.isStarted = function(element) {
    var value = NovaUI.percentOf(element);
    return value > 0 && value < NovaUI.SEEN_PERCENT;
  };

  NovaUI.isFresh = function(element) {
    return NovaUI.percentOf(element) === 0;
  };

  NovaUI.QUALITY_RANK = {
    '4K': 4,
    'FHD': 3,
    'HD': 2,
    'SD': 1
  };

  NovaUI.qualityRank = function(label) {
    return NovaUI.QUALITY_RANK[label] || 0;
  };

  NovaUI.bestQualityFromText = function(text, loose) {
    text = String(text === undefined || text === null ? '' : text);
    var best = '';
    var re = loose ? /(?:^|[^\d])(2160|1440|1080|720|576|480)\s*p?(?![\d])/gi :
                     /(?:^|[^\d])(2160|1440|1080|720|576|480)\s*p(?![\d])/gi;
    var found;
    while ((found = re.exec(text))) {
      var label = NovaUI.shortQuality(found[1] + 'p');
      if (NovaUI.qualityRank(label) > NovaUI.qualityRank(best)) best = label;
    }
    if (/4k|uhd/i.test(text) && NovaUI.qualityRank('4K') > NovaUI.qualityRank(best)) best = '4K';
    if (!best && /fhd/i.test(text)) best = 'FHD';
    return best;
  };

  NovaUI.bestQuality = function(items) {
    var best = '';
    for (var i = 0; i < (items || []).length; i++) {
      var item = items[i] || {};
      var label = '';
      var quality = item.quality || item.qualitys;
      if (quality && typeof quality === 'object') label = Lampa.Arrays.getKeys(quality).join(' ');
      else if (quality) label = String(quality);
      var short = NovaUI.bestQualityFromText(label, true) ||
                  NovaUI.bestQualityFromText(item.title || item.text || '', true);
      if (NovaUI.qualityRank(short) > NovaUI.qualityRank(best)) best = short;
    }
    return best;
  };

  NovaUI.QUALITY_TTL = 604800000;

  var quality_scope = '';

  NovaUI.qualityScope = function(id) {
    if (typeof id !== 'undefined') quality_scope = id ? String(id) : '';
    return quality_scope;
  };

  NovaUI.qualityBox = function() {
    var all = Lampa.Storage.cache('nova_source_quality', 500, {});
    var key;

    for (key in all) {
      if (typeof all[key] === 'string') {
        all = {};
        Lampa.Storage.set('nova_source_quality', all);
        break;
      }
    }

    var now = Date.now();
    for (key in all) {
      var entry = all[key];
      if (!entry || typeof entry !== 'object' || !entry.list ||
          now - (entry.t || 0) > NovaUI.QUALITY_TTL) delete all[key];
    }
    return all;
  };

  NovaUI.qualityMemory = function() {
    if (!quality_scope) return {};
    var mine = NovaUI.qualityBox()[quality_scope];
    return (mine && mine.list) || {};
  };

  NovaUI.knownQuality = function(name) {
    return NovaUI.qualityMemory()[name] || '';
  };

  NovaUI.rememberQuality = function(name, label) {
    if (!quality_scope || !name || !label) return;
    var all = NovaUI.qualityBox();
    var mine = all[quality_scope];
    if (!mine || typeof mine !== 'object' || !mine.list) mine = { t: 0, list: {} };
    if (NovaUI.qualityRank(label) <= NovaUI.qualityRank(mine.list[name])) return;
    mine.list[name] = label;
    mine.t = Date.now();
    all[quality_scope] = mine;
    Lampa.Storage.set('nova_source_quality', all);
  };

  NovaUI.sourceBadge = function(name, parts) {
    return NovaUI.knownQuality(name) || (parts ? parts.badge : '');
  };


  NovaUI.icon = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4" stroke-linecap="round"></path></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 11a8 8 0 10-2.3 5.7" stroke-linecap="round"></path><path d="M20 4v7h-7" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 4l9 16H3z" stroke-linejoin="round"></path><path d="M12 10v4" stroke-linecap="round"></path><circle cx="12" cy="17" r="0.6" fill="currentColor"></circle></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="12" cy="12" r="2.6"></circle></svg>'
  };

  NovaUI.css = [
    '<style>',
    '.nova{padding:0 0 3em 0}',
    '.nova *{-webkit-box-sizing:border-box;box-sizing:border-box}',

    '.nova-hero{position:relative;overflow:hidden;-webkit-border-radius:1.2em;border-radius:1.2em;margin-bottom:1.7em;background:rgba(255,255,255,.06);min-height:13em}',
    '.nova-hero--compact{min-height:0;margin-bottom:1.3em}',
    '.nova-hero--compact .nova-hero__body{padding:1.1em 1.4em;max-width:100%;min-height:5.2em;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}',
    '.nova-hero--compact .nova-hero__actions{margin:0}',
    '.nova-hero--compact .nova-btn--main{margin-bottom:0}',
    '.nova-hero--compact .nova-hero__season{margin:.6em 0 0 .2em;font-size:.95em;opacity:.55}',
    '.nova-hero--compact .nova-hero__progress{position:absolute;left:0;right:0;bottom:0;width:auto;height:.3em;margin:0;-webkit-border-radius:0;border-radius:0}',
    '.nova-hero--compact .nova-hero__shade{background:-webkit-linear-gradient(left,rgba(10,11,17,.88) 0%,rgba(10,11,17,.6) 45%,rgba(10,11,17,.15) 100%);background:linear-gradient(90deg,rgba(10,11,17,.88) 0%,rgba(10,11,17,.6) 45%,rgba(10,11,17,.15) 100%)}',
    '.nova-hero__bg{position:absolute;top:0;left:0;right:0;bottom:0}',
    '.nova-hero__bg img{display:block;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;opacity:0;-webkit-transition:opacity .35s;transition:opacity .35s}',
    '.nova-hero__bg--loaded img{opacity:1}',
    '.nova-hero__shade{position:absolute;top:0;left:0;right:0;bottom:0;background:-webkit-linear-gradient(left,rgba(10,11,17,.9) 0%,rgba(10,11,17,.62) 32%,rgba(10,11,17,.2) 62%,rgba(10,11,17,0) 84%);background:linear-gradient(90deg,rgba(10,11,17,.9) 0%,rgba(10,11,17,.62) 32%,rgba(10,11,17,.2) 62%,rgba(10,11,17,0) 84%)}',
    '.nova-hero__title,.nova-hero__meta,.nova-hero__descr,.nova-hero__hint,.nova-hero__season{text-shadow:0 .06em .5em rgba(0,0,0,.8)}',
    '.nova-hero__descr{opacity:.8}',
    '.nova-hero__body{position:relative;padding:2.2em;max-width:64%}',
    '.nova-hero__title{font-size:2.3em;font-weight:600;line-height:1.15;margin-bottom:.35em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
    '.nova-hero__title--logo{display:block;overflow:visible;-webkit-line-clamp:none;-webkit-box-orient:horizontal;padding:.08em 0 .06em;margin-bottom:.5em;line-height:1}',
    '.nova-hero__title--logo>img{display:block;max-height:2.1em;max-width:70%;width:auto;height:auto;-o-object-fit:contain;object-fit:contain;-webkit-filter:drop-shadow(0 .04em .12em rgba(0,0,0,.55));filter:drop-shadow(0 .04em .12em rgba(0,0,0,.55))}',
    '.nova-hero__title--logo>img.nova-logo--invert{-webkit-filter:invert(1) brightness(1.1) drop-shadow(0 .04em .12em rgba(0,0,0,.5));filter:invert(1) brightness(1.1) drop-shadow(0 .04em .12em rgba(0,0,0,.5))}',
    '.nova-hero__title--logo>img.nova-logo--glow{-webkit-filter:drop-shadow(0 0 .02em rgba(255,255,255,.9)) drop-shadow(0 0 .04em rgba(255,255,255,.75));filter:drop-shadow(0 0 .02em rgba(255,255,255,.9)) drop-shadow(0 0 .04em rgba(255,255,255,.75))}',
    '.nova-hero__mark{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-width:0;max-width:40%;margin:0 1.2em .4em 0;font-size:1.2em;font-weight:600;line-height:1.25;overflow:hidden;white-space:nowrap;-o-text-overflow:ellipsis;text-overflow:ellipsis}',
    '.nova-hero__mark:empty{display:none}',
    '.nova-hero__mark.nova-hero__title--logo{display:block;overflow:visible;padding:.08em 0 .06em;margin-bottom:.4em;line-height:1}',
    '.nova-hero__mark>img{max-height:1.75em !important;max-width:100% !important;width:auto;height:auto}',
    '@media screen and (max-width:900px){.nova-hero__mark{max-width:55%;font-size:1.05em}}',
    '@media screen and (max-width:580px){.nova-hero__mark{-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1;max-width:100%;margin-right:0}.nova-hero__mark>img{max-height:1.5em !important}}',
    '.nova-hero__meta{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:1.1em;margin-bottom:.7em}',
    '.nova-hero__meta>*{margin:0 .7em .3em 0;opacity:.8}',
    '.nova-hero__meta>.nova-badge{opacity:1}',
    '.nova-hero__descr{font-size:1.05em;line-height:1.45;opacity:.65;margin-bottom:1.2em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
    '.nova-hero__actions{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}',
    '.nova-hero__actions>.nova-btn{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;margin:0 .8em .4em 0}',
    '.nova-hero__hint{font-size:1em;line-height:1.5;opacity:.55;margin:0;padding:.1em .15em;overflow:hidden;white-space:nowrap;-o-text-overflow:ellipsis;text-overflow:ellipsis;min-width:0;-webkit-box-flex:1;-webkit-flex:1 1 14em;-ms-flex:1 1 14em;flex:1 1 14em}',
    '@media screen and (max-width:900px){',
    '.nova-hero__hint{-webkit-flex:1 0 100%;-ms-flex:1 0 100%;flex:1 0 100%;margin:.3em 0 0 .15em;white-space:normal}',
    '}',
    '.nova-hero__progress{position:absolute;left:0;right:0;bottom:0;height:.3em;width:auto;-webkit-border-radius:0;border-radius:0;background:rgba(255,255,255,.2);margin:0;overflow:hidden}',
    '.nova-hero__progress .time-line{display:block !important;height:100%;margin:0;background:none}',
    '.nova-hero__progress .time-line>div{height:100%;background:#fff}',

    '.nova-badge{display:inline-block;padding:.2em .55em;-webkit-border-radius:.35em;border-radius:.35em;background:rgba(255,255,255,.18);font-size:.78em;font-weight:600;letter-spacing:.04em;line-height:1.4}',
    '.nova-btn{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:.7em 1.5em;-webkit-border-radius:2.4em;border-radius:2.4em;background:rgba(255,255,255,.12);font-size:1.15em;white-space:nowrap;margin:0 .8em .5em 0}',
    '.nova-btn>svg{width:1.15em;height:1.15em;margin-right:.6em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}',
    '.nova-btn.focus{background:#fff;color:#000}',
    '.nova-btn--main{background:rgba(255,255,255,.82);color:#000}',
    '.nova-btn--main.focus{background:#fff;-webkit-box-shadow:0 .25em .9em rgba(0,0,0,.45);box-shadow:0 .25em .9em rgba(0,0,0,.45)}',
    '.nova-btn--ghost{background:rgba(255,255,255,.14);font-size:1.05em}',

    '.nova-section{margin-bottom:1.1em}',
    '.nova-section__title{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:.95em;letter-spacing:.12em;text-transform:uppercase;opacity:.5;margin-bottom:.7em}',
    '.nova-section__title:before{content:"";display:inline-block;width:.25em;height:1.1em;background:currentColor;margin-right:.6em;-webkit-border-radius:.2em;border-radius:.2em}',
    '.nova-section__body{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}',
    '.nova-chip{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:.55em 1.1em;-webkit-border-radius:2em;border-radius:2em;background:rgba(255,255,255,.07);margin:0 .7em .7em 0;font-size:1.05em;white-space:nowrap;max-width:24em}',
    '.nova-chip.focus{background:#fff;color:#000}',
    '.nova-chip--active{background:rgba(255,255,255,.16);-webkit-box-shadow:inset 0 0 0 .1em rgba(255,255,255,.5);box-shadow:inset 0 0 0 .1em rgba(255,255,255,.5)}',
    '.nova-chip--active.focus{-webkit-box-shadow:0 .2em .7em rgba(0,0,0,.4);box-shadow:0 .2em .7em rgba(0,0,0,.4)}',
    '.nova-chip__idx{font-size:.85em;opacity:.45;margin-right:.55em}',
    '.nova-chip__badge{font-size:.7em;font-weight:600;padding:.2em .45em;-webkit-border-radius:.35em;border-radius:.35em;background:rgba(255,255,255,.2);margin-right:.6em;line-height:1.4}',
    '.nova-chip.focus .nova-chip__badge{background:rgba(0,0,0,.12)}',
    '.nova-chip--more{opacity:.75}',
    '.nova-chip__label{line-height:1.5;padding:.05em .1em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis}',
    '.nova-chip>svg{width:1em;height:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}',
    '.nova-chip__label+svg{margin-left:.6em;opacity:.6}',
    '.nova-chip>svg:first-child{margin-right:.55em;opacity:.7}',
    '.nova-chip--source{font-size:1.15em;padding:.5em 1.1em}',
    '.nova-chip--ghost{opacity:.5}',
    '.nova-chip--busy .nova-chip__label{opacity:.5}',
    '.nova-chip__dot{width:.5em;height:.5em;-webkit-border-radius:50%;border-radius:50%;margin-left:.6em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;background:#4ade80}',
    '.nova-chip--checking{opacity:.55}',
    '.nova-chip--empty{opacity:.35}',

    '.nova-toolbar{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin-bottom:1em}',
    '.nova-toolbar__label{font-size:.95em;letter-spacing:.12em;text-transform:uppercase;opacity:.45;margin:0 .9em .7em 0}',
    '.nova-toolbar .nova-btn--main{margin:0 1.4em .7em 0;font-size:1.1em;padding:.55em 1.3em}',
    '.nova-toolbar .nova-btn__label{max-width:18em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;white-space:nowrap}',

    '.nova-card{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:.7em;-webkit-border-radius:.9em;border-radius:.9em;background:rgba(255,255,255,.05);margin-bottom:.7em}',
    '.nova-card.focus{background:#fff;color:#000}',
    '.nova-card__thumb{position:relative;width:10.5em;height:5.9em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-border-radius:.5em;border-radius:.5em;overflow:hidden;background:rgba(0,0,0,.35)}',
    '.nova-card__thumb img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;opacity:0;-webkit-transition:opacity .3s;transition:opacity .3s}',
    '.nova-card__thumb--loaded img{opacity:1}',
    '.nova-card__num{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;font-size:1.7em;font-weight:600;color:#fff;text-shadow:0 .05em .2em rgba(0,0,0,.7)}',
    '.nova-card__thumb--loaded .nova-card__num{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;-webkit-box-align:end;-webkit-align-items:flex-end;-ms-flex-align:end;align-items:flex-end;font-size:1.1em;padding:0 .5em .35em 0}',
    '.nova-card__thumb--fallback.nova-card__thumb--loaded img{opacity:.4}',
    '.nova-card__thumb--fallback.nova-card__thumb--loaded .nova-card__num{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:1.7em;padding:0}',
    '.nova-card__viewed{position:absolute;top:.5em;left:.5em;width:.5em;height:.5em;-webkit-border-radius:50%;border-radius:50%;background:#fff;opacity:.85;-webkit-box-shadow:0 0 0 .16em rgba(0,0,0,.4);box-shadow:0 0 0 .16em rgba(0,0,0,.4)}',
    '.nova-card__line{position:absolute;left:0;right:0;bottom:0;height:.28em;background:rgba(0,0,0,.5)}',
    '.nova-card__line .time-line{display:block !important;height:100%;margin:0;background:none}',
    '.nova-card__line .time-line>div{height:100%;background:#fff}',
    '.nova-card__body{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;padding:0 1.2em;min-width:1em;overflow:hidden}',
    '.nova-card__title{font-size:1.25em;line-height:1.4;margin-bottom:.3em;padding-bottom:.05em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}',
    '.nova-card__meta{font-size:.95em;line-height:1.45;opacity:.6;padding-bottom:.05em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}',
    '.nova-card__meta .nova-dot{margin:0 .5em;opacity:.6}',
    '.nova-card__match{display:inline-block;margin-top:.4em;padding:.15em .6em;-webkit-border-radius:.35em;border-radius:.35em;background:rgba(126,217,150,.2);color:#8fe0a4;font-size:.82em;font-weight:600}',
    '.nova-card--match .nova-card__thumb{-webkit-box-shadow:inset 0 0 0 .13em rgba(126,217,150,.75);box-shadow:inset 0 0 0 .13em rgba(126,217,150,.75)}',
    '.nova-card__side{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;text-align:center;padding-right:.7em}',
    '.nova-card__time{font-size:.95em;opacity:.6;margin-top:.4em}',
    '.nova-card--soon{opacity:.45}',
    '.nova-card--nav .nova-card__body{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}',
    '.nova-card--nav .nova-card__body{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}',
    '.nova-card--nav .nova-card__title{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;margin-bottom:0}',
    '.nova-card--nav .nova-card__meta{width:100%;margin-top:.2em;font-size:.85em}',
    '.nova-card__go{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;opacity:.45;padding-left:1em}',
    '.nova-card__go>svg{width:1.2em;height:1.2em;-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}',
    '.nova-card--slim{padding:.75em 1.1em}',
    '.nova-card--slim .nova-card__thumb{display:none}',
    '.nova-card--slim .nova-card__body{padding-left:0}',
    '.nova-card--slim .nova-card__title{font-size:1.2em;margin-bottom:0}',
    '.nova-card__line--body{position:static;height:.25em;margin-top:.55em;-webkit-border-radius:.2em;border-radius:.2em;background:rgba(255,255,255,.18)}',
    '.nova-card.focus .nova-card__line--body{background:rgba(0,0,0,.16)}',
    '.nova-card.focus .nova-card__line--body .time-line>div{background:#000}',
    '.nova-card--slim .nova-card__line{position:static;height:.25em;margin-top:.5em;-webkit-border-radius:.2em;border-radius:.2em;background:rgba(255,255,255,.16)}',
    '.nova-card--slim.focus .nova-card__line{background:rgba(0,0,0,.15)}',
    '.nova-card--slim.focus .nova-card__line .time-line>div{background:#000}',
    '.nova-card__viewed{top:auto;bottom:.55em;left:.55em;width:1.15em;height:1.15em;-webkit-border-radius:0;border-radius:0;background:none;opacity:.8;-webkit-box-shadow:none;box-shadow:none}',
    '.nova-card__viewed>svg{display:block;width:100%;height:100%;-webkit-filter:drop-shadow(0 0 .2em rgba(0,0,0,.9));filter:drop-shadow(0 0 .2em rgba(0,0,0,.9))}',
    '.nova-card__eye{display:block;margin-top:.4em;opacity:.5}',
    '.nova-card__eye>svg{display:block;width:1.2em;height:1.2em;margin:0 auto}',
    '.nova-card.focus .nova-card__eye{opacity:.65}',
    '.nova-list-group{font-size:.9em;letter-spacing:.12em;text-transform:uppercase;opacity:.45;margin:1.2em 0 .55em .2em}',
    '.nova-list-group:first-child{margin-top:0}',
    '.nova-card--file .nova-card__thumb{width:4.4em;height:4.4em}',

    '.nova-skeleton__row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:.7em;-webkit-border-radius:.9em;border-radius:.9em;background:rgba(255,255,255,.04);margin-bottom:.7em;-webkit-animation:novapulse 1.4s infinite;animation:novapulse 1.4s infinite}',
    '.nova-skeleton__thumb{width:10.5em;height:5.9em;-webkit-border-radius:.5em;border-radius:.5em;background:rgba(255,255,255,.08);-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}',
    '.nova-skeleton__body{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;padding-left:1.2em}',
    '.nova-skeleton__line{height:1em;-webkit-border-radius:.3em;border-radius:.3em;background:rgba(255,255,255,.08);margin-bottom:.7em}',
    '.nova-skeleton__line--short{width:35%;margin-bottom:0}',
    '@-webkit-keyframes novapulse{0%{opacity:.45}50%{opacity:1}100%{opacity:.45}}',
    '@keyframes novapulse{0%{opacity:.45}50%{opacity:1}100%{opacity:.45}}',

    '.nova-loading{padding:1.6em 1.8em;-webkit-border-radius:1em;border-radius:1em;background:rgba(255,255,255,.05);margin-bottom:1.2em}',
    '.nova-loading__title{font-size:1.4em;margin-bottom:.35em}',
    '.nova-loading__text{font-size:1.05em;opacity:.6;margin-bottom:1em}',
    '.nova-loading__bar{position:relative;height:.3em;-webkit-border-radius:.3em;border-radius:.3em;background:rgba(255,255,255,.14);overflow:hidden}',
    '.nova-loading__bar>div{height:100%;width:0;background:#fff;-webkit-transition:width .4s;transition:width .4s}',

    '.nova-note{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:2em;-webkit-border-radius:1em;border-radius:1em;background:rgba(255,255,255,.05)}',
    '.nova-note__main{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;min-width:1em}',
    '.nova-note__text a{color:#fff;text-decoration:underline}',
    '.nova-note__text img{max-width:9em;height:auto;background:#fff;padding:.4em;-webkit-border-radius:.4em;border-radius:.4em;margin-top:.7em;opacity:1}',
    '.nova-note__text ul,.nova-note__text ol{margin:.5em 0;padding-left:1.2em}',
    '.nova-note__title{font-size:1.6em;margin-bottom:.4em;line-height:1.25}',
    '.nova-note__text{font-size:1.1em;color:rgba(255,255,255,.62);margin-bottom:1.3em;line-height:1.4}',
    '.nova-note__actions{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}',
    '.nova-note__timer{font-weight:600}',

    '.nova-group{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:.5em 1.1em;-webkit-border-radius:2em;border-radius:2em;background:rgba(255,255,255,.07);margin:0 .7em .7em 0;font-size:1.1em;white-space:nowrap}',
    '.nova-group.focus{background:#fff;color:#000}',
    '.nova-group--open{background:rgba(255,255,255,.2);-webkit-box-shadow:inset 0 0 0 .1em rgba(255,255,255,.5);box-shadow:inset 0 0 0 .1em rgba(255,255,255,.5)}',
    '.nova-group--open.focus{-webkit-box-shadow:0 .2em .7em rgba(0,0,0,.4);box-shadow:0 .2em .7em rgba(0,0,0,.4)}',
    '.nova-group__count{font-size:.78em;opacity:.55;margin-left:.6em}',
    '.nova-group__mark{width:.5em;height:.5em;-webkit-border-radius:50%;border-radius:50%;background:#fff;margin-right:.6em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}',
    '.nova-drop{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:.3em 0 0 1em;margin:0 0 .7em .3em;-webkit-box-shadow:inset .16em 0 0 rgba(255,255,255,.18);box-shadow:inset .16em 0 0 rgba(255,255,255,.18)}',

    '.nova__list--grid{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;margin:0 -.45em}',
    '.nova__list--grid .nova-card{display:block;width:25%;margin:0 0 1em 0;padding:0 .45em;background:none}',
    '.nova__list--grid .nova-card.focus{background:none;color:inherit}',
    '.nova__list--grid .nova-card__thumb{width:100%;height:0;padding-top:56%}',
    '.nova__list--grid .nova-card--file .nova-card__thumb{width:100%;height:0;padding-top:56%}',
    '.nova__list--grid .nova-card.focus .nova-card__thumb{-webkit-box-shadow:0 0 0 .2em #fff;box-shadow:0 0 0 .2em #fff}',
    '.nova__list--grid .nova-card__body{padding:.5em .1em 0 .1em}',
    '.nova__list--grid .nova-card__title{font-size:.92em;line-height:1.3;margin-bottom:.15em;-webkit-line-clamp:2}',
    '.nova__list--grid .nova-card__meta{font-size:.78em;line-height:1.35;-webkit-line-clamp:2}',
    '.nova__list--grid .nova-card__meta .nova-dot{margin:0 .3em}',
    '.nova__list--grid .nova-card__match{margin-top:.25em;font-size:.72em;padding:.1em .45em}',
    '.nova__list--grid .nova-card__side{position:absolute;top:.5em;right:.9em;text-align:right}',
    '.nova__list--grid .nova-card__time{display:none}',
    '.nova__list--grid .nova-card__num{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;padding:.4em 0 0 .55em;font-size:1.05em}',

    '.nova-hero__season{font-size:.95em;opacity:.55;margin-top:.8em}',

    '@media screen and (max-width:1200px){',
    '.nova__list--grid .nova-card{width:33.3333%}',
    '}',
    '@media screen and (max-width:600px) and (orientation:portrait){',
    '.nova-toolbar{-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;overflow:hidden;min-width:0;font-size:.92em}',
    '.nova-toolbar>*{margin-bottom:0}',
    '.nova-toolbar__label{display:none}',
    '.nova-toolbar .nova-chip{-webkit-flex-shrink:1;-ms-flex-negative:1;flex-shrink:1;min-width:4.2em;max-width:none;margin:0 .5em 0 0;padding:.5em .9em}',
    '.nova-toolbar .nova-chip__label{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;min-width:0}',
    '.nova-toolbar .nova-chip__badge{margin-right:.4em}',
    '.nova-toolbar .nova-btn--main{margin:0 .8em 0 0;font-size:1.05em;padding:.5em 1.1em}',
    '.nova-hero__actions{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;min-width:0}',
    '.nova-hero__actions>.nova-btn{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;margin:0 .6em .3em 0}',
    '.nova-drop{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}',
    '}',
    '@media screen and (max-width:580px){',
    '.nova__list--grid .nova-card{width:50%}',
    '.nova-hero__body{max-width:100%;padding:1.3em}',
    '.nova-hero__title{font-size:1.7em}',
    '.nova-hero__title--logo>img{max-height:1.9em;max-width:80%}',
    '.nova-hero__descr{display:none}',
    '.nova-card__side{display:block;text-align:center;padding-right:.2em;max-width:6em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}',
    '.nova-card__quality{font-size:.66em;padding:.15em .4em}',
    '.nova-card__time{font-size:.78em;margin-top:.3em;display:block}',
    '.nova-hero__shade{background:-webkit-linear-gradient(top,rgba(10,11,17,0) 0%,rgba(10,11,17,.35) 42%,rgba(10,11,17,.86) 100%);background:linear-gradient(180deg,rgba(10,11,17,0) 0%,rgba(10,11,17,.35) 42%,rgba(10,11,17,.86) 100%)}',
    '.nova-card__thumb{width:7em;height:4.4em}',
    '.nova-chip{max-width:16em}',
    '}',
    'body.nova-focus-ring .nova-btn.focus,body.nova-focus-ring .nova-chip.focus,body.nova-focus-ring .nova-card.focus,body.nova-focus-ring .nova-group.focus{background:rgba(255,255,255,.16)!important;color:#fff!important;-webkit-box-shadow:inset 0 0 0 .12em #fff!important;box-shadow:inset 0 0 0 .12em #fff!important}',
    'body.nova-focus-ring .nova-btn--main{background:rgba(255,255,255,.16);color:#fff;-webkit-box-shadow:inset 0 0 0 .1em rgba(255,255,255,.5);box-shadow:inset 0 0 0 .1em rgba(255,255,255,.5)}',
    'body.nova-focus-ring .nova-chip.focus .nova-chip__badge{background:rgba(255,255,255,.2)!important;color:#fff!important}',
    'body.nova-focus-ring .nova-card.focus .nova-card__line--body{background:rgba(255,255,255,.2)!important}',
    'body.nova-focus-ring .nova-card.focus .nova-card__line--body .time-line>div{background:#fff!important}',
    'body.nova-focus-ring .nova-card--slim.focus .nova-card__line{background:rgba(255,255,255,.2)!important}',
    'body.nova-focus-ring .nova-card--slim.focus .nova-card__line .time-line>div{background:#fff!important}',
    'body.nova-focus-ring .nova__list--grid .nova-card.focus{background:none!important;color:inherit!important;-webkit-box-shadow:none!important;box-shadow:none!important}',
    'body.nova-focus-ring .nova__list--grid .nova-card.focus .nova-card__thumb{-webkit-box-shadow:0 0 0 .12em #fff!important;box-shadow:0 0 0 .12em #fff!important}',
    'body.nova-focus-ring .nova-chip--active.focus,body.nova-focus-ring .nova-group--open.focus{-webkit-box-shadow:inset 0 0 0 .12em #fff!important;box-shadow:inset 0 0 0 .12em #fff!important}',

    'body.nova-full .nova-scope .explorer__left{display:none!important}',
    'body.nova-full .nova-scope .explorer__files{width:100%!important;left:0!important}',

    'body.nova-fade .nova-scope .nova-hero{background:transparent;-webkit-border-radius:0;border-radius:0}',
    'body.nova-fade .nova-scope .nova-hero__progress{left:2.2em;right:2.2em;bottom:1.5em;width:auto;-webkit-border-radius:.3em;border-radius:.3em}',
    'body.nova-fade .nova-scope .nova-hero--compact .nova-hero__progress{left:1.4em;right:1.4em;bottom:.9em}',
    '@media screen and (max-width:580px){body.nova-fade .nova-scope .nova-hero__progress{left:1.3em;right:1.3em;bottom:1em}}',
    'body.nova-fade .nova-scope .nova-hero__season{margin-bottom:.6em}',
    'body.nova-fade .nova-scope .nova-hero--compact .nova-hero__season{margin-bottom:1em}',
    '@media screen and (max-width:580px){body.nova-fade .nova-scope .nova-hero__season{margin-bottom:.9em}}',
    'body.nova-fade .nova-scope .nova-hero__bg,body.nova-fade .nova-scope .nova-hero__shade{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 10%,#000 90%,transparent 100%),linear-gradient(180deg,transparent 0,#000 14%,#000 86%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 10%,#000 90%,transparent 100%),linear-gradient(180deg,transparent 0,#000 14%,#000 86%,transparent 100%);-webkit-mask-composite:source-in;mask-composite:intersect;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%}',
    '</style>'
  ].join('');

  function novaFocusRing() {
    try {
      return Lampa.Storage.get('nova_focus_style', 'ring') !== 'fill';
    } catch (e) {
      return true;
    }
  }

  function novaApplyFocusStyle() {
    try {
      var body = $('body');
      if (novaFocusRing()) body.addClass('nova-focus-ring');
      else body.removeClass('nova-focus-ring');
    } catch (e) {}
  }

  function novaFullScreen() {
    try {
      return Lampa.Storage.get('nova_fullscreen', true) === true;
    } catch (e) {
      return true;
    }
  }

  function novaApplyFullScreen() {
    try {
      var body = $('body');
      if (novaFullScreen()) body.addClass('nova-full');
      else body.removeClass('nova-full');
    } catch (e) {}
  }

  function novaEdgeFade() {
    try {
      return Lampa.Storage.get('nova_fade', true) === true;
    } catch (e) {
      return true;
    }
  }

  function novaApplyEdgeFade() {
    try {
      var body = $('body');
      if (novaEdgeFade()) body.addClass('nova-fade');
      else body.removeClass('nova-fade');
    } catch (e) {}
  }

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
    var fileurl_cache = {};
    var fileurl_prefetching = {};
    var prefetch_timer = null;
    var prefetch_network = null;
    var FILEURL_TTL = 90 * 1000;
    var episodes_cache = {};
    var life_wait_times = 0;
    var life_wait_timer;
    var life_done = false;
    var life_started = 0;
    var filter_sources = [];
    var filter_translate = {
      season: Lampa.Lang.translate('torrent_serial_season'),
      voice: Lampa.Lang.translate('torrent_parser_voice'),
      source: Lampa.Lang.translate('settings_rest_source')
    };
    var filter_find = {
      season: [],
      voice: []
    };

    if (balansers_with_search == undefined) {
      network.timeout(10000);
      network.silent(account(_srv(3) + '/lite/withsearch'), function(json) {
        balansers_with_search = json;
      }, function() {
		  balansers_with_search = [];
	  });
    }

    function balanserName(j) {
      var bals = j.balanser;
      var name = j.name.split(' ')[0];
      return (bals || name).toLowerCase();
    }

    function qualityWeight(label) {
      if (label === undefined || label === null) return 0;
      var s = ('' + label).toLowerCase();
      var m = s.match(/(\d{3,4})\s*[pр]?/);
      if (m) {
        var n = parseInt(m[1], 10);
        if (!isNaN(n)) return n;
      }
      if (s.indexOf('4k') !== -1 || s.indexOf('uhd') !== -1) return 2160;
      if (s.indexOf('2k') !== -1 || s.indexOf('qhd') !== -1) return 1440;
      if (s.indexOf('fullhd') !== -1 || s.indexOf('full hd') !== -1 || s.indexOf('fhd') !== -1) return 1080;
      if (s.indexOf('hd') !== -1) return 720;
      if (s.indexOf('sd') !== -1) return 480;
      return 0;
    }

    function sortSourcesByQuality(keys, sources_map) {
      if (!keys || keys.length < 2) return keys;
      var indexed = [];
      var i;
      for (i = 0; i < keys.length; i++) {
        var src = sources_map[keys[i]];

        var real = NovaUI.qualityRank(NovaUI.knownQuality(keys[i]));
        indexed.push({
          key: keys[i],
          shown: src && src.show ? 1 : 0,
          w: real ? real * 10000 : (src ? qualityWeight(src.name) : 0),
          i: i
        });
      }
      indexed.sort(function(a, b) {
        if (b.shown !== a.shown) return b.shown - a.shown;
        if (b.w !== a.w) return b.w - a.w;
        return a.i - b.i;
      });
      var result = [];
      for (i = 0; i < indexed.length; i++) result.push(indexed[i].key);
      return result;
    }

	function clarificationSearchAdd(value){
		var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
		var all = Lampa.Storage.get('clarification_search','{}');

		all[id] = value;

		Lampa.Storage.set('clarification_search',all);
	}

	function clarificationSearchDelete(){
		var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
		var all = Lampa.Storage.get('clarification_search','{}');

		delete all[id];

		Lampa.Storage.set('clarification_search',all);
	}

	function clarificationSearchGet(){
		var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
		var all = Lampa.Storage.get('clarification_search','{}');

		return all[id];
	}

    var modern = NovaUI.enabled();
    NovaUI.qualityScope(object.movie ? object.movie.id : '');
    var ui = {};
    var ui_items = [];
    var ui_enter = null;
    var ui_focus = '';
    var ui_tried = {};
    var ui_open = '';
    var ui_nav = false;
    var season_pinned = false;
    var similar_list = null;
    var similar_auto = false;
    var similar_shown = false;
    var last_origin = '';
    var request_gen = 0;
    var ui_all_sources = false;
    var sources_stale = false;
    var sources_timer;
    var pending_source = '';
    var ui_page = -1;
    var ui_page_focus = -1;
    var ui_grid = false;
    var ui_season_planned = 0;
    var ui_keep = '';
    var ui_draw_params;
    var ui_watchdog;
    var ui_load_timer;
    var ui_load_started = 0;
    var ui_load_found = 0;
    var ui_load_percent = 0;

    this.uiFrame = function() {
      if (!ui.root) {
        ui.root = $('<div class="nova"></div>');
        ui.hero_box = $('<div class="nova__hero"></div>');
        ui.rows = $('<div class="nova__rows"></div>');
        ui.list = $('<div class="nova__list"></div>');
        ui.root.append(ui.hero_box).append(ui.rows).append(ui.list);
      }
      if (!ui.root.parent().length) {
        scroll.clear();
        scroll.append(ui.root);
      }
      return ui.root;
    };

    this.uiSkeleton = function(count) {
      var box = $('<div class="nova-skeleton"></div>');
      for (var i = 0; i < (count || 4); i++) {
        box.append('<div class="nova-skeleton__row"><div class="nova-skeleton__thumb"></div><div class="nova-skeleton__body"><div class="nova-skeleton__line"></div><div class="nova-skeleton__line nova-skeleton__line--short"></div></div></div>');
      }
      return box;
    };

    this.uiLoadingPanel = function() {
      var _this = this;
      this.uiFrame();
      ui_load_started = Date.now();
      ui_load_found = 0;
      ui_load_percent = 0;
      ui.load = $('<div class="nova-loading">' +
        '<div class="nova-loading__title"></div>' +
        '<div class="nova-loading__text"></div>' +
        '<div class="nova-loading__bar"><div></div></div>' +
        '</div>');
      ui.load.find('.nova-loading__title').text(Lampa.Lang.translate('nova_loading_title'));
      this.uiWatch(NovaUI.WATCHDOG_FIRST);
      ui.list.empty().append(ui.load).append(this.uiSkeleton(3));
      this.uiLoadingText();
      clearInterval(ui_load_timer);
      ui_load_timer = setInterval(function() {
        _this.uiLoadingText();
      }, 1000);
    };

    this.uiLoadingText = function() {
      if (!ui.load || !ui.load.parent().length) return this.uiLoadingStop();
      var seconds = Math.max(0, Math.round((Date.now() - ui_load_started) / 1000));
      var text = ui_load_found ?
        Lampa.Lang.translate('nova_loading_found').replace('{n}', ui_load_found) :
        Lampa.Lang.translate('nova_loading_start');
      text += ' · ' + seconds + Lampa.Lang.translate('nova_sec');
      if (seconds >= 12 && ui_load_percent < 100) text += ' · ' + Lampa.Lang.translate('nova_loading_slow');
      ui.load.find('.nova-loading__text').text(text);

      var percent = Math.max(ui_load_percent, Math.min(90, seconds * 7));
      ui.load.find('.nova-loading__bar>div').css('width', percent + '%');
    };

    this.uiLoadingProgress = function(json, times) {
      if (!ui.load || !ui.load.parent().length) return;
      var list = (json && json.online) || [];
      var found = 0;
      list.forEach(function(item) {
        if (item.show) found++;
      });
      ui_load_found = found;
      ui_load_percent = json && json.ready ? 100 : Math.min(95, Math.round((times / 15) * 100));
      this.uiWatch(NovaUI.WATCHDOG_FIRST);
      this.uiLoadingText();
    };

    this.uiLoadingStop = function() {
      clearInterval(ui_load_timer);
      ui_load_timer = null;
      ui.load = null;
    };

    this.uiWatch = function(seconds) {
      var _this = this;
      clearTimeout(ui_watchdog);
      if (!modern) return;
      ui_watchdog = setTimeout(function() {
        if (Lampa.Activity.active().activity !== _this.activity) return;
        network.clear();
        _this.doesNotAnswer({
          timeout: true
        });
      }, (seconds || NovaUI.WATCHDOG) * 1000);
    };

    this.uiWatchStop = function() {
      clearTimeout(ui_watchdog);
      ui_watchdog = null;
    };

    this.uiLoading = function() {
      this.uiFrame();
      this.uiLoadingStop();
      this.uiWatch();
      request_gen++;
      network.clear();
      clearInterval(balanser_timer);
      this.clearImages();
      ui.list.empty().append(this.uiSkeleton(4));
      this.activity.loader(false);
      this.activity.toggle();
      if (!sourceKeys().length) {
        var _this = this;
        clearTimeout(sources_timer);
        sources_timer = setTimeout(function() {
          _this.sourcesCacheShow();
        }, NovaUI.SOURCES_DELAY);
      }
    };

    this.sourcesCacheSave = function(list) {
      if (!object.movie.id || !list || !list.length) return;
      var all = Lampa.Storage.cache('nova_sources', 500, {});
      all[object.movie.id] = {
        time: Date.now(),
        list: list
      };
      Lampa.Storage.set('nova_sources', all);
    };

    this.sourcesCacheShow = function() {
      if (!modern || object.balanser || sourceKeys().length) return;
      var all = Lampa.Storage.cache('nova_sources', 500, {});
      var mine = all[object.movie.id];
      if (!mine || !mine.list || Date.now() - (mine.time || 0) > NovaUI.SOURCES_TTL) return;
      var keys = [];
      mine.list.forEach(function(item) {
        if (!item || !item.name) return;
        sources[item.key] = {
          url: item.url,
          name: item.name,
          show: item.show
        };
        keys.push(item.key);
      });
      if (!keys.length) return;
      filter_sources = keys;
      sources_stale = true;
      balanser = startBalanser() || keys[0];
      this.uiRows();
    };

    this.sourcesLive = function() {
      sources_stale = false;
      clearTimeout(sources_timer);
      if (!pending_source) return;
      var name = pending_source;
      pending_source = '';
      if (sources[name] && name !== balanser) this.switchSource(name);
    };

    this.uiFocusTarget = function() {
      return last;
    };

    this.uiFocusRestore = function(fallback) {
      var element = false;
      if (ui_focus && ui.root) {
        var found = ui.root.find('[data-nova-focus="' + ui_focus + '"]');
        if (found.length) element = found[0];
      }
      ui_focus = '';
      if (!element && fallback) element = fallback;
      if (element) last = element;
    };

    this.uiPickResume = function(items) {
      if (!items || !items.length) return null;
      var serial = object.movie.name ? true : false;
      var viewed = Lampa.Storage.cache('online_view', 5000, []);
      var i;
      if (!serial) {

        var movie_choice = this.getChoice();
        if (movie_choice.movie_view) {
          for (i = 0; i < items.length; i++) {
            if (items[i].hash_behold == movie_choice.movie_view) return items[i];
          }
        }
        var pref = Lampa.Storage.get('nova_voice_pref', '');
        if (pref && Lampa.Storage.get('nova_voice_auto', true) !== false) {
          for (i = 0; i < items.length; i++) {
            if (NovaUI.voiceKind(items[i].title || items[i].text) == pref) return items[i];
          }
        }
        return items[0];
      }
      for (i = 0; i < items.length; i++) {
        if (NovaUI.isStarted(items[i])) return items[i];
      }
      for (i = 0; i < items.length; i++) {
        if (!NovaUI.isSeen(items[i])) return items[i];
      }
      return items[items.length - 1];
    };

    this.uiPlayButton = function() {
      var _this = this;
      if (!ui.play) {
        ui.play = $('<div class="nova-btn nova-btn--main selector" data-nova-focus="hero">' + NovaUI.icon.play + '<span class="nova-btn__label"></span></div>');
        ui.play.on('hover:enter', function() {
          _this.uiPlay(_this.uiPickResume(ui_items));
        }).on('hover:long', function() {
          _this.uiPlayMenu();
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
      }
      return ui.play;
    };

    this.uiPlay = function(target, from_start) {
      if (!target || !ui_enter) return;
      if (from_start && target.timeclear) target.timeclear();
      if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
      ui_enter(target, target.__html || $('<div></div>'));
    };

    this.uiNextItem = function(target) {
      if (!target) return null;
      for (var i = 0; i < ui_items.length; i++) {
        if (ui_items[i] === target) return ui_items[i + 1] || null;
      }
      return null;
    };

    this.uiFreshItem = function() {
      var viewed = Lampa.Storage.cache('online_view', 5000, []);
      for (var i = 0; i < ui_items.length; i++) {
        if (!NovaUI.isSeen(ui_items[i])) return ui_items[i];
      }
      return null;
    };

    this.uiNextButton = function() {
      var _this = this;
      if (!ui.next) {
        ui.next = $('<div class="nova-btn nova-btn--ghost selector" data-nova-focus="hero-next"><span class="nova-btn__label"></span></div>');
        ui.next.on('hover:enter', function() {
          _this.uiPlay(_this.uiNextItem(_this.uiPickResume(ui_items)));
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
      }
      return ui.next;
    };

    this.uiPlayMenu = function() {
      var _this = this;
      var target = this.uiPickResume(ui_items);
      if (!target) return;
      var enabled = Lampa.Controller.enabled().name;
      var line = target.timeline;
      var started = line && line.percent > 0 && line.percent < 90;
      var name = function(item, key) {
        var text = Lampa.Lang.translate(key);
        return item.episode ? text + ' · ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + item.episode : text;
      };
      var menu = [{
        title: name(target, started ? 'nova_continue' : 'nova_watch'),
        item: target
      }];
      if (started) menu.push({
        title: name(target, 'nova_from_start'),
        item: target,
        reset: true
      });
      var next = this.uiNextItem(target);
      if (next) menu.push({
        title: name(next, 'nova_next_episode'),
        item: next
      });
      var fresh = this.uiFreshItem();
      if (fresh && fresh !== target && fresh !== next) menu.push({
        title: name(fresh, 'nova_first_new'),
        item: fresh
      });
      if (ui_items.length > NovaUI.JUMP_FROM) menu.push({
        title: Lampa.Lang.translate('nova_jump_pick'),
        jump: true
      });
      Lampa.Select.show({
        title: Lampa.Lang.translate('title_action'),
        items: menu,
        onBack: function() {
          Lampa.Controller.toggle(enabled);
        },
        onSelect: function(a) {
          Lampa.Controller.toggle(enabled);
          if (a.jump) return _this.uiToggle('jump');
          _this.uiPlay(a.item, a.reset);
        }
      });
    };

    this.uiLogoOn = function() {
      return Lampa.Storage.get('nova_logo', true) !== false;
    };

    this.uiLogoBox = function() {
      var box;
      try { box = Lampa.Storage.cache('nova_logo_cache', 500, {}); } catch (e) { box = null; }
      if (!box || typeof box !== 'object') box = {};
      return box;
    };

    this.uiLogoLang = function() {
      var lang = Lampa.Storage.get('language', 'ru') || 'ru';
      var map = { ua: 'uk', ukr: 'uk', rus: 'ru', eng: 'en', cn: 'zh', cs: 'cs', by: 'be' };
      lang = String(lang).toLowerCase();
      return map[lang] || lang;
    };

    this.uiLogoPick = function(list) {
      if (!list || !list.length) return '';
      var lang = this.uiLogoLang();
      var i;
      for (i = 0; i < list.length; i++) {
        if (list[i] && list[i].iso_639_1 === lang && list[i].file_path) return list[i].file_path;
      }
      for (i = 0; i < list.length; i++) {
        if (list[i] && list[i].iso_639_1 === 'en' && list[i].file_path) return list[i].file_path;
      }
      for (i = 0; i < list.length; i++) {
        if (list[i] && list[i].file_path) return list[i].file_path;
      }
      return '';
    };

    this.uiArtSize = function() {
      var want = String(Lampa.Storage.get('nova_art_size', 'auto') || 'auto');
      if (want === 'w780' || want === 'w1280' || want === 'original') return want;
      var pixels = 0;
      try {
        pixels = (window.innerWidth || 0) * (window.devicePixelRatio || 1);
      } catch (e) {
        pixels = 0;
      }

      return pixels >= 1100 ? 'w1280' : 'w780';
    };

    this.uiLogoSlot = function() {
      if (!ui.hero) return null;
      var slot = ui.hero.find('.nova-hero__title');
      if (slot.length) return slot;
      slot = ui.hero.find('.nova-hero__mark');
      return slot.length ? slot : null;
    };

    this.uiLogoUrl = function(path) {
      if (!path) return '';
      try {
        return Lampa.TMDB.image('t/p/w780' + String(path).replace('.svg', '.png'));
      } catch (e) {
        return '';
      }
    };

    this.uiLogoToneBox = function() {
      var box;
      try { box = Lampa.Storage.cache('nova_logo_tone', 500, {}); } catch (e) { box = null; }
      if (!box || typeof box !== 'object') box = {};
      return box;
    };

    this.uiLogoMeasure = function(picture) {
      var width = 48;
      var height = Math.max(1, Math.round((picture.naturalHeight || 1) * (width / (picture.naturalWidth || width))));
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      if (!ctx) return '';
      ctx.drawImage(picture, 0, 0, width, height);
      var data = ctx.getImageData(0, 0, width, height).data;
      var dark = 0;
      var spread = 0;
      var count = 0;
      for (var i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 60) continue;
        var r = data[i] / 255;
        var g = data[i + 1] / 255;
        var b = data[i + 2] / 255;
        count++;
        if (0.2126 * r + 0.7152 * g + 0.0722 * b >= NovaUI.LOGO_DARK) continue;
        dark++;
        spread += Math.max(r, g, b) - Math.min(r, g, b);
      }
      if (!count) return '';
      if (dark / count < NovaUI.LOGO_DARK_SHARE) return 'ok';
      return spread / dark < 0.18 ? 'invert' : 'glow';
    };

    this.uiLogoTone = function(src, done) {
      var _this = this;
      if (!src) return done('');
      var box = this.uiLogoToneBox();
      if (typeof box[src] === 'string') return done(box[src]);

      var probe;
      try { probe = new Image(); } catch (e) { return done(''); }
      probe.crossOrigin = 'anonymous';
      probe.onload = function() {
        var tone = '';
        try { tone = _this.uiLogoMeasure(probe); } catch (e) { tone = ''; }
        if (tone) {
          var now = _this.uiLogoToneBox();
          now[src] = tone;
          try { Lampa.Storage.set('nova_logo_tone', now); } catch (e) {}
        }
        done(tone);
      };
      probe.onerror = function() {
        done('');
      };
      probe.src = src;
    };

    this.uiLogoLoad = function(done) {
      var _this = this;
      var movie = object.movie;
      if (!this.uiLogoOn() || !movie || !movie.id) return done('');

      var lang = this.uiLogoLang();
      var cache_key = movie.id + ':' + lang;
      var all = this.uiLogoBox();
      var mine = all[cache_key];
      if (typeof mine === 'string') return done(mine);

      var kind = movie.name || movie.number_of_seasons ? 'tv' : 'movie';
      var url = '';
      var langs = lang === 'en' ? 'en,null' : lang + ',en,null';
      try {
        url = Lampa.TMDB.api(kind + '/' + movie.id + '/images?api_key=' + Lampa.TMDB.key() +
          '&include_image_language=' + langs);
      } catch (e) {
        url = '';
      }
      if (!url) return done('');

      var net = null;
      try { net = new Lampa.Reguest(); } catch (e) { net = null; }
      if (!net) return done('');

      var keep = function(path) {
        var box = _this.uiLogoBox();
        if (movie && movie.id) {
          box[cache_key] = path || '';
          try { Lampa.Storage.set('nova_logo_cache', box); } catch (e) {}
        }
        done(path || '');
      };

      try { net.timeout(8000); } catch (e) {}
      net.silent(url, function(answer) {
        keep(_this.uiLogoPick(answer && answer.logos));
      }, function() {
        done('');
      });
    };

    this.uiHeroLogo = function() {
      var _this = this;
      if (!ui.hero) return;
      var movie = object.movie;
      var slot = this.uiLogoSlot();
      if (!slot || !movie) return;

      var name = movie.title || movie.name || '';
      if (!this.uiLogoOn()) return slot.removeClass('nova-hero__title--logo').text(name);

      var want = movie.id;
      this.uiLogoLoad(function(path) {
        if (!ui.hero || !object.movie || object.movie.id !== want) return;
        var box = _this.uiLogoSlot();
        if (!box) return;

        var src = _this.uiLogoUrl(path);
        if (!src) return box.removeClass('nova-hero__title--logo').text(name);

        var picture = $('<img alt="">');
        picture.on('error', function() {
          box.removeClass('nova-hero__title--logo').text(name);
        });
        picture.attr('src', src);
        box.addClass('nova-hero__title--logo').empty().append(picture);
        _this.uiLogoTone(src, function(tone) {
          if (tone === 'ok' || !picture.parent().length) return;
          picture.addClass(tone === 'invert' ? 'nova-logo--invert' : 'nova-logo--glow');
        });
      });
    };

    this.uiHero = function(items) {
      var _this = this;
      if (Lampa.Storage.get('nova_hero', true) === false) {
        ui.hero_box.empty();
        ui.hero = null;
        return;
      }
      var movie = object.movie;

      var with_art = Lampa.Storage.get('nova_hero_art', true) !== false;
      if (!ui.hero) {
        ui.hero = $('<div class="nova-hero">' +
          (with_art ? '<div class="nova-hero__bg"><img alt=""></div><div class="nova-hero__shade"></div>' : '') +
          '<div class="nova-hero__body">' +
          (with_art ? '<div class="nova-hero__title"></div><div class="nova-hero__meta"></div><div class="nova-hero__descr"></div>' : '') +
          '<div class="nova-hero__actions">' +
          (with_art ? '' : '<div class="nova-hero__mark"></div>') +
          '<div class="nova-hero__hint"></div></div>' +
          '<div class="nova-hero__season" style="display:none"></div>' +
          '</div>' +
          '<div class="nova-hero__progress" style="display:none"></div>' +
          '</div>');
        if (!with_art) ui.hero.addClass('nova-hero--compact');
        if (with_art) {
          ui.hero.find('.nova-hero__title').text(movie.title || movie.name || '');
          ui.hero.find('.nova-hero__descr').text(movie.overview || '');
        }
        this.uiHeroLogo();
        var art = with_art ? (movie.backdrop_path || movie.poster_path) : '';
        if (art) {
          var back = ui.hero.find('.nova-hero__bg');
          var img = ui.hero.find('.nova-hero__bg img')[0];
          img.onload = function() {
            back.addClass('nova-hero__bg--loaded');
          };
          img.onerror = function() {};
          img.src = Lampa.TMDB.image('t/p/' + _this.uiArtSize() + art);
        }
        ui.hero_box.empty().append(ui.hero);
      }

      (items || []).forEach(function(item) {
        if (item && item.hash_timeline) {
          try { item.timeline = Lampa.Timeline.view(item.hash_timeline); } catch (e) {}
        }
      });
      var target = this.uiPickResume(items);
      var button = this.uiPlayButton();
      var serial_now = movie.name ? true : false;
      ui.play_show = !!target && !ui_nav;
      if (!ui.play_show) {

        button.detach();
        ui.hero_box.empty();
        ui.hero = null;
        return null;
      }
      ui.hero.find('.nova-hero__actions').prepend(button);

      var next_item = serial_now ? this.uiNextItem(target) : null;
      var line_target = target.timeline;
      var next_show = !!next_item && !!(line_target && line_target.percent > 0 && line_target.percent < 90);
      var next_button = this.uiNextButton();
      if (next_show) {
        next_button.find('.nova-btn__label').text(Lampa.Lang.translate('nova_next_episode') +
          ' · ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + next_item.episode);
        button.after(next_button);
      } else next_button.detach();

      if (with_art) {
        var meta = ui.hero.find('.nova-hero__meta').empty();
        var badge = NovaUI.shortQuality(target.quality || (target.qualitys ? Lampa.Arrays.getKeys(target.qualitys)[0] : ''));
        if (badge) meta.append('<div class="nova-badge">' + badge + '</div>');
        if (movie.vote_average) meta.append('<div>★ ' + parseFloat(movie.vote_average + '').toFixed(1) + '</div>');
        var year = ((movie.release_date || movie.first_air_date || '') + '').slice(0, 4);
        if (year) meta.append('<div>' + year + '</div>');
        if (target.time) meta.append('<div>' + NovaUI.esc(target.time) + '</div>');
      }

      var serial = movie.name ? true : false;
      var line = target.timeline;
      var started = line && line.percent > 0 && line.percent < 90;
      var label = Lampa.Lang.translate(started ? 'nova_continue' : 'nova_watch');
      if (serial && target.episode) {
        label += ' · S' + (target.season || 1) + ' E' + target.episode;
      }
      button.find('.nova-btn__label').text(label);

      var hint = [];
      if (!object.balanser && sources[balanser]) hint.push(NovaUI.splitSourceName(sources[balanser].name).name);
      if (target.voice_name && target.voice_name !== Lampa.Lang.translate('nova_unknown')) hint.push(target.voice_name);
      ui.hero.find('.nova-hero__hint').text(hint.join(' · '));

      var season_percent = -1;
      var season_line = ui.hero.find('.nova-hero__season');
      if (serial && !ui_nav && items.length > 1) {
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var seen = 0;
        items.forEach(function(item) {
          if (NovaUI.isSeen(item)) seen++;
        });
        var progress_text = Lampa.Lang.translate('nova_season_progress').replace('{seen}', seen).replace('{total}', items.length);

        if (seen < items.length) {
          progress_text += ' · ' + Lampa.Lang.translate('nova_season_left').replace('{left}', items.length - seen);
        }
        if (ui_season_planned > items.length) {
          progress_text += ' · ' + Lampa.Lang.translate('nova_season_planned').replace('{planned}', ui_season_planned);
        }
        season_line.text(progress_text).show();
        season_percent = Math.round(seen / items.length * 100);
      } else season_line.hide();

      var progress = ui.hero.find('.nova-hero__progress').empty();
      if (season_percent >= 0) {
        if (season_percent > 0) {
          progress.show().append('<div class="time-line"><div style="width:' + Math.min(100, season_percent) + '%"></div></div>');
        } else progress.hide();
      } else if (line && line.percent > 0) progress.show().append(Lampa.Timeline.render(line));
      else progress.hide();

      return button;
    };

    this.uiFallbackArt = function() {
      var movie = object.movie;
      var path = function(value) {
        if (!value || value === 'undefined') return '';
        return String(value).indexOf('http') === 0 ? value : Lampa.TMDB.image('t/p/w300' + value);
      };
      var art = path(movie.backdrop_path) || path(movie.poster_path);
      if (!art && Lampa.Utils.cardImgBackground) {
        try {
          art = Lampa.Utils.cardImgBackground(movie) || '';
        } catch (e) {
          art = '';
        }
      }
      if (!art) art = path(movie.img);
      return art;
    };

    this.uiSearch = function() {
      var native_search = filter.render().find('.filter--search');
      if (native_search.length) return native_search.trigger('hover:enter');
      if (Lampa.Input && Lampa.Input.edit) {
        var enabled = Lampa.Controller.enabled().name;
        Lampa.Input.edit({
          value: object.search || '',
          free: true,
          nosave: true,
          title: Lampa.Lang.translate('search')
        }, function(value) {
          Lampa.Controller.toggle(enabled);
          if (value && filter.onSearch) filter.onSearch(value);
        });
      }
    };

    this.uiRows = function() {
      var _this = this;
      NovaUI.qualityScope(object.movie ? object.movie.id : '');
      var rows = ui.rows.empty();
      var toolbar = $('<div class="nova-toolbar"></div>');

      var addChip = function(key, label, text, extra) {
        if (label) toolbar.append($('<div class="nova-toolbar__label"></div>').text(label));
        var chip = $('<div class="nova-chip selector"></div>');
        chip.attr('data-nova-focus', key);
        if (extra && extra.badge) chip.append($('<span class="nova-chip__badge"></span>').text(extra.badge));
        chip.append($('<span class="nova-chip__label"></span>').text(text));
        if (!(extra && extra.action)) chip.append(NovaUI.icon.chevron);
        if (ui_open == key) chip.addClass('nova-chip--active');
        chip.on('hover:enter', function() {
          if (extra && extra.action) extra.action();
          else _this.uiToggle(key);
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        toolbar.append(chip);
      };

      if (!object.balanser && sourceKeys().length && balanser) {
        var info = sources[balanser] || {};
        var parts = NovaUI.splitSourceName(info.name || balanser);
        addChip('source', Lampa.Lang.translate('lampac_balanser'), parts.name, {
          badge: NovaUI.sourceBadge(balanser, parts)
        });
      }

      var choice = this.getChoice();
      var seasons = filter_find.season || [];
      if (seasons.length > 1) {
        addChip('season', Lampa.Lang.translate('torrent_serial_season'), (seasons[choice.season] || seasons[0]).title);
      }

      var voices = filter_find.voice || [];
      if (voices.length > 1) {
        addChip('voice', Lampa.Lang.translate('torrent_parser_voice'), (voices[choice.voice] || voices[0]).title);
      }

      if (!ui_nav && ui_items.length > NovaUI.JUMP_FROM) {
        var page_now = NovaUI.pageAt(NovaUI.pages(ui_items.length), ui_page > 0 ? ui_page : 0);
        addChip('jump', Lampa.Lang.translate('nova_jump'), this.pageTitle(page_now));
      }

      if (similar_list && similar_list.length > 1 && !similar_shown) {
        addChip('variants', '', Lampa.Lang.translate('nova_similar_all'), {
          badge: String(similar_list.length),
          action: function() {
            var saved = similar_list;
            similar_auto = true;
            _this.uiSimilars(saved, true);
          }
        });
      }

      rows.append(toolbar);

      if (ui_open == 'source' && !object.balanser) this.uiSourceRow();
      else if (ui_open == 'season') this.uiOptionRow('season');
      else if (ui_open == 'voice') this.uiOptionRow('voice');
      else if (ui_open == 'jump') this.uiJumpRow();
    };

    this.sourceOrder = function(names) {
      var _this = this;
      var rank = function(name) {

        if (name == balanser) return -1;
        var state = _this.sourceState(name);
        if (state == 'ok') return 0;
        if (state == 'empty') return 2;

        return (sources[name] && sources[name].show) || NovaUI.knownQuality(name) ? 1 : 2;
      };
      var quality = function(name) {
        var info = sources[name] || {};
        return NovaUI.qualityRank(NovaUI.knownQuality(name) ||
          NovaUI.splitSourceName(info.name || name).badge);
      };
      return names.map(function(name, index) {
        return {
          name: name,
          index: index
        };
      }).sort(function(a, b) {
        return (rank(a.name) - rank(b.name)) ||
          (quality(b.name) - quality(a.name)) ||
          (a.index - b.index);
      }).map(function(entry) {
        return entry.name;
      });
    };

    this.probeCache = function() {
      var all = Lampa.Storage.cache('nova_probe', 2000, {});
      var mine = all[object.movie.id];
      if (!mine) {
        mine = {
          time: Date.now(),
          list: {}
        };
        all[object.movie.id] = mine;
      }

      var list = mine.list || {};
      var now = Date.now();
      for (var key in list) {
        var entry = list[key] || {};
        var stamp = entry.t || mine.time || 0;
        var ttl = entry.s == 'ok' ? NovaUI.PROBE_TTL_OK : NovaUI.PROBE_TTL_EMPTY;
        if (now - stamp > ttl) delete list[key];
      }
      mine.list = list;
      return mine;
    };

    this.probeSave = function(name, state, count) {
      var all = Lampa.Storage.cache('nova_probe', 2000, {});
      var mine = this.probeCache();
      mine.list[name] = {
        s: state,
        c: count || 0,
        t: Date.now()
      };
      all[object.movie.id] = mine;
      Lampa.Storage.set('nova_probe', all);
    };

    this.sourceState = function(name) {
      var entry = this.probeCache().list[name];
      return entry ? entry.s : '';
    };


    this.uiToggle = function(key) {
      var opening = ui_open != key;
      ui_open = opening ? key : '';

      ui_focus = key;
      if (opening) {
        var choice = this.getChoice();
        if (key == 'source' && balanser) ui_focus = 'src:' + balanser;
        else if (key == 'season') ui_focus = 'season:' + (choice.season || 0);
        else if (key == 'voice') ui_focus = 'voice:' + (choice.voice || 0);
      }
      this.uiRows();
      this.uiFocusRestore(false);
      Lampa.Controller.enable('content');
    };

    this.uiAlive = function(element) {
      try {
        return !!element && !!element.nodeType && document.body.contains(element);
      } catch (e) {
        return !!element;
      }
    };

    this.uiLayoutReady = function() {
      try {
        return document.body.offsetWidth > 0 || document.body.offsetHeight > 0;
      } catch (e) {
        return false;
      }
    };

    this.uiShown = function(element) {
      if (!this.uiAlive(element)) return false;
      if (!this.uiLayoutReady()) return true;
      try {
        if (element.offsetWidth <= 0 && element.offsetHeight <= 0) return false;
        return element.offsetParent !== null;
      } catch (e) {
        return true;
      }
    };

    this.uiSeekKey = function(key) {
      if (!modern || !key || !ui.root) return false;
      var found = ui.root.find('[data-nova-focus="' + key + '"]');
      return found.length && this.uiShown(found[0]) ? found[0] : false;
    };

    this.uiItemIndex = function(item) {
      if (!item) return -1;
      for (var i = 0; i < ui_items.length; i++) {
        if (ui_items[i] === item) return i;
      }
      return -1;
    };

    this.uiResumePage = function() {
      if (!modern || ui_nav || !ui_items.length) return false;
      if (ui_items.length <= NovaUI.JUMP_FROM) return false;
      var item = this.uiPickResume(ui_items);
      if (!item || (item.__html && item.__html.length)) return false;
      var index = this.uiItemIndex(item);
      if (index < 0) return false;
      var page = NovaUI.pageAt(NovaUI.pages(ui_items.length), index);
      if (page.start === ui_page) return false;
      this.uiShowPage(page.start, index);
      return true;
    };

    this.uiKeepIndex = function() {
      if (!ui_keep || ui_keep.indexOf('item:') !== 0) return -1;
      var index = parseInt(ui_keep.slice(5), 10);
      if (isNaN(index) || index < 0 || index >= ui_items.length) return -1;
      return index;
    };

    this.uiPreselectPage = function() {
      var index = this.uiKeepIndex();
      if (index < 0 || ui_nav) return false;
      var item = ui_items[index];
      if (!item || (item.__html && item.__html.length)) return false;
      if (ui_items.length <= NovaUI.JUMP_FROM) return false;
      var page = NovaUI.pageAt(NovaUI.pages(ui_items.length), index);
      if (page.start === ui_page) return false;
      this.uiShowPage(page.start, index);
      return true;
    };

    this.uiFocusTarget = function() {
      if (!modern) return last || false;
      if (this.uiShown(last)) return last;

      var kept = this.uiSeekKey(ui_keep);
      if (kept) return kept;
      if (this.uiPreselectPage()) return false;

      if (ui.play && ui.play.length && ui.play.parent().length && this.uiShown(ui.play[0]) &&
        Lampa.Storage.get('lampac_continue_play', true) !== false) return ui.play[0];
      var item = this.uiPickResume(ui_items);
      if (item && item.__html && item.__html.length && this.uiShown(item.__html[0])) return item.__html[0];
      if (this.uiResumePage()) return false;
      if (ui.list) return ui.list.find('.nova-card.selector')[0] || false;
      return this.uiAlive(last) ? last : false;
    };

    this.uiDropRow = function() {
      if (!modern || !ui.rows) return null;
      var row = ui.rows.find('.nova-drop');
      return row.length ? row : null;
    };

    this.uiDropFocused = function() {
      var row = this.uiDropRow();
      return !!(row && last && row.find(last).length);
    };

    this.uiDropOwner = function() {
      if (!modern || !ui.rows || !ui_open) return false;
      var bar = ui.rows.find('.nova-toolbar');
      var chip = bar.find('[data-nova-focus="' + ui_open + '"]')[0];
      if (!chip) chip = bar.find('.nova-chip--active')[0];
      if (!chip) chip = bar.find('.nova-chip')[0];
      return chip || false;
    };

    this.uiFocusNode = function(node) {
      if (!node || !this.uiAlive(node)) return false;
      last = node;
      ui_focus = node.getAttribute ? (node.getAttribute('data-nova-focus') || '') : '';
      try { scroll.update($(node), true); } catch (e) {}
      try { Lampa.Controller.collectionFocus(node, scroll.render()); } catch (e) {}
      return true;
    };

    this.uiDropItems = function() {
      var row = this.uiDropRow();
      if (!row) return [];
      var _this = this;
      var out = [];
      row.find('.selector').each(function() {
        if (_this.uiShown(this)) out.push(this);
      });
      return out;
    };

    this.uiRowStep = function(dir) {
      var nodes = this.uiDropItems();
      if (!nodes.length || !last) return false;
      var from = last.getBoundingClientRect();
      if (!from.width && !from.height) return false;
      var mid = from.left + from.width / 2;
      var tol = Math.max(6, from.height / 2);
      var line = false;
      var i, box, edge, dist;
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i] === last) continue;
        box = nodes[i].getBoundingClientRect();
        if (!box.width && !box.height) continue;
        if (dir === 'up') {
          if (box.bottom > from.top + tol) continue;
          if (line === false || box.bottom > line) line = box.bottom;
        } else {
          if (box.top < from.bottom - tol) continue;
          if (line === false || box.top < line) line = box.top;
        }
      }
      if (line === false) return false;
      var best = false;
      var gap = 0;
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i] === last) continue;
        box = nodes[i].getBoundingClientRect();
        if (!box.width && !box.height) continue;
        edge = dir === 'up' ? box.bottom : box.top;
        if (Math.abs(edge - line) > tol) continue;
        dist = Math.abs(box.left + box.width / 2 - mid);
        if (best === false || dist < gap) {
          best = nodes[i];
          gap = dist;
        }
      }
      return best;
    };

    this.uiDropEntry = function() {
      var nodes = this.uiDropItems();
      if (!nodes.length) return false;
      var row = this.uiDropRow();
      var active = row ? row.find('.nova-chip--active')[0] : false;
      if (active && this.uiShown(active)) return active;
      var mid = false;
      var from;
      if (last) {
        from = last.getBoundingClientRect();
        if (from.width || from.height) mid = from.left + from.width / 2;
      }
      var top = false;
      var i, box, dist;
      for (i = 0; i < nodes.length; i++) {
        box = nodes[i].getBoundingClientRect();
        if (top === false || box.top < top) top = box.top;
      }
      var best = false;
      var gap = 0;
      for (i = 0; i < nodes.length; i++) {
        box = nodes[i].getBoundingClientRect();
        if (box.top - top > Math.max(6, box.height / 2)) continue;
        if (mid === false) return nodes[i];
        dist = Math.abs(box.left + box.width / 2 - mid);
        if (best === false || dist < gap) {
          best = nodes[i];
          gap = dist;
        }
      }
      return best || nodes[0];
    };

    this.uiDropUp = function() {
      if (!this.uiDropFocused()) return false;
      var above = this.uiRowStep('up');
      if (above) return this.uiFocusNode(above);
      return this.uiFocusNode(this.uiDropOwner());
    };

    this.uiDropDown = function() {
      if (!modern || !ui_open) return false;
      if (this.uiDropFocused()) return this.uiFocusNode(this.uiRowStep('down'));
      if (!this.uiToolbarFocused()) return false;
      return this.uiFocusNode(this.uiDropEntry());
    };

    this.uiDropSide = function(dir) {
      var nodes = this.uiDropItems();
      if (!nodes.length || !last) return false;
      var at = -1;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === last) {
          at = i;
          break;
        }
      }
      if (at === -1) return false;
      var next = dir === 'left' ? at - 1 : at + 1;
      if (next < 0 || next >= nodes.length) return false;
      return nodes[next];
    };

    this.uiDropLeft = function() {
      if (!modern || !ui_open) return false;
      if (this.uiDropFocused()) {
        var back = this.uiDropSide('left');
        if (back) this.uiFocusNode(back);
        return true;
      }
      return this.uiToolbarFocused();
    };

    this.uiDropRight = function() {
      if (!modern || !ui_open || !this.uiDropFocused()) return false;
      var ahead = this.uiDropSide('right');
      return ahead ? this.uiFocusNode(ahead) : false;
    };

    this.uiToolbarFocus = function() {
      if (!modern || !ui.rows) return false;
      var row = ui.rows.find('.nova-toolbar');
      var chip = row.find('[data-nova-focus="source"]')[0] || row.find('.nova-chip')[0];
      if (!chip) return false;
      last = chip;
      scroll.update($(chip), true);
      Lampa.Controller.collectionFocus(chip, scroll.render());
      return true;
    };

    this.uiUpFallback = function() {
      if (!ui.root || !last) return false;
      if (this.uiToolbarFocused() || (ui.rows && ui.rows.find(last).length)) {
        if (!ui.play || !ui.play.length || !ui.play.parent().length) return false;
        last = ui.play[0];
        scroll.update(ui.play, true);
        Lampa.Controller.collectionFocus(last, scroll.render());
        return true;
      }
      if (ui.list && ui.list.find(last).length) return this.uiToolbarFocus();
      return false;
    };

    this.uiToolbarFocused = function() {
      if (!modern || !ui.rows || !last) return false;
      return ui.rows.find('.nova-toolbar').find(last).length > 0;
    };

    this.uiJumpRow = function() {
      var _this = this;
      var items = ui_items;
      var pages = NovaUI.pages(items.length);
      var row = $('<div class="nova-drop"></div>');
      var make = function(page) {
        var chip = $('<div class="nova-chip selector"></div>');
        chip.attr('data-nova-focus', 'jump:' + page.start);
        chip.append($('<span class="nova-chip__label"></span>').text(_this.pageTitle(page)));
        if (page.start === ui_page) chip.addClass('nova-chip--active');
        chip.on('hover:enter', function() {
          _this.uiShowPage(page.start, page.start);
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        row.append(chip);
      };
      for (var i = 0; i < pages.length; i++) make(pages[i]);
      ui.rows.append(row);
    };

    this.pageTitle = function(page) {
      var first = parseInt(ui_items[page.start] && ui_items[page.start].episode, 10) || page.start + 1;
      var last_num = parseInt(ui_items[page.end] && ui_items[page.end].episode, 10) || page.end + 1;
      return first == last_num ? String(first) : first + '–' + last_num;
    };

    this.uiShowPage = function(start, focus_index) {
      if (!ui_items.length) return;
      ui_open = '';
      ui_focus = '';
      ui_page = start;
      ui_page_focus = typeof focus_index === 'number' ? focus_index : start;
      this.uiDraw(ui_items, ui_draw_params);
    };

    this.uiGoToItem = function(item) {
      if (!item) return false;
      for (var i = 0; i < ui_items.length; i++) {
        if (ui_items[i] !== item) continue;
        if (item.__html && item.__html.length) {
          last = item.__html[0];
          scroll.update(item.__html, true);
          Lampa.Controller.collectionFocus(last, scroll.render());
          return true;
        }
        this.uiShowPage(NovaUI.pageAt(NovaUI.pages(ui_items.length), i).start, i);
        return true;
      }
      return false;
    };

    this.uiOptionRow = function(type) {
      var _this = this;
      var list = filter_find[type] || [];
      var selected = this.getChoice()[type];
      var order = list.map(function(entry, index) {
        return {
          entry: entry,
          index: index
        };
      });

      if (type == 'voice') {
        var rank = function(title) {
          var kind = NovaUI.voiceKind(title);
          for (var i = 0; i < NovaUI.VOICE_KINDS.length; i++) {
            if (NovaUI.VOICE_KINDS[i].key == kind) return i;
          }
          return 90;
        };
        order.sort(function(a, b) {
          return (rank(a.entry.title) - rank(b.entry.title)) || (a.index - b.index);
        });
      }

      var row = $('<div class="nova-drop"></div>');
      order.forEach(function(item) {
        var chip = $('<div class="nova-chip selector"></div>');
        chip.attr('data-nova-focus', type + ':' + item.index);
        chip.append($('<span class="nova-chip__label"></span>').text(item.entry.title));
        if (item.index == selected) chip.addClass('nova-chip--active');
        chip.on('hover:enter', function() {
          if (item.index == selected) return _this.uiToggle(type);
          _this.uiSwitch(type, item.index);
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        row.append(chip);
      });
      ui.rows.append(row);
    };

    this.uiSwitch = function(type, index) {
      var list = filter_find[type] || [];
      if (!list[index]) return;
      var choice = this.getChoice();
      if (type == 'season') this.seasonMemory(NovaUI.seasonNumber(list[index].title));
      if (type == 'voice') {
        choice.voice_name = list[index].title;
        choice.voice_url = list[index].url;

        Lampa.Storage.set('nova_voice_pref', NovaUI.voiceKind(list[index].title));
      }
      ui_open = '';
      choice[type] = index;
      this.saveChoice(choice);
      ui_focus = type;
      this.uiLoading();
      this.request(list[index].url);
    };

    this.uiSourceMenu = function() {
      this.uiToggle('source');
    };

    this.sourceChip = function(name) {
      var _this = this;
      var info = sources[name] || {};
      var parts = NovaUI.splitSourceName(info.name || name);
      var chip = $('<div class="nova-chip selector"></div>');
      chip.attr('data-nova-focus', 'src:' + name);
      var badge = NovaUI.sourceBadge(name, parts);
      if (badge) chip.append('<span class="nova-chip__badge">' + badge + '</span>');
      chip.append($('<span class="nova-chip__label"></span>').text(parts.name));
      if (name == balanser) chip.addClass('nova-chip--active');

      var known = this.probeCache().list[name];
      var state = known ? known.s : '';
      if (state == 'empty') chip.addClass('nova-chip--empty');
      else if (state == 'ok' || info.show) chip.append('<span class="nova-chip__dot"></span>');
      else if (!life_done) chip.addClass('nova-chip--checking');
      chip.on('hover:enter', function() {
        ui_open = '';
        if (name == balanser) {
          ui_focus = 'source';
          _this.uiRows();
          _this.uiFocusRestore(false);
          Lampa.Controller.enable('content');
          return;
        }
        _this.switchSource(name);
      }).on('hover:focus', function(e) {
        last = e.target;
        scroll.update($(e.target), true);
      });
      return chip;
    };

    this.uiSourceRow = function() {
      var _this = this;
      var cached = this.probeCache().list;
      var all = sourceKeys();

      var visible = all.filter(function(name) {
        var info = sources[name] || {};
        var state = cached[name] ? cached[name].s : '';
        if (name == balanser) return true;
        if (state == 'ok') return true;
        if (state == 'empty') return false;
        if (!life_done) return true;
        if (NovaUI.knownQuality(name)) return true;
        return info.show;
      });

      var hidden = all.filter(function(name) {
        return visible.indexOf(name) === -1;
      });
      if (ui_all_sources) visible = visible.concat(hidden);
      visible = this.sourceOrder(visible);

      var row = $('<div class="nova-drop"></div>');
      visible.forEach(function(name) {
        row.append(_this.sourceChip(name));
      });

      if (!ui_all_sources && hidden.length) {
        var more = $('<div class="nova-chip nova-chip--more selector"></div>');
        more.attr('data-nova-focus', 'src:more');
        more.append($('<span class="nova-chip__label"></span>')
          .text(Lampa.Lang.translate('nova_more_sources').replace('{count}', hidden.length)));
        more.on('hover:enter', function() {
          ui_all_sources = true;
          ui_focus = 'src:' + (hidden[0] || balanser);
          _this.uiRows();
          _this.uiFocusRestore(false);
          Lampa.Controller.enable('content');
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        row.append(more);
      }
      ui.rows.append(row);
    };

    this.uiSwitch = function(type, index) {
      var list = filter_find[type] || [];
      if (!list[index]) return;
      var choice = this.getChoice();
      if (type == 'season') this.seasonMemory(NovaUI.seasonNumber(list[index].title));
      if (type == 'voice') {
        choice.voice_name = list[index].title;
        choice.voice_url = list[index].url;

        Lampa.Storage.set('nova_voice_pref', NovaUI.voiceKind(list[index].title));
      }
      ui_open = '';
      choice[type] = index;
      this.saveChoice(choice);
      ui_focus = type;
      this.uiLoading();
      this.request(list[index].url);
    };

    this.uiSourceMenu = function() {
      this.uiToggle('source');
    };

    this.switchSource = function(name) {
      if (!sources[name]) return;

      if (sources_stale) {
        pending_source = name;
        balanser = name;
        ui_open = '';
        this.uiRows();
        Lampa.Controller.toggle('content');
        return;
      }
      if (!modern) {
        object.lampac_custom_select = name;
        return this.changeBalanser(name);
      }
      object.lampac_custom_select = name;
      balanser = name;
      source = sources[name].url;
      Lampa.Storage.set('online_balanser', name);
      Lampa.Storage.set('active_balanser', name);
      this.updateBalanser(name);
      filter_find = {
        season: [],
        voice: []
      };
      ui_tried[name] = true;
      ui_open = '';
      season_pinned = false;
      similar_list = null;
      similar_auto = false;
      ui_focus = 'source';
      this.uiLoading();
      this.uiRows();
      var chip = ui.rows.find('[data-nova-focus="source"]')[0];
      if (chip) last = chip;
      this.find();
      Lampa.Controller.toggle('content');
    };

    var sourceKeys = function() {
      return Object.prototype.toString.call(filter_sources) === '[object Array]' ? filter_sources : [];
    };

    this.nextSource = function() {
      var _this = this;
      var keys = sourceKeys().filter(function(name) {
        if (!sources[name] || name === balanser || ui_tried[name]) return false;
        var state = _this.sourceState(name);
        if (state == 'ok') return true;
        if (state == 'empty') return false;

        return sources[name].show || !!NovaUI.knownQuality(name);
      });
      if (!keys.length) return '';
      return this.sourceOrder(keys)[0];
    };

    this.uiNote = function(params) {
      var _this = this;
      this.uiFrame();
      this.uiLoadingStop();
      this.uiWatchStop();
      var note = $('<div class="nova-note"><div class="nova-note__main"><div class="nova-note__title"></div><div class="nova-note__text"></div><div class="nova-note__actions"></div></div></div>');
      note.find('.nova-note__title').text(params.title || '');
      note.find('.nova-note__text').html(params.text || '');
      var actions = note.find('.nova-note__actions');
      (params.actions || []).forEach(function(action) {
        var button = $('<div class="nova-btn selector"></div>');
        if (action.icon) button.append(action.icon);
        button.append($('<span></span>').text(action.title));
        button.on('hover:enter', action.handler).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        actions.append(button);
      });

      ui.list.empty().append(note);
      this.uiRows();
      this.loading(false);
      last = actions.find('.selector')[0] || false;
      Lampa.Controller.enable('content');
      return note;
    };

    this.uiDraw = function(items, params) {
      var _this = this;
      params = params || {};
      if (!items.length) return this.empty();
      NovaUI.qualityScope(object.movie ? object.movie.id : '');
      this.probeSave(balanser, 'ok', items.length);
      if (!params.similars) NovaUI.rememberQuality(balanser, NovaUI.bestQuality(items));
      this.uiFrame();
      this.uiLoadingStop();
      this.uiWatchStop();
      ui_items = items;
      ui_enter = params.onEnter;
      ui_draw_params = params;
      similar_shown = false;
      var serial = object.movie.name ? true : false;

      var title_count = {};
      items.forEach(function(item) {
        var text = item.text || item.title || '';
        title_count[text] = (title_count[text] || 0) + 1;
      });

      var looksEpisode = function(text) {
        return /сери|episode|эпізод|эпизод/i.test(String(text || '')) || /^\s*\d+\s*$/.test(String(text || ''));
      };
      ui_nav = items.length > 1 && items.every(function(item) {
        var text = item.text || item.title || '';
        if (NovaUI.isSeasonLabel(text)) return true;

        return serial && typeof item.episode === 'undefined' && !looksEpisode(text);
      });

      var draw_gen = request_gen;
      this.getEpisodes(items[0].season, function(episodes) {

        if (draw_gen !== request_gen) return;
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var choice = _this.getChoice();
        var fully = window.innerWidth > 580;
        var list = ui.list.empty();
        var focus_element = false;
        var focus_mark = false;

        if (serial && items[0] && items[0].season) {
          var shown_season = parseInt(items[0].season);
          var wanted_season = _this.seasonMemory();
          if (shown_season && (!wanted_season || shown_season == wanted_season || _this.seasonIndexByMemory() >= 0)) {
            _this.seasonMemory(shown_season);
          }
        }

        var grid = !ui_nav && items.length > 0 && Lampa.Storage.get('nova_view', 'list') === 'grid';
        var compact = !serial && !ui_nav && !grid && items.length > 1;
        ui_grid = grid;
        ui_season_planned = 0;
        if (!ui_nav && !params.similars && serial) {
          if (episodes && episodes.length) ui_season_planned = episodes.length;
          else ui_season_planned = _this.seasonPlannedFallback(items[0] && items[0].season);
        }
        if (grid) list.addClass('nova__list--grid');
        else list.removeClass('nova__list--grid');

        var paged = !ui_nav && !params.similars && items.length > NovaUI.JUMP_FROM;
        var page_start = 0;
        var page_end = items.length - 1;
        if (paged) {
          var pages = NovaUI.pages(items.length);
          var page;
          if (ui_page < 0 || ui_page >= items.length) {
            var resume_item = _this.uiPickResume(items);
            var resume_at = 0;
            for (var pi = 0; pi < items.length; pi++) {
              if (items[pi] === resume_item) {
                resume_at = pi;
                break;
              }
            }
            page = NovaUI.pageAt(pages, resume_at);
          } else page = NovaUI.pageAt(pages, ui_page);
          ui_page = page.start;
          page_start = page.start;
          page_end = page.end;
        } else ui_page = 0;

        items.forEach(function(element, index) {
          var on_page = !paged || (index >= page_start && index <= page_end);
          var episode = serial && episodes.length && !params.similars ? arrFind(episodes, function(e) {
            return e.episode_number == element.episode;
          }) : false;
          var episode_num = element.episode || index + 1;
          var episode_last = choice.episodes_view[element.season];
          var voice_name = choice.voice_name || (filter_find.voice[0] ? filter_find.voice[0].title : false) || element.voice_name || (serial ? Lampa.Lang.translate('nova_unknown') : element.text) || Lampa.Lang.translate('nova_unknown');

          if (element.quality) {
            element.qualitys = element.quality;
            element.quality = Lampa.Arrays.getKeys(element.quality)[0];
          }
          element.voice_name = voice_name;
          var runtime = parseInt((episode && episode.runtime) || 0, 10) || 0;
          if (!runtime && serial) runtime = parseInt((object.movie.episode_run_time || [])[0], 10) || 0;
          if (!runtime) runtime = parseInt(object.movie.runtime, 10) || 0;
          element.time = runtime ? Lampa.Utils.secondsToTime(runtime * 60, true) : '';

          var hash_timeline = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var hash_behold = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.voice_name].join('') : object.movie.original_title + element.voice_name);
          element.hash_behold = hash_behold;
          element.hash_timeline = hash_timeline;
          element.timeline = Lampa.Timeline.view(hash_timeline);
          if (element.season) {
            element.translate_episode_end = _this.getLastEpisode(items);
            element.translate_voice = element.voice_name;
          }
          var data = {
            hash_timeline: hash_timeline,
            hash_behold: hash_behold
          };

          var title = (episode ? episode.name : (element.text || element.title)) || object.movie.title || object.movie.name || '';
          element.title = title;

          var meta = [];
          if (episode && episode.vote_average) meta.push('★ ' + parseFloat(episode.vote_average + '').toFixed(1));
          if (episode && episode.air_date && fully) meta.push(Lampa.Utils.parseTime(episode.air_date).full);
          else if (!episode && !compact && object.movie.release_date && fully) meta.push(Lampa.Utils.parseTime(object.movie.release_date).full);

          if (!serial && !ui_nav && voice_name && voice_name !== title && voice_name !== Lampa.Lang.translate('nova_unknown')) meta.push(voice_name);

          element.__meta_base = meta.slice();
          var seen_line = element.timeline;
          if (!ui_nav && seen_line && seen_line.percent > 0 && seen_line.duration > seen_line.time) {
            meta.push(Lampa.Lang.translate('nova_left') + ' ' + Lampa.Utils.secondsToTime(seen_line.duration - seen_line.time, true));
          }

          var addViewed = function() {
            if (!element.__html) return;
            if (grid) {
              var box = element.__html.find('.nova-card__thumb');
              if (box.length && !box.find('.nova-card__viewed').length) {
                box.append('<div class="nova-card__viewed">' + NovaUI.icon.eye + '</div>');
              }
              return;
            }
            var side = element.__html.find('.nova-card__side');
            if (side.length && !side.find('.nova-card__eye').length) {
              side.append('<div class="nova-card__eye">' + NovaUI.icon.eye + '</div>');
            }
          };
          element.mark = function() {
            viewed = Lampa.Storage.cache('online_view', 5000, []);
            if (viewed.indexOf(hash_behold) == -1) {
              viewed.push(hash_behold);
              Lampa.Storage.set('online_view', viewed);
            }
            choice = _this.getChoice();
            if (!serial) choice.movie_view = hash_behold;
            _this.saveChoice(choice);
            var voice_text = choice.voice_name || element.voice_name || element.title;
            if (voice_text.length > 30) voice_text = voice_text.slice(0, 30) + '...';
            _this.watched({
              balanser: balanser,
              balanser_name: Lampa.Utils.capitalizeFirstLetter(sources[balanser] ? sources[balanser].name.split(' ')[0] : balanser),
              voice_id: choice.voice_id,
              voice_name: voice_text,
              episode: element.episode,
              season: element.season
            });
            _this.uiRefreshMarks();
          };
          element.markSeen = function() {
            element.mark();
            _this.timelineSet(element, 100);
            addViewed();
            _this.uiRefreshMarks();
          };
          element.unmark = function() {
            viewed = Lampa.Storage.cache('online_view', 5000, []);
            if (viewed.indexOf(hash_behold) !== -1) {
              Lampa.Arrays.remove(viewed, hash_behold);
              Lampa.Storage.set('online_view', viewed);
              Lampa.Storage.remove('online_view', hash_behold);
            }
            _this.timelineSet(element, 0);
            if (element.__html) element.__html.find('.nova-card__viewed,.nova-card__eye').remove();
            _this.uiRefreshMarks();
          };
          element.timeclear = function() {
            element.timeline.percent = 0;
            element.timeline.time = 0;
            element.timeline.duration = 0;
            Lampa.Timeline.update(element.timeline);
            _this.uiRefreshMarks();
          };
          if (!on_page) {
            element.__html = null;
            return;
          }

          var html = $('<div class="nova-card selector">' +
            '<div class="nova-card__thumb"><img alt=""><div class="nova-card__num"></div><div class="nova-card__line"></div></div>' +
            '<div class="nova-card__body"><div class="nova-card__title"></div><div class="nova-card__meta"></div></div>' +
            '<div class="nova-card__side"><div class="nova-card__quality"></div><div class="nova-card__time"></div></div>' +
            '</div>');
          element.__html = html;
          if (!ui_nav) html.attr('data-nova-focus', 'item:' + index);
          if (!serial) html.addClass('nova-card--file');

          if (ui_nav) html.addClass('nova-card--nav');
          html.find('.nova-card__title').text(title);
          html.find('.nova-card__meta').html(meta.map(function(part) {
            return '<span>' + NovaUI.esc(part) + '</span>';
          }).join('<span class="nova-dot">●</span>'));
          html.find('.nova-card__num').text(NovaUI.episodeNumber(episode_num));
          html.find('.nova-card__time').text(element.time || '');

          var badge = NovaUI.shortQuality(element.quality) ||
            NovaUI.bestQualityFromText(element.title || element.text || '', true) ||
            NovaUI.knownQuality(balanser) ||
            NovaUI.splitSourceName((sources[balanser] && sources[balanser].name) || '').badge;
          if (badge) html.find('.nova-card__quality').addClass('nova-badge').text(badge);
          else html.find('.nova-card__quality').remove();

          var line_box = html.find('.nova-card__line').show();
          line_box.append(Lampa.Timeline.render(element.timeline));

          if (!grid && !ui_nav) {
            line_box.addClass('nova-card__line--body').appendTo(html.find('.nova-card__body'));
          }
          if (!serial || ui_nav) html.find('.nova-card__num').remove();
          if (ui_nav) {
            html.addClass('nova-card--slim');
            if (title_count[title] > 1) {
              var provider = NovaUI.providerName(element.url);
              if (provider) html.find('.nova-card__meta').text(provider);
            }
            line_box.remove();
            html.find('.nova-card__thumb').remove();
            html.find('.nova-card__side').remove();
            html.find('.nova-card__body').append('<div class="nova-card__go">' + NovaUI.icon.chevron + '</div>');
          }

          var thumb = html.find('.nova-card__thumb');
          var art = ui_nav ? '' : '';
          var art_fallback = false;
          if (ui_nav) art = '';
          else if (episode && episode.still_path) art = Lampa.TMDB.image('t/p/w300' + episode.still_path);
          else if (!serial && object.movie.backdrop_path && object.movie.backdrop_path !== 'undefined') art = Lampa.TMDB.image('t/p/w300' + object.movie.backdrop_path);
          else {
            art = _this.uiFallbackArt();
            art_fallback = true;
          }
          if (art) {
            if (art_fallback) thumb.addClass('nova-card__thumb--fallback');
            var img = html.find('img')[0];
            img.onload = function() {
              thumb.addClass('nova-card__thumb--loaded');
            };
            img.onerror = function() {
              thumb.removeClass('nova-card__thumb--fallback');
            };
            img.src = art;
            images.push(img);
            if (!art_fallback) element.thumbnail = art;
          }

          if (!ui_nav && NovaUI.isSeen(element)) {
            if (serial) focus_mark = html;
            addViewed();
          }

          if (!serial) {
            if (choice.movie_view == hash_behold) focus_element = html;
          } else if (typeof episode_last !== 'undefined' && episode_last == episode_num) {
            focus_element = html;
          }

          html.on('hover:enter', function() {

            if (ui_nav) {
              if (!element.url) return;
              ui_focus = '';
              _this.uiLoading();
              _this.request(element.url);
              return;
            }
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            if (params.onEnter) params.onEnter(element, html, data);
          }).on('hover:focus', function(e) {
            last = e.target;
            if (!ui_nav) ui_keep = 'item:' + index;
            if (params.onFocus) params.onFocus(element, html, data);
            scroll.update($(e.target), true);
          });

          if (!ui_nav) _this.contextMenu({
            html: html,
            element: element,
            onFile: function onFile(call) {
              if (params.onContextMenu) params.onContextMenu(element, html, data, call);
            },
            onClearAllMark: function onClearAllMark() {
              items.forEach(function(elem) {
                elem.unmark();
              });
            },
            onClearAllTime: function onClearAllTime() {
              items.forEach(function(elem) {
                elem.timeclear();
              });
            }
          });

          list.append(html);
        });

        if (serial && episodes.length > items.length && !params.similars) {
          episodes.slice(items.length).forEach(function(episode) {
            var meta = [];
            if (episode.vote_average) meta.push('★ ' + parseFloat(episode.vote_average + '').toFixed(1));
            if (episode.air_date) meta.push(Lampa.Utils.parseTime(episode.air_date).full);
            var air = new Date((episode.air_date + '').replace(/-/g, '/'));
            var days = Math.round((air.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
            var html = $('<div class="nova-card nova-card--soon">' +
              '<div class="nova-card__thumb"><img alt=""><div class="nova-card__num"></div></div>' +
              '<div class="nova-card__body"><div class="nova-card__title"></div><div class="nova-card__meta"></div></div>' +
              '<div class="nova-card__side"><div class="nova-card__time"></div></div>' +
              '</div>');
            html.find('.nova-card__num').text(NovaUI.episodeNumber(episode.episode_number));
            var soon_thumb = html.find('.nova-card__thumb');
            var soon_art = episode.still_path ? Lampa.TMDB.image('t/p/w300' + episode.still_path) : _this.uiFallbackArt();
            if (soon_art) {
              if (!episode.still_path) soon_thumb.addClass('nova-card__thumb--fallback');
              var soon_img = html.find('img')[0];
              soon_img.onload = function() {
                soon_thumb.addClass('nova-card__thumb--loaded');
              };
              soon_img.onerror = function() {
                soon_thumb.removeClass('nova-card__thumb--fallback');
              };
              soon_img.src = soon_art;
              images.push(soon_img);
            }
            html.find('.nova-card__title').text(episode.name || '');
            html.find('.nova-card__meta').html(meta.map(function(part) {
              return '<span>' + NovaUI.esc(part) + '</span>';
            }).join('<span class="nova-dot">●</span>'));
            if (days > 0) html.find('.nova-card__time').text(Lampa.Lang.translate('full_episode_days_left') + ': ' + days);
            list.append(html);
          });
        }

        var hero_button = _this.uiHero(items);
        _this.uiRows();

        var fallback = false;

        if (ui_page_focus >= 0) {
          var wanted = items[ui_page_focus];
          if (wanted && wanted.__html && wanted.__html.length) fallback = wanted.__html[0];
          ui_page_focus = -1;
        }
        if (!fallback && hero_button && hero_button.length && Lampa.Storage.get('lampac_continue_play', true) !== false) fallback = hero_button[0];
        if (!fallback) fallback = (focus_element || focus_mark || false);
        if (fallback && fallback.jquery) fallback = fallback[0];
        if (!fallback) fallback = list.find('.nova-card')[0];
        _this.uiFocusRestore(fallback);

        _this.loading(false);
        Lampa.Controller.enable('content');

        if (object.lampac_continue_episode) {
          var target_ep = object.lampac_continue_episode;
          delete object.lampac_continue_episode;
          var target_item = arrFind(items, function(el) {
            return el.episode == target_ep;
          });
          if (target_item && target_item.__html) {
            setTimeout(function() {
              last = target_item.__html[0];
              scroll.update(target_item.__html, true);
              target_item.__html.trigger('hover:enter');
            }, 300);
          }
        }
      });
    };

    this.timelineSet = function(item, percent) {
      if (!item) return;
      var line = item.timeline;
      if (!line) {
        if (!item.hash_timeline) return;
        line = Lampa.Timeline.view(item.hash_timeline);
        item.timeline = line;
      }
      if (!line) return;
      var duration = parseInt(line.duration, 10) || 0;
      if (percent >= 100) {
        if (!duration) duration = 100;
        line.duration = duration;
        line.time = duration;
        line.percent = 100;
      } else {
        line.time = 0;
        line.duration = 0;
        line.percent = 0;
      }
      Lampa.Timeline.update(line);
    };

    this.markUpTo = function(element) {
      if (!element) return;
      var upto = parseInt(element.episode, 10) || 0;
      if (!upto) return;
      var viewed = Lampa.Storage.cache('online_view', 5000, []);
      var changed = false;
      for (var i = 0; i < ui_items.length; i++) {
        var item = ui_items[i];
        var num = parseInt(item.episode, 10) || 0;
        if (!num) continue;
        if (num <= upto) {
          if (item.hash_behold && viewed.indexOf(item.hash_behold) === -1) {
            viewed.push(item.hash_behold);
            changed = true;
          }
          this.timelineSet(item, 100);
        } else {
          if (item.hash_behold && viewed.indexOf(item.hash_behold) !== -1) {
            Lampa.Arrays.remove(viewed, item.hash_behold);
            Lampa.Storage.remove('online_view', item.hash_behold);
            changed = true;
          }
          this.timelineSet(item, 0);
        }
      }
      if (changed) Lampa.Storage.set('online_view', viewed);
      this.uiRefreshMarks();
    };

    this.uiRefreshMarks = function() {
      if (!modern || !ui.list || !ui_items.length) return;
      var viewed = Lampa.Storage.cache('online_view', 5000, []);
      ui_items.forEach(function(element) {
        var html = element.__html;
        if (!html || !html.length) return;
        if (element.hash_timeline) element.timeline = Lampa.Timeline.view(element.hash_timeline);
        var line = element.timeline;
        var box = html.find('.nova-card__line');
        if (box.length && line) box.empty().append(Lampa.Timeline.render(line));
        if (element.__meta_base) {
          var meta = element.__meta_base.slice();
          if (line && line.percent > 0 && line.duration > line.time) {
            meta.push(Lampa.Lang.translate('nova_left') + ' ' + Lampa.Utils.secondsToTime(line.duration - line.time, true));
          }
          html.find('.nova-card__meta').html(meta.map(function(part) {
            return '<span>' + NovaUI.esc(part) + '</span>';
          }).join('<span class="nova-dot">\u25cf</span>'));
        }
        if (NovaUI.isSeen(element)) {
          if (ui_grid) {
            var thumb = html.find('.nova-card__thumb');
            if (thumb.length && !thumb.find('.nova-card__viewed').length) {
              thumb.append('<div class="nova-card__viewed">' + NovaUI.icon.eye + '</div>');
            }
          } else {
            var side = html.find('.nova-card__side');
            if (side.length && !side.find('.nova-card__eye').length) {
              side.append('<div class="nova-card__eye">' + NovaUI.icon.eye + '</div>');
            }
          }
        }
      });
      var keep = last;
      this.uiHero(ui_items);
      if (this.uiAlive(keep)) {
        last = keep;
        try {
          var now = Lampa.Controller.enabled();
          if (now && now.name === 'content') Lampa.Controller.collectionFocus(keep, scroll.render());
        } catch (e) {}
      }
    };

    this.uiSimilars = function(json, manual) {
      var _this = this;
      var rank = NovaUI.rankSimilars(json, object.movie);
      var auto_enabled = Lampa.Storage.get('nova_similar_auto', true) !== false;

      if (!manual && !similar_auto && auto_enabled && rank.sure) {
        similar_list = json;
        similar_auto = true;
        ui_focus = '';
        this.uiLoading();
        return this.request(rank.best.elem.url);
      }
      similar_list = json;
      similar_shown = true;
      this.uiFrame();
      this.uiLoadingStop();
      this.uiWatchStop();
      var list = ui.list.empty();
      rank.list.forEach(function(row) {
        var elem = row.elem;
        var info = [];
        var year = ((elem.start_date || elem.year || object.movie.release_date || object.movie.first_air_date || '') + '').slice(0, 4);
        if (year) info.push(year);
        if (elem.details) info.push(elem.details);
        var html = $('<div class="nova-card nova-card--file selector">' +
          '<div class="nova-card__thumb"><img alt=""></div>' +
          '<div class="nova-card__body"><div class="nova-card__title"></div><div class="nova-card__meta"></div></div>' +
          '</div>');
        html.find('.nova-card__title').text(elem.title || elem.text || '');
        html.find('.nova-card__meta').html(info.map(function(part) {
          return '<span>' + NovaUI.esc(part) + '</span>';
        }).join('<span class="nova-dot">●</span>'));
        if (rank.likely && row === rank.best) {
          html.addClass('nova-card--match');
          html.find('.nova-card__body').append($('<div class="nova-card__match"></div>')
            .text(Lampa.Lang.translate('nova_similar_best')));
        }
        if (elem.img) {
          var art = elem.img;
          if (art.charAt(0) === '/') art = (last_origin || Defined.localhost) + art.substring(1);
          if (art.indexOf('/proxyimg') !== -1) art = account(art);
          var thumb = html.find('.nova-card__thumb');
          var img = html.find('img')[0];
          img.onload = function() {
            thumb.addClass('nova-card__thumb--loaded');
          };
          img.onerror = function() {};
          img.src = art;
          images.push(img);
        }
        html.on('hover:enter', function() {
          ui_focus = '';
          _this.uiLoading();
          _this.request(elem.url);
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        list.append(html);
      });
      ui.hero_box.empty();
      ui.hero = null;
      this.uiRows();
      this.filter({
        season: filter_find.season.map(function(s) {
          return s.title;
        }),
        voice: filter_find.voice.map(function(b) {
          return b.title;
        })
      }, this.getChoice());
      this.loading(false);
      last = list.find('.nova-card')[0] || false;
      Lampa.Controller.enable('content');
    };

    this.initialize = function() {
      var _this = this;
      this.loading(true);
      filter.onSearch = function(value) {

		clarificationSearchAdd(value);

        Lampa.Activity.replace({
          search: value,
          clarification: true,
          similar: true
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
        if (type == 'filter') {
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
              Lampa.Activity.replace({
				  clarification: 0,
				  similar: 0
			  });
            }, 10);
          } else {
            var url = filter_find[a.stype][b.index].url;
            var choice = _this.getChoice();
            if (a.stype == 'season') _this.seasonMemory(NovaUI.seasonNumber(filter_find.season[b.index].title));
            if (a.stype == 'voice') {
              choice.voice_name = filter_find.voice[b.index].title;
              choice.voice_url = url;
            }
            choice[a.stype] = b.index;
            _this.saveChoice(choice);
            _this.reset();
            _this.request(url);
            setTimeout(Lampa.Select.close, 10);
          }
        } else if (type == 'sort') {
          Lampa.Select.close();
          _this.switchSource(a.source);
        }
      };
      if (filter.addButtonBack) filter.addButtonBack();
      filter.render().find('.filter--sort span').text(Lampa.Lang.translate('lampac_balanser'));
      scroll.body().addClass('torrent-list');
      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.minus(files.render().find('.explorer__files-head'));
      if (modern) {

        files.render().addClass('nova-scope');
        files.render().find('.explorer__files-head').addClass('nova-hidden-head').css('display', 'none');
        scroll.minus(files.render().find('.explorer__files-head'));
        this.uiLoadingPanel();
      } else {
        scroll.body().append(Lampa.Template.get('lampac_content_loading'));
      }
      Lampa.Controller.enable('content');
      this.loading(false);
	  if(object.balanser){
		  files.render().find('.filter--search').remove();
		  sources = {};
		  sources[object.balanser] = {name: object.balanser};
		  balanser = object.balanser;
		  filter_sources = [];

		  return network["native"](account(object.url.replace('rjson=','nojson=')), this.parse.bind(this), function(){
			  files.render().find('.torrent-filter').remove();
			  _this.empty();
		  }, false, {
            dataType: 'text',
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
		  });
	  }
      var server_tries = 0;
      var askServer = function() {
        return _this.createSource().then(function(json) {
          if (!arrFind(balansers_with_search, function(b) {
              return balanser.slice(0, b.length) == b;
            })) {
            filter.render().find('.filter--search').addClass('hide');
          }
          _this.search();
        })["catch"](function(e) {

          var other = NovaUI.networkFail(e) && server_tries < serverPool.length - 1 ? nextServerUrl(Defined.localhost) : '';
          if (other) {
            server_tries++;
            Defined.localhost = serverBase(other);
            randomUrl = Defined.localhost;
            return askServer();
          }
          _this.noConnectToServer(e);
        });
      };
      pingReady.then(function() {
        return _this.externalids();
      }).then(askServer);
    };
    this.rch = function(json, noreset) {
      var _this2 = this;
	  rchRun(json, function() {
        if (!noreset) _this2.find();
        else noreset();
	  });
    };
    this.externalids = function() {
      return new Promise(function(resolve, reject) {
        if (!object.movie.imdb_id || !object.movie.kinopoisk_id) {
          var query = [];
          query.push('id=' + encodeURIComponent(object.movie.id));
          query.push('serial=' + (object.movie.name ? 1 : 0));
          if (object.movie.imdb_id) query.push('imdb_id=' + (object.movie.imdb_id || ''));
          if (object.movie.kinopoisk_id) query.push('kinopoisk_id=' + (object.movie.kinopoisk_id || ''));
          var url = Defined.localhost + 'externalids?' + query.join('&');
          network.timeout(10000);
          network.silent(account(url), function(json) {
            for (var name in json) {
              object.movie[name] = json[name];
            }
            resolve();
          }, function() {
            resolve();
          }, false, {
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
		  });
        } else resolve();
      });
    };
    this.updateBalanser = function(balanser_name) {
      var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
      last_select_balanser[object.movie.id] = balanser_name;
      Lampa.Storage.set('online_last_balanser', last_select_balanser);
    };
    this.changeBalanser = function(balanser_name) {
      this.updateBalanser(balanser_name);
      Lampa.Storage.set('online_balanser', balanser_name);
      var to = this.getChoice(balanser_name);
      var from = this.getChoice();
      if (from.voice_name) to.voice_name = from.voice_name;
      this.saveChoice(to, balanser_name);
      Lampa.Activity.replace();
    };
    this.requestParams = function(url) {
      var query = [];
      var card_source = object.movie.source || 'tmdb';
      query.push('id=' + encodeURIComponent(object.movie.id));
      if (object.movie.imdb_id) query.push('imdb_id=' + (object.movie.imdb_id || ''));
      if (object.movie.kinopoisk_id) query.push('kinopoisk_id=' + (object.movie.kinopoisk_id || ''));
	  if (object.movie.tmdb_id) query.push('tmdb_id=' + (object.movie.tmdb_id || ''));
      query.push('title=' + encodeURIComponent(object.clarification ? object.search : object.movie.title || object.movie.name));
      query.push('original_title=' + encodeURIComponent(object.movie.original_title || object.movie.original_name));
      query.push('serial=' + (object.movie.name ? 1 : 0));
      query.push('original_language=' + (object.movie.original_language || ''));
      query.push('year=' + ((object.movie.release_date || object.movie.first_air_date || '0000') + '').slice(0, 4));
      query.push('source=' + card_source);
      query.push('clarification=' + (object.clarification ? 1 : 0));
      query.push('similar=' + (object.similar ? true : false));
      query.push('rchtype=' + (((window.rch_nws && window.rch_nws[hostkey]) ? window.rch_nws[hostkey].type : (window.rch && window.rch[hostkey]) ? window.rch[hostkey].type : '') || ''));
      if (Lampa.Storage.get('account_email', '')) query.push('cub_id=' + Lampa.Utils.hash(Lampa.Storage.get('account_email', '')));
      return url + (url.indexOf('?') >= 0 ? '&' : '?') + query.join('&');
    };
    this.getLastChoiceBalanser = function() {
      var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
      if (last_select_balanser[object.movie.id]) {
        return last_select_balanser[object.movie.id];
      } else {
        return Lampa.Storage.get('online_balanser', filter_sources.length ? filter_sources[0] : '');
      }
    };

    var acceptSource = function(key, title) {
      if (!object.movie.name) return true;
      return !NovaUI.isMovieOnlySource(key, title);
    };

    var shownSource = function(name) {
      var info = sources[name];
      return !!(info && info.show);
    };

    var firstShownSource = function() {
      var keys = Object.prototype.toString.call(filter_sources) === '[object Array]' ? filter_sources : [];
      for (var i = 0; i < keys.length; i++) {
        if (shownSource(keys[i])) return keys[i];
      }
      return keys[0] || '';
    };

    var startBalanser = function() {
      var pinned_map = Lampa.Storage.cache('online_last_balanser', 3000, {});
      var pinned = object.lampac_custom_select || pinned_map[object.movie.id] || '';
      if (pinned && sources[pinned]) return pinned;

      var global = Lampa.Storage.get('online_balanser', '');
      if (global && shownSource(global)) return global;

      var shown = firstShownSource();
      if (shown) return shown;
      if (global && sources[global]) return global;
      return filter_sources[0] || '';
    };

    this.startSource = function(json) {

      var _self_src = this && this.sourcesCacheSave ? this : null;
      return new Promise(function(resolve, reject) {
        json.forEach(function(j) {
          var name = balanserName(j);
          if (!acceptSource(name, j.name)) return;
          sources[name] = {
            url: j.url,
            name: j.name,
            show: typeof j.show == 'undefined' ? true : j.show
          };
        });
        filter_sources = sortSourcesByQuality(Lampa.Arrays.getKeys(sources), sources);
        if (_self_src) _self_src.sourcesCacheSave(filter_sources.map(function(key) {
          return {
            key: key,
            url: sources[key].url,
            name: sources[key].name,
            show: sources[key].show
          };
        }));
        if (filter_sources.length) {
          balanser = startBalanser();
          if (!sources[balanser]) balanser = filter_sources[0];
          source = sources[balanser].url;
          Lampa.Storage.set('active_balanser', balanser);
          if (_self_src) _self_src.sourcesLive();
          resolve(json);
        } else {
          reject();
        }
      });
    };
    this.lifeSource = function() {
      var _this3 = this;
      return new Promise(function(resolve, reject) {
        var url = _this3.requestParams(Defined.localhost + 'lifeevents?memkey=' + (_this3.memkey || ''));
        var red = false;
        var gou = function gou(json, any) {
          if (json.accsdb || NovaUI.serverDenial(json)) {
            if (rotateToNextAccount()) {
              url = _this3.requestParams(Defined.localhost + 'lifeevents?memkey=' + (_this3.memkey || ''));
              life_wait_timer = setTimeout(fin, 300);
              return;
            }
            return reject(json);
          }
          var last_balanser = _this3.getLastChoiceBalanser();
          if (!red) {
            var _filter = json.online.filter(function(c) {
              return any ? c.show : c.show && c.name.toLowerCase() == last_balanser;
            });
            if (_filter.length) {
              red = true;
              resolve(json.online.filter(function(c) {
                return c.show;
              }));
            } else if (any) {
              reject();
            }
          }
        };
        var lifeStep = function() {
          return life_wait_times < 4 ? 550 : 1000;
        };
        var lifeOver = function() {
          return life_wait_times > 15 || Date.now() - life_started > 26000;
        };
        var life_sign = '';

        var lifeSign = function() {
          var cached = {};
          try { cached = _this3.probeCache().list || {}; } catch (e) {}
          var out = [];
          sourceKeys().forEach(function(name) {
            var info = sources[name] || {};
            out.push(name + '~' + (info.show ? 1 : 0) + '~' + ((cached[name] || {}).s || ''));
          });
          return out.join('|') + '#' + balanser + '#' + (life_done ? 1 : 0) + '#' + (ui_all_sources ? 1 : 0);
        };

        var lifeRedraw = function() {
          if (!modern || !ui.rows || ui_open != 'source') return;
          try {
            // доопрос источников идёт раз в ~0.5-1 с. Если список не менялся — не трогаем
            // DOM вообще, иначе фокус уезжает прямо под руками.
            var sign = lifeSign();
            if (sign === life_sign) return;
            life_sign = sign;

            var keep = last && last.getAttribute ? (last.getAttribute('data-nova-focus') || '') : '';
            _this3.uiRows();
            if (keep) ui_focus = keep;
            _this3.uiFocusRestore(false);
            // когда life_done стал true или источник оказался пустым, его чип исчезает.
            // Старый last остаётся оторванным от DOM — именно так умирала навигация.
            if (!_this3.uiAlive(last)) {
              var back = _this3.uiDropEntry() || _this3.uiDropOwner();
              if (!back && ui.rows) back = ui.rows.find('.selector')[0] || false;
              if (!back && ui.play) back = ui.play[0] || false;
              last = back || null;
              ui_focus = last && last.getAttribute ? (last.getAttribute('data-nova-focus') || '') : '';
            }
            // коллекцию Navigator надо пересобрать после uiRows(), иначе она держит
            // удалённые узлы и кнопки перестают работать (как в uiToggle).
            if (last) Lampa.Controller.enable('content');
          } catch (e) {}
        };
        var lifeFinish = function() {
          life_done = true;
          clearTimeout(life_wait_timer);
          life_wait_timer = null;
          filter.render().find('.lampac-balanser-loader').remove();
          lifeRedraw();
        };
        var fin = function fin(call) {
          if (!life_started) life_started = Date.now();
          network.timeout(3000);
          network.silent(account(url), function(json) {
            life_wait_times++;

            json.online.forEach(function(j) {
              var name = balanserName(j);
              if (!acceptSource(name, j.name)) return;
              sources[name] = {
                url: j.url,
                name: j.name,
                show: typeof j.show == 'undefined' ? true : j.show
              };
            });
            filter_sources = sortSourcesByQuality(Lampa.Arrays.getKeys(sources), sources);
            filter.set('sort', filter_sources.map(function(e) {
              return {
                title: sources[e].name,
                source: e,
                selected: e == balanser,
                ghost: !sources[e].show
              };
            }));
            filter.chosen('sort', [sources[balanser] ? sources[balanser].name : balanser]);
            _this3.uiLoadingProgress(json, life_wait_times);
            if (red) lifeRedraw();
            gou(json);
            var lastb = _this3.getLastChoiceBalanser();
            if (lifeOver() || json.ready) {
              gou(json, true);
              lifeFinish();
            } else if (!red && sources[lastb] && sources[lastb].show) {
              gou(json, true);
              life_wait_timer = setTimeout(fin, lifeStep());
            } else {
              life_wait_timer = setTimeout(fin, lifeStep());
            }
          }, function() {
            life_wait_times++;
            if (lifeOver()) {
              life_done = true;
              reject();
            } else {
              life_wait_timer = setTimeout(fin, lifeStep());
            }
          }, false, {
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
		  });
        };
        fin();
      });
    };
    this.createSource = function() {
      var _this4 = this;
      resetAccountRotation();
      if (accountAuto()) applyAccountIndex();
      return new Promise(function(resolve, reject) {
        function tryWithAccount() {
          var url = _this4.requestParams(Defined.localhost + 'lite/events?life=true');
          network.timeout(15000);
          network.silent(account(url), function(json) {
            if (json.accsdb || NovaUI.serverDenial(json)) {
              if (rotateToNextAccount()) {
                tryWithAccount();
              } else {
                reject(json);
              }
              return;
            }
            markAccountAlive(SERVER_CONFIG.pool.currentIndex);
            resetAccountRotation();
            if (json.life) {
              _this4.memkey = json.memkey;
              if (json.title) {
                if (object.movie.name) object.movie.name = json.title;
                if (object.movie.title) object.movie.title = json.title;
              }
              filter.render().find('.filter--sort').append('<span class="lampac-balanser-loader" style="width: 1.2em; height: 1.2em; margin-top: 0; background: url(./img/loader.svg) no-repeat 50% 50%; background-size: contain; margin-left: 0.5em"></span>');
              _this4.lifeSource().then(function(json_life) {
                return _this4.startSource(json_life);
              }).then(resolve)["catch"](reject);
            } else {
              life_done = true;
              _this4.startSource(json).then(resolve)["catch"](reject);
            }
          }, function(err) {
            if (rotateToNextAccount(true)) {
              tryWithAccount();
            } else {
              reject(err);
            }
          }, false, {
            headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
          });
        }
        tryWithAccount();
      });
    };

    this.create = function() {
      return this.render();
    };

    this.search = function() {
      this.filter({
        source: filter_sources
      }, this.getChoice());
      this.find();
    };
    this.find = function() {
      this.request(this.requestParams(source));
    };
    this.request = function(url) {
      var _this = this;

      var origin = String(url).match(/^(https?:\/\/[^\/]+)\//);
      if (origin) last_origin = origin[1] + '/';
      var cached = online_results_cache[url];
      if (cached && (Date.now() - cached.time) < ONLINE_CACHE_TTL) {

        ++request_gen;
        this.uiWatchStop();
        return this.parse(cached.text);
      }
      number_of_requests++;
      if (number_of_requests < 10) {
        this.uiWatch();

        var gen = ++request_gen;
        var done = function(str) {
          if (gen !== request_gen) return;
          if (typeof str === 'string' && str.indexOf('videos__') !== -1) {
            online_results_cache[url] = { time: Date.now(), text: str };
          }
          _this.parse(str);
        };

        var send = function(target, retry_left) {
          var target_origin = serverBase(target);
          if (target_origin) last_origin = target_origin;
          network.timeout(NovaUI.REQUEST_TIMEOUT);
          network["native"](account(target), done, function(er) {
            if (gen !== request_gen) return;
            var other = retry_left > 0 && NovaUI.networkFail(er) ? nextServerUrl(target) : '';
            if (other) return send(other, retry_left - 1);
            _this.doesNotAnswer(er);
          }, false, {
            dataType: 'text',
            headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
          });
        };
        send(url, 1);
        clearTimeout(number_of_requests_timer);
        number_of_requests_timer = setTimeout(function() {
          number_of_requests = 0;
        }, 4000);
      } else this.empty();
    };
    this.parseJsonDate = function(str, name) {
      try {
        var html = $('<div>' + str + '</div>');
        var elems = [];
        html.find(name).each(function() {
          var item = $(this);
          var data = JSON.parse(item.attr('data-json'));
          var season = item.attr('s');
          var episode = item.attr('e');
          var text = item.text();
          if (!object.movie.name) {
            if (text.match(/\d+p/i)) {
              if (!data.quality) {
                data.quality = {};
                data.quality[text] = data.url;
              }
              text = object.movie.title;
            }
            if (text == 'По умолчанию') {
              text = object.movie.title;
            }
          }
          if (episode) data.episode = parseInt(episode);
          if (season) data.season = parseInt(season);
          if (text) data.text = text;
          data.active = item.hasClass('active');
          elems.push(data);
        });
        return elems;
      } catch (e) {
        return [];
      }
    };
    this.getFileUrl = function(file, call, waiting_rch) {
	  var _this = this;

      if(Lampa.Storage.field('player') !== 'inner' && file.stream && Lampa.Platform.is('apple')){
		  var newfile = Lampa.Arrays.clone(file);
		  newfile.method = 'play';
		  newfile.url = file.stream;
		  call(newfile, {});
	  }
      else if (file.method == 'play') call(file, {});
      else {
        var pc = file.url ? fileurl_cache[file.url] : null;
        if (pc && (Date.now() - pc.time) < FILEURL_TTL) { call(pc.json, pc.json); return; }
        Lampa.Loading.start(function() {
          Lampa.Loading.stop();
          Lampa.Controller.toggle('content');
          network.clear();
        });
        network.timeout(NovaUI.REQUEST_TIMEOUT);
        network["native"](account(file.url), function(json) {
			if(json.rch){
				if(waiting_rch) {
					waiting_rch = false;
					Lampa.Loading.stop();
					call(false, {});
				}
				else {
					_this.rch(json,function(){
						Lampa.Loading.stop();

						_this.getFileUrl(file, call, true);
					});
				}
			}
			else{
				Lampa.Loading.stop();
				if (file.url && json && !json.rch) fileurl_cache[file.url] = { time: Date.now(), json: json };
				call(json, json);
			}
        }, function() {
          Lampa.Loading.stop();
          call(false, {});
        }, false, {
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
            });
      }
    };
    this.prefetchFileUrl = function(file) {
      if (prefetch_timer) { clearTimeout(prefetch_timer); prefetch_timer = null; }

      if (balanser == 'alloha') return;
      if (!file || !file.url || file.method == 'play') return;
      if (Lampa.Platform.is('apple') && file.stream) return;
      var url = file.url;
      var c = fileurl_cache[url];
      if (c && (Date.now() - c.time) < FILEURL_TTL) return;
      if (fileurl_prefetching[url]) return;
      prefetch_timer = setTimeout(function() {
        prefetch_timer = null;
        if (fileurl_prefetching[url]) return;
        var c2 = fileurl_cache[url];
        if (c2 && (Date.now() - c2.time) < FILEURL_TTL) return;
        fileurl_prefetching[url] = true;
        if (!prefetch_network) prefetch_network = new Network();
        prefetch_network.silent(account(url), function(json) {
          delete fileurl_prefetching[url];
          if (json && !json.rch) fileurl_cache[url] = { time: Date.now(), json: json };
        }, function() {
          delete fileurl_prefetching[url];
        }, false, {
          headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
        });
      }, 350);
    };
    this.toPlayElement = function(file) {
      var play = {
        title: file.title,
        url: file.url,
        quality: file.qualitys,
        timeline: file.timeline,
        subtitles: file.subtitles,
		segments: file.segments,
        callback: file.mark,
		season: file.season,
		episode: file.episode,
		voice_name: file.voice_name,
		thumbnail: file.thumbnail
      };
      return play;
    };
    this.orUrlReserve = function(data) {
      if (data.url && typeof data.url == 'string' && data.url.indexOf(" or ") !== -1) {
        var urls = data.url.split(" or ");
        data.url = urls[0];
        data.url_reserve = urls[1];
      }
    };
    this.setDefaultQuality = function(data) {
      if (Lampa.Arrays.getKeys(data.quality).length) {
        for (var q in data.quality) {
          if (parseInt(q) == Lampa.Storage.field('video_quality_default')) {
            data.url = data.quality[q];
            this.orUrlReserve(data);
          }
          if (data.quality[q].indexOf(" or ") !== -1)
            data.quality[q] = data.quality[q].split(" or ")[0];
        }

        var want = parseInt(Lampa.Storage.get('nova_quality', 'auto'), 10);
        if (want) {
          var best = 0;
          var best_url = '';
          for (var key in data.quality) {
            var value = parseInt(key, 10) || 0;
            if (!value || value > want || value <= best) continue;
            best = value;
            best_url = data.quality[key];
          }
          if (best_url) {
            data.url = best_url;
            this.orUrlReserve(data);
          }
        }
      }
    };
    this.display = function(videos) {
      var _this5 = this;
      this.draw(videos, {
        onEnter: function onEnter(item, html) {
          _this5.getFileUrl(item, function(json, json_call) {
            if (json && json.url) {
              var playlist = [];
              var first = _this5.toPlayElement(item);
              first.url = json.url;
              first.headers = json_call.headers || json.headers;
              first.quality = json_call.quality || item.qualitys;
			  first.segments = json_call.segments || item.segments;
              first.hls_manifest_timeout = json_call.hls_manifest_timeout || json.hls_manifest_timeout;
              first.subtitles = json.subtitles;
			  first.subtitles_call = json_call.subtitles_call || json.subtitles_call;
              _this5.orUrlReserve(first);
              _this5.setDefaultQuality(first);
              if (item.season) {
                videos.forEach(function(elem) {
                  if (elem == item) { playlist.push(first); return; }
                  var cell = _this5.toPlayElement(elem);
                  {
                    if (elem.method == 'call') {
                      if (Lampa.Storage.field('player') !== 'inner') {
                        cell.url = elem.stream;
						delete cell.quality;
                      } else {
                        cell.url = function(call) {
                          _this5.getFileUrl(elem, function(stream, stream_json) {
                            if (stream.url) {
                              cell.url = stream.url;
                              cell.quality = stream_json.quality || elem.qualitys;
							  cell.segments = stream_json.segments || elem.segments;
                              cell.subtitles = stream.subtitles;
                              _this5.orUrlReserve(cell);
                              _this5.setDefaultQuality(cell);
                              elem.mark();
                            } else {
                              cell.url = '';
                              Lampa.Noty.show(Lampa.Lang.translate('lampac_nolink'));
                            }
                            call();
                          }, function() {
                            cell.url = '';
                            call();
                          });
                        };
                      }
                    } else {
                      cell.url = elem.url;
                    }
                  }
                  _this5.orUrlReserve(cell);
                  _this5.setDefaultQuality(cell);
                  _markMedia(cell, true);
                  playlist.push(cell);
                });
              } else {
                playlist.push(first);
              }
              if (first.url) {
                var element = first;
				_markMedia(element, !!item.season);
                if (playlist.length > 1) {

                  var extlist = playlist.slice();
                  var _fi = extlist.indexOf(first);
                  if (_fi !== -1) {
                    var firstClone = {};
                    for (var _k in first) { if (first.hasOwnProperty(_k) && _k !== 'playlist') firstClone[_k] = first[_k]; }
                    extlist[_fi] = firstClone;
                  }
                  first.playlist = extlist;
                }
                _installSeriesRewindFix();
                Lampa.Player.playlist(playlist);
                Lampa.Player.play(element);
				if(element.subtitles_call) _this5.loadSubtitles(element.subtitles_call)
                item.mark();
                _this5.updateBalanser(balanser);
                Lampa.Storage.set('online_balanser', balanser);
              } else {
                Lampa.Noty.show(Lampa.Lang.translate('lampac_nolink'));
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('lampac_nolink'));
          }, true);
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          _this5.getFileUrl(item, function(stream) {
            call({
              file: stream.url,
              quality: item.qualitys
            });
          }, true);
        }
      });
      this.filter({
        season: filter_find.season.map(function(s) {
          return s.title;
        }),
        voice: filter_find.voice.map(function(b) {
          return b.title;
        })
      }, this.getChoice());
    };
	this.loadSubtitles = function(link){
		network.silent(account(link), function(subs){
			Lampa.Player.subtitles(subs)
		}, function() {},false, {
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
		  })
	}
    this.parse = function(str) {
      var json = Lampa.Arrays.decodeJson(str, {});
      if (Lampa.Arrays.isObject(str) && str.rch) json = str;
      if (json.rch) return this.rch(json);
      try {
        var items = this.parseJsonDate(str, '.videos__item');
        var buttons = this.parseJsonDate(str, '.videos__button');

        var season_buttons = buttons.filter(function(b) {
          return NovaUI.isSeasonLabel(b.text);
        });
        if (season_buttons.length > 1) {
          filter_find.season = season_buttons.map(function(b) {
            return {
              title: b.text,
              url: b.url
            };
          });
          var active_season = arrFind(season_buttons, function(b) {
            return b.active;
          });
          if (active_season) {
            this.replaceChoice({
              season: season_buttons.indexOf(active_season)
            });
          }
          buttons = buttons.filter(function(b) {
            return !NovaUI.isSeasonLabel(b.text);
          });
          if (!season_pinned) {

            season_pinned = true;
            var wanted_season = this.seasonIndexByMemory();
            if (wanted_season >= 0 && season_buttons[wanted_season] && !season_buttons[wanted_season].active) {
              this.replaceChoice({
                season: wanted_season
              });
              return this.request(season_buttons[wanted_season].url);
            }
          }
        }
        if (items.length == 1 && items[0].method == 'link' && !items[0].similar) {

          if (filter_find.season.length < 2) {
            filter_find.season = items.map(function(s) {
              return {
                title: s.text,
                url: s.url
              };
            });
            this.replaceChoice({
              season: 0
            });
          }
          this.request(items[0].url);
        } else {
          this.activity.loader(false);
          var videos = items.filter(function(v) {
            return v.method == 'play' || v.method == 'call';
          });
          var similar = items.filter(function(v) {
            return v.similar;
          });
          if (videos.length) {
            if (buttons.length) {
              filter_find.voice = buttons.map(function(b) {
                return {
                  title: b.text,
                  url: b.url
                };
              });
              var select_voice_url = this.getChoice(balanser).voice_url;
              var select_voice_name = this.getChoice(balanser).voice_name;
              var find_voice_url = arrFind(buttons, function(v) {
                return v.url == select_voice_url;
              });
              var find_voice_name = arrFind(buttons, function(v) {
                return v.text == select_voice_name;
              });
              var find_voice_active = arrFind(buttons, function(v) {
                return v.active;
              });

              var pref_kind = Lampa.Storage.get('nova_voice_pref', '');
              var find_voice_pref = false;
              if (modern && pref_kind && !select_voice_url && !select_voice_name && Lampa.Storage.get('nova_voice_auto', true) !== false) {
                find_voice_pref = arrFind(buttons, function(v) {
                  return NovaUI.voiceKind(v.text) == pref_kind;
                });
              }

              if (find_voice_url && !find_voice_url.active) {

                this.replaceChoice({
                  voice: buttons.indexOf(find_voice_url),
                  voice_name: find_voice_url.text
                });
                this.request(find_voice_url.url);
              } else if (find_voice_name && !find_voice_name.active) {

                this.replaceChoice({
                  voice: buttons.indexOf(find_voice_name),
                  voice_name: find_voice_name.text
                });
                this.request(find_voice_name.url);
              } else if (find_voice_pref && !find_voice_pref.active) {
                this.replaceChoice({
                  voice: buttons.indexOf(find_voice_pref),
                  voice_name: find_voice_pref.text
                });
                this.request(find_voice_pref.url);
              } else {
                if (find_voice_active) {
                  this.replaceChoice({
                    voice: buttons.indexOf(find_voice_active),
                    voice_name: find_voice_active.text
                  });
                }
                this.display(videos);
              }
            } else {
              this.replaceChoice({
                voice: 0,
                voice_url: '',
                voice_name: ''
              });
              this.display(videos);
            }
          } else if (items.length) {
            if (similar.length) {
              this.similars(similar);
              this.activity.loader(false);
            } else {
              filter_find.season = items.map(function(s) {
                return {
                  title: s.text,
                  url: s.url
                };
              });
              var select_season = this.getChoice(balanser).season;
              if (!season_pinned) {

                season_pinned = true;
                var remembered = this.seasonIndexByMemory();
                if (remembered >= 0 && remembered !== select_season) {
                  select_season = remembered;
                  this.replaceChoice({
                    season: remembered
                  });
                }
              }
              var season = filter_find.season[select_season];
              if (!season) season = filter_find.season[0];

              this.request(season.url);
            }
          } else {
            this.doesNotAnswer(json);
          }
        }
      } catch (e) {

        this.doesNotAnswer(e);
      }
    };
    this.similars = function(json) {
      var _this6 = this;
      if (modern) return this.uiSimilars(json);
      scroll.clear();
      json.forEach(function(elem) {
        elem.title = elem.text;
        elem.info = '';
        var info = [];
        var year = ((elem.start_date || elem.year || object.movie.release_date || object.movie.first_air_date || '') + '').slice(0, 4);
        if (year) info.push(year);
        if (elem.details) info.push(elem.details);
        var name = elem.title || elem.text;
        elem.title = name;
        elem.time = elem.time || '';
        elem.info = info.join('<span class="online-prestige-split">●</span>');
        var item = Lampa.Template.get('lampac_prestige_folder', elem);
		if (elem.img) {
		  var image = $('<img style="height: 7em; width: 7em; border-radius: 0.3em;"/>');
		  item.find('.online-prestige__folder').empty().append(image);

		  if (elem.img !== undefined) {
		    if (elem.img.charAt(0) === '/')
		      elem.img = (last_origin || Defined.localhost) + elem.img.substring(1);
		    if (elem.img.indexOf('/proxyimg') !== -1)
		      elem.img = account(elem.img);
		  }

		  Lampa.Utils.imgLoad(image, elem.img);
		}
        item.on('hover:enter', function() {
          _this6.reset();
          _this6.request(elem.url);
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        scroll.append(item);
      });
	  this.filter({
        season: filter_find.season.map(function(s) {
          return s.title;
        }),
        voice: filter_find.voice.map(function(b) {
          return b.title;
        })
      }, this.getChoice());
      Lampa.Controller.enable('content');
    };

    this.seasonMemory = function(number) {
      var all = Lampa.Storage.cache('nova_season_last', 3000, {});
      if (number === undefined) return all[object.movie.id];
      if (!number) return;
      all[object.movie.id] = number;
      Lampa.Storage.set('nova_season_last', all);
    };

    this.seasonIndexByMemory = function() {
      var wanted = this.seasonMemory();
      if (!wanted) return -1;
      var list = filter_find.season || [];
      for (var i = 0; i < list.length; i++) {
        if (NovaUI.seasonNumber(list[i].title) == wanted) return i;
      }
      return -1;
    };

    this.getChoice = function(for_balanser) {
      var data = Lampa.Storage.cache('online_choice_' + (for_balanser || balanser), 3000, {});
      var save = data[object.movie.id] || {};
      Lampa.Arrays.extend(save, {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0,
        episodes_view: {},
        movie_view: ''
      });
      return save;
    };
    this.saveChoice = function(choice, for_balanser) {
      var data = Lampa.Storage.cache('online_choice_' + (for_balanser || balanser), 3000, {});
      data[object.movie.id] = choice;
      Lampa.Storage.set('online_choice_' + (for_balanser || balanser), data);
      this.updateBalanser(for_balanser || balanser);
    };
    this.replaceChoice = function(choice, for_balanser) {
      var to = this.getChoice(for_balanser);
      Lampa.Arrays.extend(to, choice, true);
      this.saveChoice(to, for_balanser);
    };
    this.clearImages = function() {
      images.forEach(function(img) {
        img.onerror = function() {};
        img.onload = function() {};
        img.src = '';
      });
      images = [];
    };

    this.reset = function() {
      last = false;
      ui_keep = '';
      clearInterval(balanser_timer);
      network.clear();
      this.clearImages();
      if (modern && ui.root) {
        ui.list.empty().append(this.uiSkeleton(4));
        return;
      }
      scroll.render().find('.empty').remove();
      scroll.clear();
      scroll.reset();
      scroll.body().append(Lampa.Template.get('lampac_content_loading'));
    };

    this.loading = function(status) {
      if (status) this.activity.loader(true);
      else {
        this.activity.loader(false);
        this.activity.toggle();
      }
    };

    this.filter = function(filter_items, choice) {
      var _this7 = this;
      var select = [];
      var add = function add(type, title) {
        var need = _this7.getChoice();
        var items = filter_items[type];
        var subitems = [];
        var value = need[type];
        items.forEach(function(name, i) {
          subitems.push({
            title: name,
            selected: value == i,
            index: i
          });
        });
        select.push({
          title: title,
          subtitle: items[value],
          items: subitems,
          stype: type
        });
      };
      filter_items.source = filter_sources;
      select.push({
        title: Lampa.Lang.translate('torrent_parser_reset'),
        reset: true
      });
      this.saveChoice(choice);
      if (filter_items.voice && filter_items.voice.length) add('voice', Lampa.Lang.translate('torrent_parser_voice'));
      if (filter_items.season && filter_items.season.length) add('season', Lampa.Lang.translate('torrent_serial_season'));
      filter.set('filter', select);
      filter.set('sort', filter_sources.map(function(e) {
        return {
          title: sources[e].name,
          source: e,
          selected: e == balanser,
          ghost: !sources[e].show
        };
      }));
      this.selected(filter_items);
    };

    this.selected = function(filter_items) {
      var need = this.getChoice(),
        select = [];
      for (var i in need) {
        if (filter_items[i] && filter_items[i].length) {
          if (i == 'voice') {
            select.push(filter_translate[i] + ': ' + filter_items[i][need[i]]);
          } else if (i !== 'source') {
            if (filter_items.season.length >= 1) {
              select.push(filter_translate.season + ': ' + filter_items[i][need[i]]);
            }
          }
        }
      }
      filter.chosen('filter', select);
      filter.chosen('sort', [sources[balanser] ? sources[balanser].name : balanser]);
    };

    this.seasonPlannedFallback = function(season) {
      var movie = object.movie;
      if (!movie) return 0;
      var want = parseInt(season, 10);
      var list = movie.seasons;
      var i;
      if (want && list && list.length) {
        for (i = 0; i < list.length; i++) {
          if (!list[i]) continue;
          if (parseInt(list[i].season_number, 10) === want) {
            return parseInt(list[i].episode_count, 10) || 0;
          }
        }
      }
      if (parseInt(movie.number_of_seasons, 10) === 1) {
        return parseInt(movie.number_of_episodes, 10) || 0;
      }
      return 0;
    };

    this.getEpisodes = function(season, call) {
      var episodes = [];
	  var tmdb_id = object.movie.id;
	  if (['cub', 'tmdb'].indexOf(object.movie.source || 'tmdb') == -1)
        tmdb_id = object.movie.tmdb_id;
      if (typeof tmdb_id == 'number' && object.movie.name) {
		  var ckey = tmdb_id + ':' + season;
		  if (episodes_cache[ckey]) { call(episodes_cache[ckey]); return; }
		  Lampa.Api.sources.tmdb.get('tv/' + tmdb_id + '/season/' + season, {}, function(data){
			  episodes = data.episodes || [];
			  episodes_cache[ckey] = episodes;
			  call(episodes);
		  }, function(){
			  call(episodes);
		  })
      } else call(episodes);
    };
    this.watched = function(set) {
      var file_id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
      var watched = Lampa.Storage.cache('online_watched_last', 5000, {});
      if (set) {
        if (!watched[file_id]) watched[file_id] = {};
        Lampa.Arrays.extend(watched[file_id], set, true);
        Lampa.Storage.set('online_watched_last', watched);
        this.updateWatched();
      } else {
        return watched[file_id];
      }
    };
    this.updateWatched = function() {
      if (modern) return;
      var watched = this.watched();
      var body = scroll.body().find('.online-prestige-watched .online-prestige-watched__body').empty();
      if (watched) {
        var line = [];
        if (watched.balanser_name) line.push(watched.balanser_name);
        if (watched.voice_name) line.push(watched.voice_name);
        if (watched.season) line.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + watched.season);
        if (watched.episode) line.push(Lampa.Lang.translate('torrent_serial_episode') + ' ' + watched.episode);
        line.forEach(function(n) {
          body.append('<span>' + n + '</span>');
        });
      } else body.append('<span>' + Lampa.Lang.translate('lampac_no_watch_history') + '</span>');
    };

    this.draw = function(items) {
      var _this8 = this;
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!items.length) return this.empty();
      if (modern) return this.uiDraw(items, params);
      scroll.clear();
      if(!object.balanser)scroll.append(Lampa.Template.get('lampac_prestige_watched', {}));
      this.updateWatched();
      this.getEpisodes(items[0].season, function(episodes) {
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var serial = object.movie.name ? true : false;
        var choice = _this8.getChoice();
        var fully = window.innerWidth > 480;
        var scroll_to_element = false;
        var scroll_to_mark = false;
        items.forEach(function(element, index) {
          var episode = serial && episodes.length && !params.similars ? arrFind(episodes, function(e) {
            return e.episode_number == element.episode;
          }) : false;
          var episode_num = element.episode || index + 1;
          var episode_last = choice.episodes_view[element.season];
          var voice_name = choice.voice_name || (filter_find.voice[0] ? filter_find.voice[0].title : false) || element.voice_name || (serial ? 'Неизвестно' : element.text) || 'Неизвестно';
          if (element.quality) {
            element.qualitys = element.quality;
            element.quality = Lampa.Arrays.getKeys(element.quality)[0];
          }
          Lampa.Arrays.extend(element, {
            voice_name: voice_name,
            info: voice_name.length > 60 ? voice_name.substr(0, 60) + '...' : voice_name,
            quality: '',
            time: Lampa.Utils.secondsToTime((episode ? episode.runtime : object.movie.runtime) * 60, true)
          });
          var hash_timeline = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var hash_behold = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.voice_name].join('') : object.movie.original_title + element.voice_name);
          var data = {
            hash_timeline: hash_timeline,
            hash_behold: hash_behold
          };
          var info = [];
          if (element.season) {
            element.translate_episode_end = _this8.getLastEpisode(items);
            element.translate_voice = element.voice_name;
          }
          if (element.text && !episode) element.title = element.text;
          element.timeline = Lampa.Timeline.view(hash_timeline);
          if (episode) {
            element.title = episode.name;
            if (element.info.length < 30 && episode.vote_average) info.push(Lampa.Template.get('lampac_prestige_rate', {
              rate: parseFloat(episode.vote_average + '').toFixed(1)
            }, true));
            if (episode.air_date && fully) info.push(Lampa.Utils.parseTime(episode.air_date).full);
          } else if (object.movie.release_date && fully) {
            info.push(Lampa.Utils.parseTime(object.movie.release_date).full);
          }
          if (!serial && object.movie.tagline && element.info.length < 30) info.push(object.movie.tagline);
          if (element.info) info.push(element.info);
          if (info.length) element.info = info.map(function(i) {
            return '<span>' + i + '</span>';
          }).join('<span class="online-prestige-split">●</span>');
          var html = Lampa.Template.get('lampac_prestige_full', element);
          var loader = html.find('.online-prestige__loader');
          var image = html.find('.online-prestige__img');
		  if(object.balanser) image.hide();
          if (!serial) {
            if (choice.movie_view == hash_behold) scroll_to_element = html;
          } else if (typeof episode_last !== 'undefined' && episode_last == episode_num) {
            scroll_to_element = html;
          }
          if (serial && !episode) {
            image.append('<div class="online-prestige__episode-number">' + ('0' + (element.episode || index + 1)).slice(-2) + '</div>');
            loader.remove();
          }
		  else if (!serial && object.movie.backdrop_path == 'undefined') loader.remove();
          else {
            var img = html.find('img')[0];
            img.onerror = function() {
              img.src = './img/img_broken.svg';
            };
            img.onload = function() {
              image.addClass('online-prestige__img--loaded');
              loader.remove();
              if (serial) image.append('<div class="online-prestige__episode-number">' + ('0' + (element.episode || index + 1)).slice(-2) + '</div>');
            };
            img.src = Lampa.TMDB.image('t/p/w300' + (episode ? episode.still_path : object.movie.backdrop_path));
            images.push(img);
			element.thumbnail = img.src
          }
          html.find('.online-prestige__timeline').append(Lampa.Timeline.render(element.timeline));
          if (viewed.indexOf(hash_behold) !== -1) {
            scroll_to_mark = html;
            html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
          }
          element.mark = function() {
            viewed = Lampa.Storage.cache('online_view', 5000, []);
            if (viewed.indexOf(hash_behold) == -1) {
              viewed.push(hash_behold);
              Lampa.Storage.set('online_view', viewed);
              if (html.find('.online-prestige__viewed').length == 0) {
                html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
              }
            }
            choice = _this8.getChoice();
            if (!serial) {
              choice.movie_view = hash_behold;
            } else {
              choice.episodes_view[element.season] = episode_num;
            }
            _this8.saveChoice(choice);
            var voice_name_text = choice.voice_name || element.voice_name || element.title;
            if (voice_name_text.length > 30) voice_name_text = voice_name_text.slice(0, 30) + '...';
            _this8.watched({
              balanser: balanser,
              balanser_name: Lampa.Utils.capitalizeFirstLetter(sources[balanser] ? sources[balanser].name.split(' ')[0] : balanser),
              voice_id: choice.voice_id,
              voice_name: voice_name_text,
              episode: element.episode,
              season: element.season
            });
          };
          element.unmark = function() {
            viewed = Lampa.Storage.cache('online_view', 5000, []);
            if (viewed.indexOf(hash_behold) !== -1) {
              Lampa.Arrays.remove(viewed, hash_behold);
              Lampa.Storage.set('online_view', viewed);
              Lampa.Storage.remove('online_view', hash_behold);
              html.find('.online-prestige__viewed').remove();
            }
          };
          element.timeclear = function() {
            element.timeline.percent = 0;
            element.timeline.time = 0;
            element.timeline.duration = 0;
            Lampa.Timeline.update(element.timeline);
          };
          html.on('hover:enter', function() {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            if (params.onEnter) params.onEnter(element, html, data);
          }).on('hover:focus', function(e) {
            last = e.target;
            if (params.onFocus) params.onFocus(element, html, data);
            _this8.prefetchFileUrl(element);
            scroll.update($(e.target), true);
          });
          if (params.onRender) params.onRender(element, html, data);
          _this8.contextMenu({
            html: html,
            element: element,
            onFile: function onFile(call) {
              if (params.onContextMenu) params.onContextMenu(element, html, data, call);
            },
            onClearAllMark: function onClearAllMark() {
              items.forEach(function(elem) {
                elem.unmark();
              });
            },
            onClearAllTime: function onClearAllTime() {
              items.forEach(function(elem) {
                elem.timeclear();
              });
            }
          });
          scroll.append(html);
        });
        if (serial && episodes.length > items.length && !params.similars) {
          var left = episodes.slice(items.length);
          left.forEach(function(episode) {
            var info = [];
            if (episode.vote_average) info.push(Lampa.Template.get('lampac_prestige_rate', {
              rate: parseFloat(episode.vote_average + '').toFixed(1)
            }, true));
            if (episode.air_date) info.push(Lampa.Utils.parseTime(episode.air_date).full);
            var air = new Date((episode.air_date + '').replace(/-/g, '/'));
            var now = Date.now();
            var day = Math.round((air.getTime() - now) / (24 * 60 * 60 * 1000));
            var txt = Lampa.Lang.translate('full_episode_days_left') + ': ' + day;
            var html = Lampa.Template.get('lampac_prestige_full', {
              time: Lampa.Utils.secondsToTime((episode ? episode.runtime : object.movie.runtime) * 60, true),
              info: info.length ? info.map(function(i) {
                return '<span>' + i + '</span>';
              }).join('<span class="online-prestige-split">●</span>') : '',
              title: episode.name,
              quality: day > 0 ? txt : ''
            });
            var loader = html.find('.online-prestige__loader');
            var image = html.find('.online-prestige__img');
            var season = items[0] ? items[0].season : 1;
            html.find('.online-prestige__timeline').append(Lampa.Timeline.render(Lampa.Timeline.view(Lampa.Utils.hash([season, episode.episode_number, object.movie.original_title].join('')))));
            var img = html.find('img')[0];
            if (episode.still_path) {
              img.onerror = function() {
                img.src = './img/img_broken.svg';
              };
              img.onload = function() {
                image.addClass('online-prestige__img--loaded');
                loader.remove();
                image.append('<div class="online-prestige__episode-number">' + ('0' + episode.episode_number).slice(-2) + '</div>');
              };
              img.src = Lampa.TMDB.image('t/p/w300' + episode.still_path);
              images.push(img);
            } else {
              loader.remove();
              image.append('<div class="online-prestige__episode-number">' + ('0' + episode.episode_number).slice(-2) + '</div>');
            }
            html.on('hover:focus', function(e) {
              last = e.target;
              scroll.update($(e.target), true);
            });
            html.css('opacity', '0.5');
            scroll.append(html);
          });
        }
        if (scroll_to_element) {
          last = scroll_to_element[0];
        } else if (scroll_to_mark) {
          last = scroll_to_mark[0];
        }
        Lampa.Controller.enable('content');

        if (object.lampac_continue_episode) {
          var target_ep = object.lampac_continue_episode;
          delete object.lampac_continue_episode;

          var target_item = arrFind(items, function(el) {
            return el.episode == target_ep;
          });

          if (target_item) {
            setTimeout(function() {
              var target_html = scroll.body().find('.online-prestige--full').eq(items.indexOf(target_item));
              if (target_html.length) {
                last = target_html[0];
                scroll.update(target_html, true);
                target_html.trigger('hover:enter');
              }
            }, 300);
          }
        }
      });
    };

    this.contextMenu = function(params) {
      var _self = this;
      params.html.on('hover:long', function() {
        function show(extra) {
          var enabled = Lampa.Controller.enabled().name;
          var menu = [];
          if (Lampa.Platform.is('webos')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Webos',
              player: 'webos'
            });
          }
          if (Lampa.Platform.is('android')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Android',
              player: 'android'
            });
          }
          menu.push({
            title: Lampa.Lang.translate('player_lauch') + ' - Lampa',
            player: 'lampa'
          });
          menu.push({
            title: Lampa.Lang.translate('lampac_video'),
            separator: true
          });
          menu.push({
            title: Lampa.Lang.translate('torrent_parser_label_title'),
            mark: true
          });
          menu.push({
            title: Lampa.Lang.translate('torrent_parser_label_cancel_title'),
            unmark: true
          });
          if (params.element && params.element.episode) {
            menu.push({
              title: Lampa.Lang.translate('nova_mark_before'),
              markbefore: true
            });
          }
          menu.push({
            title: Lampa.Lang.translate('time_reset'),
            timeclear: true
          });
          if (extra) {
            menu.push({
              title: Lampa.Lang.translate('copy_link'),
              copylink: true
            });
          }
          if (window.lampac_online_context_menu)
            window.lampac_online_context_menu.push(menu, extra, params);
          menu.push({
            title: Lampa.Lang.translate('more'),
            separator: true
          });
          if (Lampa.Account.logged() && params.element && typeof params.element.season !== 'undefined' && params.element.translate_voice) {
            menu.push({
              title: Lampa.Lang.translate('lampac_voice_subscribe'),
              subscribe: true
            });
          }
          if (modern) {
            menu.push({
              title: Lampa.Lang.translate('nova_clarify'),
              clarify: true
            });
          }
          menu.push({
            title: Lampa.Lang.translate('lampac_clear_all_marks'),
            clearallmark: true
          });
          menu.push({
            title: Lampa.Lang.translate('lampac_clear_all_timecodes'),
            timeclearall: true
          });
          Lampa.Select.show({
            title: Lampa.Lang.translate('title_action'),
            items: menu,
            onBack: function onBack() {
              Lampa.Controller.toggle(enabled);
            },
            onSelect: function onSelect(a) {
              if (a.mark) {
                if (params.element.markSeen) params.element.markSeen();
                else params.element.mark();
              }
              if (a.unmark) params.element.unmark();
              if (a.markbefore) _self.markUpTo(params.element);
              if (a.timeclear) params.element.timeclear();
              if (a.clarify) _self.uiSearch();
              if (a.clearallmark) params.onClearAllMark();
              if (a.timeclearall) params.onClearAllTime();
              if (window.lampac_online_context_menu)
                window.lampac_online_context_menu.onSelect(a, params);
              Lampa.Controller.toggle(enabled);
              if (a.player) {
                Lampa.Player.runas(a.player);
                params.html.trigger('hover:enter');
              }
              if (a.copylink) {
                if (extra.quality) {
                  var qual = [];
                  for (var i in extra.quality) {
                    qual.push({
                      title: i,
                      file: extra.quality[i]
                    });
                  }
                  Lampa.Select.show({
                    title: Lampa.Lang.translate('settings_server_links'),
                    items: qual,
                    onBack: function onBack() {
                      Lampa.Controller.toggle(enabled);
                    },
                    onSelect: function onSelect(b) {
                      Lampa.Utils.copyTextToClipboard(b.file, function() {
                        Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
                      }, function() {
                        Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
                      });
                    }
                  });
                } else {
                  Lampa.Utils.copyTextToClipboard(extra.file, function() {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
                  }, function() {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
                  });
                }
              }
              if (a.subscribe) {
                Lampa.Account.subscribeToTranslation({
                  card: object.movie,
                  season: params.element.season,
                  episode: params.element.translate_episode_end,
                  voice: params.element.translate_voice
                }, function() {
                  Lampa.Noty.show(Lampa.Lang.translate('lampac_voice_success'));
                }, function() {
                  Lampa.Noty.show(Lampa.Lang.translate('lampac_voice_error'));
                });
              }
            }
          });
        }
        params.onFile(show);
      }).on('hover:focus', function() {
        if (Lampa.Helper) Lampa.Helper.show('online_file', Lampa.Lang.translate('helper_online_file'), params.html);
      });
    };

    this.uiRecoveryActions = function(extra) {
      var _this = this;
      var actions = [];
      var next = this.nextSource();
      if (next && !object.balanser) {
        actions.push({
          title: Lampa.Lang.translate('nova_try_source').replace('{name}', sources[next].name || next),
          icon: NovaUI.icon.play,
          handler: function() {
            _this.switchSource(next);
          }
        });
      }
      if (!object.balanser && sourceKeys().length > 1) {
        actions.push({
          title: Lampa.Lang.translate('nova_all_sources'),
          icon: NovaUI.icon.chevron,
          handler: function() {
            _this.uiSourceMenu();
          }
        });
      }
      actions.push({
        title: Lampa.Lang.translate('nova_retry'),
        icon: NovaUI.icon.refresh,
        handler: function() {

          online_results_cache = {};
          ui_focus = '';
          _this.uiLoading();
          _this.find();
        }
      });
      actions.push({
        title: Lampa.Lang.translate('nova_clarify'),
        icon: NovaUI.icon.search,
        handler: function() {
          _this.uiSearch();
        }
      });
      return actions;
    };

    this.empty = function() {
      if (modern) {
        this.probeSave(balanser, 'empty', 0);
        this.uiNote({
          title: Lampa.Lang.translate('empty_title_two'),
          text: Lampa.Lang.translate('nova_empty_text').replace('{name}', (sources[balanser] && sources[balanser].name) || balanser || ''),
          actions: this.uiRecoveryActions()
        });
        return;
      }
      var html = Lampa.Template.get('lampac_does_not_answer', {});
      html.find('.online-empty__buttons').remove();
      html.find('.online-empty__title').text(Lampa.Lang.translate('empty_title_two'));
      html.find('.online-empty__time').text(Lampa.Lang.translate('empty_text'));
      scroll.clear();
      scroll.append(html);
      this.loading(false);
    };
    this.noConnectToServer = function(er) {
      if (modern) {
        var denial = NovaUI.serverDenial(er);
        this.uiNote({
          title: Lampa.Lang.translate(denial ? 'nova_no_access' : 'title_error'),
          text: denial ? denial.msg : Lampa.Lang.translate('nova_no_server'),
          actions: [{
            title: Lampa.Lang.translate('nova_retry'),
            icon: NovaUI.icon.refresh,
            handler: function() {
              Lampa.Activity.replace();
            }
          }]
        });
        return;
      }
      var html = Lampa.Template.get('lampac_does_not_answer', {});
      html.find('.online-empty__buttons').remove();
      html.find('.online-empty__title').text(Lampa.Lang.translate('title_error'));
      html.find('.online-empty__time').html(er && er.accsdb ? er.msg : Lampa.Lang.translate('lampac_does_not_answer_text').replace('{balanser}', sources[balanser] ? sources[balanser].name : balanser));
      scroll.clear();
      scroll.append(html);
      this.loading(false);
    };
    this.doesNotAnswer = function(er) {
      var _this9 = this;
      if (modern) {

        if (!NovaUI.serverDenial(er) && !(er && er.timeout)) this.probeSave(balanser, 'empty', 0);
        ui_tried[balanser] = true;
        clearInterval(balanser_timer);

        var denial = NovaUI.serverDenial(er);
        var auto = Lampa.Storage.get('nova_auto_switch', true) !== false && !object.balanser && !denial;
        var next = auto ? this.nextSource() : '';
        var tic = er && er.accsdb ? 10 : 6;
        var note = this.uiNote({
          title: denial ? Lampa.Lang.translate('nova_no_access') : Lampa.Lang.translate(er && er.timeout ? 'nova_timeout_title' : 'lampac_balanser_dont_work'),
          text: denial ? denial.msg : next ?
            Lampa.Lang.translate('nova_auto_switch_text').replace('{name}', sources[next].name || next).replace('{sec}', '<span class="nova-note__timer">' + tic + '</span>') :
            Lampa.Lang.translate(er && er.timeout ? 'nova_timeout_text' : 'nova_empty_text').replace('{name}', (sources[balanser] && sources[balanser].name) || balanser || ''),
          actions: denial ? [{
            title: Lampa.Lang.translate('nova_retry'),
            icon: NovaUI.icon.refresh,
            handler: function() {
              Lampa.Activity.replace();
            }
          }] : this.uiRecoveryActions()
        });
        if (next) {
          balanser_timer = setInterval(function() {
            tic--;
            note.find('.nova-note__timer').text(tic);
            if (tic <= 0) {
              clearInterval(balanser_timer);
              if (Lampa.Activity.active().activity == _this9.activity) _this9.switchSource(next);
            }
          }, 1000);
        }
        return;
      }
      this.reset();

      if (filter_sources && filter_sources.length) {
        filter.set('sort', filter_sources.map(function(e) {
          return {
            title: sources[e] ? sources[e].name : e,
            source: e,
            selected: e == balanser,
            ghost: sources[e] ? !sources[e].show : false
          };
        }));
      }
      var html = Lampa.Template.get('lampac_does_not_answer', {
        balanser: balanser
      });
      if(er && er.accsdb) html.find('.online-empty__title').html(er.msg);

      var tic = er && er.accsdb ? 10 : 5;
      html.find('.cancel').on('hover:enter', function() {
        clearInterval(balanser_timer);
      });
      html.find('.change').on('hover:enter', function() {
        clearInterval(balanser_timer);
        filter.render().find('.filter--sort').trigger('hover:enter');
      });
      scroll.clear();
      scroll.append(html);
      this.loading(false);
      balanser_timer = setInterval(function() {
        tic--;
        html.find('.timeout').text(tic);
        if (tic == 0) {
          clearInterval(balanser_timer);
          var keys = Lampa.Arrays.getKeys(sources);
          var indx = keys.indexOf(balanser);
          var next = keys[indx + 1];
          if (!next) next = keys[0];
          balanser = next;
          if (Lampa.Activity.active().activity == _this9.activity) _this9.changeBalanser(balanser);
        }
      }, 1000);
    };
    this.getLastEpisode = function(items) {
      var last_episode = 0;
      items.forEach(function(e) {
        if (typeof e.episode !== 'undefined') last_episode = Math.max(last_episode, parseInt(e.episode));
      });
      return last_episode;
    };

    this.start = function() {
      var _this = this;
      if (Lampa.Activity.active().activity !== this.activity) return;
      NovaUI.qualityScope(object.movie ? object.movie.id : '');
      if (!initialized) {
        initialized = true;
        this.initialize();
      }
      Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
      Lampa.Controller.add('content', {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render(), files.render());
          var target = _this.uiFocusTarget();
          if (modern && !target) return;
          Lampa.Controller.collectionFocus(target || false, scroll.render());
          if (modern && target) {
            last = target;
            try { scroll.update($(target), true); } catch (e) {}
            setTimeout(function() {
              try {
                var now = Lampa.Controller.enabled();
                if (!now || now.name !== 'content') return;
                if (!_this.uiShown(target) || $(target).hasClass('focus')) return;
                Lampa.Controller.collectionSet(scroll.render(), files.render());
                Lampa.Controller.collectionFocus(target, scroll.render());
                scroll.update($(target), true);
              } catch (e) {}
            }, 0);
          }
        },
        gone: function gone() {
          clearTimeout(balanser_timer);
        },
        up: function up() {
          if (modern && _this.uiDropUp()) return;
          if (Navigator.canmove('up')) {
            Navigator.move('up');
            return;
          }

          if (modern && _this.uiUpFallback()) return;
          Lampa.Controller.toggle('head');
        },
        down: function down() {

          if (modern && _this.uiDropDown()) return;
          if (modern && !ui_open && ui_items.length > 1 && _this.uiToolbarFocused()) {
            if (_this.uiGoToItem(_this.uiPickResume(ui_items))) return;
          }
          Navigator.move('down');
        },
        right: function right() {
          if (Navigator.canmove('right')) Navigator.move('right');
          else if (!modern) filter.show(Lampa.Lang.translate('title_filter'), 'filter');
          else if (_this.uiDropRight()) return;
          else _this.uiToolbarFocus();
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');
          else if (modern && _this.uiDropLeft()) return;
          else Lampa.Controller.toggle('menu');
        },
        back: this.back.bind(this)
      });
      this.uiRefreshMarks();
      Lampa.Controller.toggle('content');
    };
    this.render = function() {
      return files.render();
    };
    this.back = function() {
      Lampa.Activity.backward();
    };

    var self_marks = this;
    var refresh_timers = [];
    var player_close = function() {
      var run = function() {
        try {
          if (Lampa.Activity.active().activity !== self_marks.activity) return;
        } catch (e) {}
        try { self_marks.uiRefreshMarks(); } catch (e) {}
      };
      run();
      [80, 400, 1200].forEach(function(wait) {
        refresh_timers.push(setTimeout(run, wait));
      });
    };
    this.uiStopRefresh = function() {
      refresh_timers.forEach(function(id) { clearTimeout(id); });
      refresh_timers = [];
    };

    var soft_timer = null;
    var player_soft = function() {
      clearTimeout(soft_timer);
      soft_timer = setTimeout(function() {
        try {
          if (Lampa.Player && typeof Lampa.Player.opened === 'function' && Lampa.Player.opened()) return;
        } catch (e) {}
        try {
          if (Lampa.Activity.active().activity !== self_marks.activity) return;
        } catch (e) {}
        try { self_marks.uiRefreshMarks(); } catch (e) {}
      }, 250);
    };

    var player_outside = false;
    var player_external = function() {
      player_outside = true;
    };

    var page_back = function() {
      try {
        if (document.visibilityState && document.visibilityState !== 'visible') return;
      } catch (e) {}
      if (!player_outside) return;
      player_outside = false;
      player_close();
    };

    if (Lampa.Player && Lampa.Player.listener && Lampa.Player.listener.follow) {
      Lampa.Player.listener.follow('destroy', player_close);
      Lampa.Player.listener.follow('external', player_external);
    }
    if (Lampa.Timeline && Lampa.Timeline.listener && Lampa.Timeline.listener.follow) {
      Lampa.Timeline.listener.follow('update', player_soft);
    }
    try {
      document.addEventListener('visibilitychange', page_back, false);
      window.addEventListener('focus', page_back, false);
    } catch (e) {}

    this.pause = function() {};
    this.stop = function() {};
    this.destroy = function() {
      this.uiStopRefresh();
      clearTimeout(soft_timer);
      if (Lampa.Player && Lampa.Player.listener && Lampa.Player.listener.remove) {
        Lampa.Player.listener.remove('destroy', player_close);
        Lampa.Player.listener.remove('external', player_external);
      }
      if (Lampa.Timeline && Lampa.Timeline.listener && Lampa.Timeline.listener.remove) {
        Lampa.Timeline.listener.remove('update', player_soft);
      }
      try {
        document.removeEventListener('visibilitychange', page_back);
        window.removeEventListener('focus', page_back);
      } catch (e) {}
      network.clear();
      if (prefetch_timer) { clearTimeout(prefetch_timer); prefetch_timer = null; }
      if (prefetch_network) { try { prefetch_network.clear(); } catch (e) {} prefetch_network = null; }
      fileurl_cache = {};
      fileurl_prefetching = {};
      episodes_cache = {};
      this.clearImages();
      files.destroy();
      scroll.destroy();
      clearInterval(balanser_timer);
      clearInterval(ui_load_timer);
      clearTimeout(ui_watchdog);
      clearTimeout(life_wait_timer);
    };
  }

  function addSourceSearch(spiderName, spiderUri) {
    var network = new Lampa.Reguest();

    var source = {
      title: spiderName,
      search: function(params, oncomplite) {
        function searchComplite(links) {
          var keys = Lampa.Arrays.getKeys(links);

          if (keys.length) {
            var status = new Lampa.Status(keys.length);

            status.onComplite = function(result) {
              var rows = [];

              keys.forEach(function(name) {
                var line = result[name];

                if (line && line.data && line.type == 'similar') {
                  var cards = line.data.map(function(item) {
                    item.title = Lampa.Utils.capitalizeFirstLetter(item.title);
                    item.release_date = item.year || '0000';
                    item.balanser = spiderUri;
                    if (item.img !== undefined) {
                      if (item.img.charAt(0) === '/')
                        item.img = Defined.localhost + item.img.substring(1);
                      if (item.img.indexOf('/proxyimg') !== -1)
                        item.img = account(item.img);
                    }

                    return item;
                  })

                  rows.push({
                    title: name,
                    results: cards
                  })
                }
              })

              oncomplite(rows);
            }

            keys.forEach(function(name) {
              network.silent(account(links[name]), function(data) {
                status.append(name, data);
              }, function() {
                status.error();
              }, false, {
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
		  })
            })
          } else {
            oncomplite([]);
          }
        }

        network.silent(account(Defined.localhost + 'lite/' + spiderUri + '?title=' + params.query), function(json) {
          if (json.rch) {
            rchRun(json, function() {
              network.silent(account(Defined.localhost + 'lite/' + spiderUri + '?title=' + params.query), function(links) {
                searchComplite(links);
              }, function() {
                oncomplite([]);
              }, false, {
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
     });
            });
          } else {
            searchComplite(json);
          }
        }, function() {
          oncomplite([]);
        }, false, {
			headers: {'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')}
		  });
      },
      onCancel: function() {
        network.clear()
      },
      params: {
        lazy: true,
        align_left: true,
        card_events: {
          onMenu: function() {}
        }
      },
      onMore: function(params, close) {
        close();
      },
      onSelect: function(params, close) {
        close();

        Lampa.Activity.push({
          url: params.element.url,
          title: Lampa.Lang.translate('title_online') + ' - ' + params.element.title,
          component: 'nova_video',
          movie: params.element,
          page: 1,
          search: params.element.title,
          clarification: true,
          balanser: params.element.balanser,
          noinfo: true
        });
      }
    }

    Lampa.Search.addSource(source)
  }

  function startPlugin() {
    window.nova_online_plugin = true;
		Lampa.SettingsApi.addComponent({
        component: 'nova_online',
        icon: "<svg height=\"36\" viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"2\" y=\"6\" width=\"32\" height=\"24\" rx=\"5\" stroke=\"white\" stroke-width=\"3\"/><path d=\"M15 13l9 5-9 5v-10z\" fill=\"white\"/></svg>",
        name: 'Nova Online'
      });
	  		var currentAcc = currentAccount();
				var uniqs = (currentAcc ? currentAcc.uid : unic_id).slice(-3).toUpperCase();
				Lampa.SettingsApi.addParam({
				component: 'nova_online',
				param: {
					name: 'only_title',
					type: 'title',
					default: true
				},
				field: {
					name: 'Код устройства '+uniqs + ' (' + accountTitle(SERVER_CONFIG.pool.currentIndex) + ')'
				}
			});
Lampa.SettingsApi.addParam({
    component: 'nova_online',
    param: {
        name: 'nova_button_first',
        type: 'trigger',
        default: false
    },
    field: {
        name: 'Кнопка Онлайн первой',
        description: 'Показывать кнопку онлайн перед остальными'
    }
});

	  Lampa.SettingsApi.addParam({
				component: 'nova_online',
				param: {
					name: 'only_title',
					type: 'title',
					default: true
				},
				field: {
					name: 'Онлайн'
				}
			});

	  Lampa.SettingsApi.addParam({
        component: 'nova_online',
        param: {
          name: 'nova_proxy_servers',
          type: 'trigger',
            default: false,
        },
        field: {
          name: 'Проксировать серверы',
		  description: 'Позволяет проксировать онлайн через серверы CloudFlare'
        },
        onChange: function (value) {
			Lampa.Noty.show('Необходимо перезайти в лампу');
		}
	  });

	  Lampa.SettingsApi.addParam({
        component: 'nova_online',
        param: {
          name: 'nova_account_index',
          type: 'select',
          values: (function() {
            var v = { auto: 'Случайный' };
            SERVER_CONFIG.pool.accounts.forEach(function(a, i) { v[String(i)] = accountTitle(i); });
            return v;
          })(),
          default: 'auto'
        },
        field: {
          name: 'Аккаунт',
          description: 'Случайный выбор или конкретный аккаунт'
        },
        onChange: function(value) {
          Lampa.Storage.set('nova_account_index', String(value) === 'auto' ? 'auto' : (parseInt(value, 10) || 0));
          resetAccountRotation();
          applyAccountIndex();
          Lampa.Noty.show('Аккаунт переключен. Перезайдите в онлайн.');
        }
	  });

    var manifst = {
      type: 'video',
      version: '',
      name: 'Nova',
      description: 'Смотреть онлайн',
      component: 'nova_video',
      onContextMenu: function onContextMenu(object) {
        return {
          name: Lampa.Lang.translate('lampac_watch'),
          description: ''
        };
      },
      onContextLauch: function onContextLauch(object) {
        resetTemplates();
        Lampa.Component.add('nova_video', component);

		var id = Lampa.Utils.hash(object.number_of_seasons ? object.original_name : object.original_title);
		var all = Lampa.Storage.get('clarification_search','{}');

		var isSeries = object.number_of_seasons || object.name;
		var continueEnabled = Lampa.Storage.field('lampac_continue_play') === true;
		var file_id = Lampa.Utils.hash(object.number_of_seasons ? object.original_name : object.original_title);
		var watched = Lampa.Storage.cache('online_watched_last', 5000, {});
		var watchedData = watched[file_id];

		if (isSeries && continueEnabled && watchedData && watchedData.season && watchedData.episode) {
		  var line = [];
		  if (watchedData.balanser_name) line.push(watchedData.balanser_name);
		  if (watchedData.voice_name) line.push(watchedData.voice_name);
		  line.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + watchedData.season);
		  line.push(Lampa.Lang.translate('torrent_serial_episode') + ' ' + watchedData.episode);

		  Lampa.Select.show({
		    title: Lampa.Lang.translate('lampac_continue_watch'),
		    items: [
		      { title: '▶ ' + Lampa.Lang.translate('lampac_continue_yes') + ' (' + line.join(' · ') + ')', continue_yes: true },
		      { title: Lampa.Lang.translate('lampac_continue_no'), continue_no: true }
		    ],
		    onBack: function() {
		      Lampa.Controller.toggle('content');
		    },
		    onSelect: function(sel) {
		      Lampa.Select.close();

		      if (sel.continue_yes && watchedData.balanser) {
		        var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
		        last_select_balanser[object.id] = watchedData.balanser;
		        Lampa.Storage.set('online_last_balanser', last_select_balanser);

		        var choiceData = Lampa.Storage.cache('online_choice_' + watchedData.balanser, 3000, {});
		        if (!choiceData[object.id]) choiceData[object.id] = {};
		        var seasonIdx = (parseInt(watchedData.season) || 1) - 1;
		        if (seasonIdx < 0) seasonIdx = 0;
		        choiceData[object.id].season = seasonIdx;
		        if (watchedData.voice_name) choiceData[object.id].voice_name = watchedData.voice_name;
		        Lampa.Storage.set('online_choice_' + watchedData.balanser, choiceData);

		        Lampa.Activity.push({
		          url: '',
		          title: Lampa.Lang.translate('title_online'),
		          component: 'nova_video',
		          search: all[id] ? all[id] : object.title,
		          search_one: object.title,
		          search_two: object.original_title,
		          movie: object,
		          page: 1,
		          clarification: all[id] ? true : false,
		          lampac_continue_episode: parseInt(watchedData.episode) || 1
		        });
		      } else {
		        Lampa.Activity.push({
		          url: '',
		          title: Lampa.Lang.translate('title_online'),
		          component: 'nova_video',
		          search: all[id] ? all[id] : object.title,
		          search_one: object.title,
		          search_two: object.original_title,
		          movie: object,
		          page: 1,
		          clarification: all[id] ? true : false
		        });
		      }
		    }
		  });
		} else {
        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'nova_video',
          search: all[id] ? all[id] : object.title,
          search_one: object.title,
          search_two: object.original_title,
          movie: object,
          page: 1,
		  clarification: all[id] ? true : false
        });
		}
      }
    };
    Lampa.Manifest.plugins = manifst;
    Lampa.Lang.add({
      lampac_continue_watch: {
        ru: 'Продолжить просмотр?',
        en: 'Continue watching?',
        uk: 'Продовжити перегляд?',
        zh: '继续观看？'
      },
      lampac_continue_yes: {
        ru: 'Продолжить',
        en: 'Continue',
        uk: 'Продовжити',
        zh: '继续'
      },
      lampac_continue_no: {
        ru: 'Выбрать серию',
        en: 'Choose episode',
        uk: 'Обрати серію',
        zh: '选择剧集'
      },
      lampac_continue_enable: {
        ru: 'Предлагать продолжение',
        en: 'Suggest continue watching',
        uk: 'Пропонувати продовження',
        zh: '建议继续观看'
      },
      lampac_continue_enable_descr: {
        ru: 'Показывать диалог продолжения при входе в сериал',
        en: 'Show continue dialog when entering a series',
        uk: 'Показувати діалог продовження при вході в серіал',
        zh: '进入剧集时显示继续对话框'
      },
      lampac_watch: {
        ru: 'Смотреть онлайн',
        en: 'Watch online',
        uk: 'Дивитися онлайн',
        zh: '在线观看'
      },
      lampac_video: {
        ru: 'Видео',
        en: 'Video',
        uk: 'Відео',
        zh: '视频'
      },
      lampac_no_watch_history: {
        ru: 'Нет истории просмотра',
        en: 'No browsing history',
        uk: 'Немає історії перегляду',
        zh: '没有浏览历史'
      },
      lampac_nolink: {
        ru: 'Не удалось извлечь ссылку',
        uk: 'Неможливо отримати посилання',
        en: 'Failed to fetch link',
        zh: '获取链接失败'
      },
      lampac_balanser: {
        ru: 'Источник',
        uk: 'Джерело',
        en: 'Source',
        zh: '来源'
      },
      helper_online_file: {
        ru: 'Удерживайте клавишу "ОК" для вызова контекстного меню',
        uk: 'Утримуйте клавішу "ОК" для виклику контекстного меню',
        en: 'Hold the "OK" key to bring up the context menu',
        zh: '按住“确定”键调出上下文菜单'
      },
      title_online: {
        ru: 'Онлайн',
        uk: 'Онлайн',
        en: 'Online',
        zh: '在线的'
      },
      lampac_voice_subscribe: {
        ru: 'Подписаться на перевод',
        uk: 'Підписатися на переклад',
        en: 'Subscribe to translation',
        zh: '订阅翻译'
      },
      lampac_voice_success: {
        ru: 'Вы успешно подписались',
        uk: 'Ви успішно підписалися',
        en: 'You have successfully subscribed',
        zh: '您已成功订阅'
      },
      lampac_voice_error: {
        ru: 'Возникла ошибка',
        uk: 'Виникла помилка',
        en: 'An error has occurred',
        zh: '发生了错误'
      },
      lampac_clear_all_marks: {
        ru: 'Очистить все метки',
        uk: 'Очистити всі мітки',
        en: 'Clear all labels',
        zh: '清除所有标签'
      },
      lampac_clear_all_timecodes: {
        ru: 'Очистить все тайм-коды',
        uk: 'Очистити всі тайм-коди',
        en: 'Clear all timecodes',
        zh: '清除所有时间代码'
      },
      lampac_change_balanser: {
        ru: 'Изменить балансер',
        uk: 'Змінити балансер',
        en: 'Change balancer',
        zh: '更改平衡器'
      },
      lampac_balanser_dont_work: {
        ru: 'Поиск не дал результатов',
        uk: 'Пошук не дав результатів',
        en: 'Search  did not return any results',
        zh: '搜索 未返回任何结果'
      },
      lampac_balanser_timeout: {
        ru: 'Источник будет переключен автоматически через <span class="timeout">10</span> секунд.',
        uk: 'Джерело буде автоматично переключено через <span class="timeout">10</span> секунд.',
        en: 'The source will be switched automatically after <span class="timeout">10</span> seconds.',
        zh: '平衡器将在<span class="timeout">10</span>秒内自动切换。'
      },

      nova_continue: {
        ru: 'Продолжить',
        uk: 'Продовжити',
        en: 'Continue',
        zh: '继续'
      },
      nova_watch: {
        ru: 'Смотреть',
        uk: 'Дивитися',
        en: 'Watch',
        zh: '观看'
      },
      nova_clarify: {
        ru: 'Уточнить название',
        uk: 'Уточнити назву',
        en: 'Refine title',
        zh: '优化标题'
      },
      nova_retry: {
        ru: 'Повторить',
        uk: 'Повторити',
        en: 'Retry',
        zh: '重试'
      },
      nova_unknown: {
        ru: 'Неизвестно',
        uk: 'Невідомо',
        en: 'Unknown',
        zh: '未知'
      },
      nova_try_source: {
        ru: 'Попробовать {name}',
        uk: 'Спробувати {name}',
        en: 'Try {name}',
        zh: '尝试 {name}'
      },
      nova_all_sources: {
        ru: 'Все источники',
        uk: 'Усі джерела',
        en: 'All sources',
        zh: '所有来源'
      },
      nova_empty_text: {
        ru: 'Источник «{name}» ничего не нашёл. Попробуйте другой источник или уточните название.',
        uk: 'Джерело «{name}» нічого не знайшло. Спробуйте інше джерело або уточніть назву.',
        en: 'Source "{name}" found nothing. Try another source or refine the title.',
        zh: '来源“{name}”没有找到任何内容。请尝试其他来源或优化标题。'
      },
      nova_no_server: {
        ru: 'Сервер не отвечает. Проверьте интернет и попробуйте ещё раз.',
        uk: 'Сервер не відповідає. Перевірте інтернет і спробуйте ще раз.',
        en: 'The server is not responding. Check your connection and try again.',
        zh: '服务器无响应。请检查网络连接后重试。'
      },
      nova_auto_switch_text: {
        ru: 'Через {sec} сек переключимся на «{name}»',
        uk: 'Через {sec} с перемкнемося на «{name}»',
        en: 'Switching to "{name}" in {sec} sec',
        zh: '{sec} 秒后切换到“{name}”'
      },
      nova_season_progress: {
        ru: 'Просмотрено {seen} из {total}',
        uk: 'Переглянуто {seen} з {total}',
        en: 'Watched {seen} of {total}',
        zh: '已观看 {seen} / {total}'
      },
      nova_voice_dub: {
        ru: 'Дубляж',
        uk: 'Дубляж',
        en: 'Dubbing',
        zh: '配音'
      },
      nova_voice_mvo: {
        ru: 'Многоголосый',
        uk: 'Багатоголосий',
        en: 'Multi-voice',
        zh: '多人配音'
      },
      nova_voice_dvo: {
        ru: 'Двухголосый',
        uk: 'Двоголосий',
        en: 'Two-voice',
        zh: '双人配音'
      },
      nova_voice_avo: {
        ru: 'Авторский',
        uk: 'Авторський',
        en: 'Single-voice',
        zh: '单人配音'
      },
      nova_voice_orig: {
        ru: 'Оригинал',
        uk: 'Оригінал',
        en: 'Original',
        zh: '原声'
      },
      nova_voice_sub: {
        ru: 'Субтитры',
        uk: 'Субтитри',
        en: 'Subtitles',
        zh: '字幕'
      },
      nova_voice_other: {
        ru: 'Прочие',
        uk: 'Інші',
        en: 'Other',
        zh: '其他'
      },
      nova_timeout_title: {
        ru: 'Источник не ответил',
        uk: 'Джерело не відповіло',
        en: 'The source did not respond',
        zh: '来源未响应'
      },
      nova_timeout_text: {
        ru: '«{name}» слишком долго не отвечает. Возьмём другой источник или попробуем ещё раз.',
        uk: '«{name}» надто довго не відповідає. Візьмемо інше джерело або спробуємо ще раз.',
        en: '"{name}" is taking too long. Try another source or repeat the request.',
        zh: '“{name}”响应时间过长。请更换来源或重试。'
      },
      nova_similar_best: {
        ru: 'Похоже, это он',
        uk: 'Схоже, це він',
        en: 'Looks like this one',
        zh: '应该是这部'
      },
      nova_similar_all: {
        ru: 'Варианты',
        uk: 'Варіанти',
        en: 'Other matches',
        zh: '其他结果'
      },
      nova_similar_auto: {
        ru: 'Самому выбирать из каталога',
        uk: 'Самому обирати з каталогу',
        en: 'Pick the match from a catalog',
        zh: '自动从目录中选择'
      },
      nova_similar_auto_descr: {
        ru: 'Если источник отдаёт папку с похожими названиями, открывать нужное по названию и году',
        uk: 'Якщо джерело віддає папку з подібними назвами, відкривати потрібне за назвою та роком',
        en: 'When a source returns a folder of similar titles, open the one matching by name and year',
        zh: '当来源返回相似名称目录时，按名称和年份打开匹配项'
      },
      nova_quality_name: {
        ru: 'Качество по умолчанию',
        uk: 'Якість за замовчуванням',
        en: 'Default quality',
        zh: '默认画质'
      },
      nova_quality_descr: {
        ru: 'Запускать в этом качестве, если оно есть — иначе в ближайшем ниже',
        uk: 'Запускати в цій якості, якщо вона є — інакше в найближчій нижче',
        en: 'Play at this quality when available, otherwise the closest lower one',
        zh: '有该画质时使用，否则用最接近的较低画质'
      },
      nova_quality_auto: {
        ru: 'Как решит источник',
        uk: 'Як вирішить джерело',
        en: 'Let the source decide',
        zh: '由来源决定'
      },
      nova_next_episode: {
        ru: 'Следующая',
        uk: 'Наступна',
        en: 'Next',
        zh: '下一集'
      },
      nova_from_start: {
        ru: 'Смотреть с начала',
        uk: 'Дивитися спочатку',
        en: 'Watch from the start',
        zh: '从头观看'
      },
      nova_first_new: {
        ru: 'Первая непросмотренная',
        uk: 'Перша непереглянута',
        en: 'First unwatched',
        zh: '第一集未观看'
      },
      nova_jump_pick: {
        ru: 'Выбрать серию',
        uk: 'Обрати серію',
        en: 'Pick an episode',
        zh: '选择剧集'
      },
      nova_season_planned: {
        ru: 'всего в сезоне {planned}',
        uk: 'усього в сезоні {planned}',
        en: '{planned} in the season',
        zh: '本季共 {planned} 集'
      },
      nova_season_left: {
        ru: 'осталось {left}',
        uk: 'залишилось {left}',
        en: '{left} left',
        zh: '还剩 {left} 集'
      },
      nova_mark_before: {
        ru: 'Отметить всё до этой',
        uk: 'Позначити все до цієї',
        en: 'Mark everything up to this',
        zh: '标记此集之前全部'
      },
      nova_jump: {
        ru: 'Серия',
        uk: 'Серія',
        en: 'Episode',
        zh: '剧集'
      },
      nova_more_sources: {
        ru: 'Ещё {count}',
        uk: 'Ще {count}',
        en: '{count} more',
        zh: '还有 {count} 个'
      },
      nova_no_access: {
        ru: 'Нет доступа',
        uk: 'Немає доступу',
        en: 'No access',
        zh: '无访问权限'
      },
      nova_no_access_text: {
        ru: 'Сервер отказал в доступе',
        uk: 'Сервер відмовив у доступі',
        en: 'The server denied access',
        zh: '服务器拒绝访问'
      },
      nova_left: {
        ru: 'осталось',
        uk: 'залишилось',
        en: 'left',
        zh: '剩余'
      },
      nova_loading_title: {
        ru: 'Ищем, где посмотреть',
        uk: 'Шукаємо, де подивитися',
        en: 'Looking for sources',
        zh: '正在查找播放源'
      },
      nova_loading_start: {
        ru: 'Опрашиваем источники',
        uk: 'Опитуємо джерела',
        en: 'Polling sources',
        zh: '正在查询来源'
      },
      nova_loading_found: {
        ru: 'Найдено источников: {n}',
        uk: 'Знайдено джерел: {n}',
        en: 'Sources found: {n}',
        zh: '已找到来源：{n}'
      },
      nova_loading_slow: {
        ru: 'отвечают медленно',
        uk: 'відповідають повільно',
        en: 'responding slowly',
        zh: '响应缓慢'
      },
      nova_sec: {
        ru: ' с',
        uk: ' с',
        en: 's',
        zh: ' 秒'
      },
      nova_settings: {
        ru: 'Онлайн',
        uk: 'Онлайн',
        en: 'Online',
        zh: '在线'
      },
      nova_ui_mode_name: {
        ru: 'Интерфейс',
        uk: 'Інтерфейс',
        en: 'Interface',
        zh: '界面'
      },
      nova_ui_mode_descr: {
        ru: 'Новый — шапка с продолжением и выбор перевода на экране',
        uk: 'Новий — шапка з продовженням і вибір перекладу на екрані',
        en: 'New — hero header with resume and on-screen translation picker',
        zh: '新版 — 带继续播放的头部和屏幕上的翻译选择'
      },
      nova_ui_modern: {
        ru: 'Новый',
        uk: 'Новий',
        en: 'New',
        zh: '新版'
      },
      nova_ui_classic: {
        ru: 'Классический',
        uk: 'Класичний',
        en: 'Classic',
        zh: '经典'
      },
      nova_view_name: {
        ru: 'Вид списка серий',
        uk: 'Вигляд списку серій',
        en: 'Episode layout',
        zh: '剧集布局'
      },
      nova_view_list: {
        ru: 'Список',
        uk: 'Список',
        en: 'List',
        zh: '列表'
      },
      nova_view_grid: {
        ru: 'Плитка',
        uk: 'Плитка',
        en: 'Grid',
        zh: '网格'
      },
      nova_focus_name: {
        ru: 'Выделение',
        uk: 'Виділення',
        en: 'Highlight style',
        zh: '高亮样式'
      },
      nova_focus_descr: {
        ru: 'Чем подсвечивать выбранную кнопку, серию или озвучку',
        uk: 'Чим підсвічувати вибрану кнопку, серію або озвучення',
        en: 'How the focused button, episode or voice is highlighted',
        zh: '如何高亮所选按钮、剧集或配音'
      },
      nova_focus_ring: {
        ru: 'Ободок',
        uk: 'Обідок',
        en: 'Outline',
        zh: '描边'
      },
      nova_focus_fill: {
        ru: 'Белая заливка',
        uk: 'Біла заливка',
        en: 'White fill',
        zh: '白色填充'
      },
      nova_fullscreen_name: {
        ru: 'Во всю ширину экрана',
        uk: 'На всю ширину екрана',
        en: 'Full width',
        zh: '全屏宽度'
      },
      nova_fullscreen_descr: {
        ru: 'Скрыть маленький постер и описание слева',
        uk: 'Сховати маленький постер і опис ліворуч',
        en: 'Hide the small poster and overview on the left',
        zh: '隐藏左侧的小海报和简介'
      },
      nova_fade_name: {
        ru: 'Размытые края постера',
        uk: 'Розмиті краї постера',
        en: 'Faded poster edges',
        zh: '海报边缘渐隐'
      },
      nova_fade_descr: {
        ru: 'Растворять постер вверху по краям со всех сторон',
        uk: 'Розчиняти постер угорі по краях з усіх боків',
        en: 'Fade the header artwork out on every side',
        zh: '让顶部剧照四边渐隐'
      },
      nova_hero_art_name: {
        ru: 'Шапка с кадром',
        uk: 'Шапка з кадром',
        en: 'Header with backdrop',
        zh: '带剧照的头部'
      },
      nova_hero_art_descr: {
        ru: 'Крупный кадр, название и описание над кнопкой',
        uk: 'Великий кадр, назва й опис над кнопкою',
        en: 'Large backdrop, title and overview above the button',
        zh: '按钮上方显示大图、标题和简介'
      },
      nova_art_size_name: {
        ru: 'Качество кадра',
        uk: 'Якість кадру',
        en: 'Backdrop quality',
        zh: '剧照画质'
      },
      nova_art_size_descr: {
        ru: 'Разрешение картинки в шапке. Выше — резче, но тяжелее',
        uk: 'Роздільна здатність картинки в шапці. Вище — різкіше, але важче',
        en: 'Header artwork resolution. Higher is sharper but heavier',
        zh: '头部剧照分辨率。越高越清晰，但更大'
      },
      nova_art_auto: {
        ru: 'Авто (по экрану)',
        uk: 'Авто (за екраном)',
        en: 'Auto (by screen)',
        zh: '自动（按屏幕）'
      },
      nova_art_780: {
        ru: 'Обычное — 780px',
        uk: 'Звичайна — 780px',
        en: 'Normal — 780px',
        zh: '普通 — 780px'
      },
      nova_art_1280: {
        ru: 'Высокое — 1280px',
        uk: 'Висока — 1280px',
        en: 'High — 1280px',
        zh: '高 — 1280px'
      },
      nova_art_orig: {
        ru: 'Максимальное (тяжёлое)',
        uk: 'Максимальна (важка)',
        en: 'Maximum (heavy)',
        zh: '最大（较重）'
      },
      nova_logo_name: {
        ru: 'Логотип вместо названия',
        uk: 'Логотип замість назви',
        en: 'Logo instead of title',
        zh: '用标识代替标题'
      },
      nova_logo_descr: {
        ru: 'Показывать логотип фильма в шапке, если он есть',
        uk: 'Показувати логотип фільму в шапці, якщо він є',
        en: 'Show the movie logo in the header when available',
        zh: '如果有，在头部显示影片标识'
      },
      nova_hero_name: {
        ru: 'Показывать шапку',
        uk: 'Показувати шапку',
        en: 'Show header',
        zh: '显示头部'
      },
      nova_hero_descr: {
        ru: 'Кнопка продолжения с прогрессом над списком',
        uk: 'Кнопка продовження з прогресом над списком',
        en: 'Continue button with progress above the list',
        zh: '列表上方的继续按钮和进度'
      },
      nova_voice_auto_name: {
        ru: 'Запоминать тип перевода',
        uk: 'Запам\'ятовувати тип перекладу',
        en: 'Remember translation type',
        zh: '记住翻译类型'
      },
      nova_voice_auto_descr: {
        ru: 'Подставлять привычную озвучку (дубляж, многоголосый и т.д.) на всех источниках',
        uk: 'Підставляти звичну озвучку (дубляж, багатоголосий тощо) на всіх джерелах',
        en: 'Pre-select your usual translation type on every source',
        zh: '在所有来源上预选常用的翻译类型'
      },
      nova_auto_switch_name: {
        ru: 'Автопереключение источника',
        uk: 'Автоперемикання джерела',
        en: 'Auto switch source',
        zh: '自动切换来源'
      },
      nova_auto_switch_descr: {
        ru: 'Если источник ничего не нашёл — перейти на следующий рабочий',
        uk: 'Якщо джерело нічого не знайшло — перейти на наступне робоче',
        en: 'Move to the next working source when one returns nothing',
        zh: '当某个来源没有结果时自动切换到下一个可用来源'
      },
      lampac_does_not_answer_text: {
        ru: 'Поиск на ({balanser}) не дал результатов',
        uk: 'Пошук на ({balanser}) не дав результатів',
        en: 'Search on ({balanser}) did not return any results',
        zh: '搜索 ({balanser}) 未返回任何结果'
      }
    });
    Lampa.Template.add('lampac_css', "\n        <style>\n        @charset 'UTF-8';.online-prestige{position:relative;-webkit-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em !important;height:4.4em !important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em !important;height:1.5em !important}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige__scan-file{position:absolute;bottom:0;left:0;right:0}.online-prestige__scan-file .broadcast__scan{margin:0}.online-prestige .online-prestige-split{font-size:.8em;margin:0 1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}.online-prestige--folder .online-prestige__footer{margin-top:.8em}.online-prestige-watched{padding:1em}.online-prestige-watched__icon>svg{width:1.5em;height:1.5em}.online-prestige-watched__body{padding-left:1em;padding-top:.1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.online-prestige-watched__body>span+span::before{content:' ● ';vertical-align:top;display:inline-block;margin:0 .5em}.online-prestige-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige-rate>svg{width:1.3em !important;height:1.3em !important}.online-prestige-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.online-empty{line-height:1.4}.online-empty__title{font-size:1.8em;margin-bottom:.3em}.online-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.online-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-empty__buttons>*+*{margin-left:1em}.online-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.online-empty__button.focus{background:#fff;color:black}.online-empty__templates .online-empty-template:nth-child(2){opacity:.5}.online-empty__templates .online-empty-template:nth-child(3){opacity:.2}.online-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.online-empty-template__body{height:1.7em;width:70%}.online-empty-template+.online-empty-template{margin-top:1em}\n        </style>\n    ");

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'only_title',
        type: 'title',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_settings')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_ui_mode',
        type: 'select',
        values: {
          modern: Lampa.Lang.translate('nova_ui_modern'),
          classic: Lampa.Lang.translate('nova_ui_classic')
        },
        "default": 'modern'
      },
      field: {
        name: Lampa.Lang.translate('nova_ui_mode_name'),
        description: Lampa.Lang.translate('nova_ui_mode_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_quality',
        type: 'select',
        values: {
          'auto': Lampa.Lang.translate('nova_quality_auto'),
          '2160': '4K',
          '1080': '1080p',
          '720': '720p',
          '480': '480p'
        },
        "default": 'auto'
      },
      field: {
        name: Lampa.Lang.translate('nova_quality_name'),
        description: Lampa.Lang.translate('nova_quality_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_view',
        type: 'select',
        values: {
          list: Lampa.Lang.translate('nova_view_list'),
          grid: Lampa.Lang.translate('nova_view_grid')
        },
        "default": 'list'
      },
      field: {
        name: Lampa.Lang.translate('nova_view_name')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_focus_style',
        type: 'select',
        values: {
          ring: Lampa.Lang.translate('nova_focus_ring'),
          fill: Lampa.Lang.translate('nova_focus_fill')
        },
        "default": 'ring'
      },
      field: {
        name: Lampa.Lang.translate('nova_focus_name'),
        description: Lampa.Lang.translate('nova_focus_descr')
      },
      onChange: function () {
        novaApplyFocusStyle();
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_hero',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_hero_name'),
        description: Lampa.Lang.translate('nova_hero_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_fullscreen',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_fullscreen_name'),
        description: Lampa.Lang.translate('nova_fullscreen_descr')
      },
      onChange: function () {
        novaApplyFullScreen();
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_fade',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_fade_name'),
        description: Lampa.Lang.translate('nova_fade_descr')
      },
      onChange: function () {
        novaApplyEdgeFade();
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_hero_art',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_hero_art_name'),
        description: Lampa.Lang.translate('nova_hero_art_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_art_size',
        type: 'select',
        values: {
          auto: Lampa.Lang.translate('nova_art_auto'),
          w780: Lampa.Lang.translate('nova_art_780'),
          w1280: Lampa.Lang.translate('nova_art_1280'),
          original: Lampa.Lang.translate('nova_art_orig')
        },
        "default": 'auto'
      },
      field: {
        name: Lampa.Lang.translate('nova_art_size_name'),
        description: Lampa.Lang.translate('nova_art_size_descr')
      }
    });
    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_logo',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_logo_name'),
        description: Lampa.Lang.translate('nova_logo_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_voice_auto',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_voice_auto_name'),
        description: Lampa.Lang.translate('nova_voice_auto_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_similar_auto',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_similar_auto'),
        description: Lampa.Lang.translate('nova_similar_auto_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'nova_auto_switch',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('nova_auto_switch_name'),
        description: Lampa.Lang.translate('nova_auto_switch_descr')
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'nova_online',
      param: {
        name: 'lampac_continue_play',
        type: 'trigger',
        "default": true
      },
      field: {
        name: Lampa.Lang.translate('lampac_continue_enable'),
        description: Lampa.Lang.translate('lampac_continue_enable_descr')
      }
    });

    Lampa.Template.add('lampac_css', "\n        <style>\n        @charset 'UTF-8';.online-prestige{position:relative;-webkit-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em !important;height:4.4em !important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em !important;height:1.5em !important}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige__scan-file{position:absolute;bottom:0;left:0;right:0}.online-prestige__scan-file .broadcast__scan{margin:0}.online-prestige .online-prestige-split{font-size:.8em;margin:0 1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}.online-prestige--folder .online-prestige__footer{margin-top:.8em}.online-prestige-watched{padding:1em}.online-prestige-watched__icon>svg{width:1.5em;height:1.5em}.online-prestige-watched__body{padding-left:1em;padding-top:.1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.online-prestige-watched__body>span+span::before{content:' ● ';vertical-align:top;display:inline-block;margin:0 .5em}.online-prestige-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige-rate>svg{width:1.3em !important;height:1.3em !important}.online-prestige-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.online-empty{line-height:1.4}.online-empty__title{font-size:1.8em;margin-bottom:.3em}.online-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.online-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-empty__buttons>*+*{margin-left:1em}.online-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.online-empty__button.focus{background:#fff;color:black}.online-empty__templates .online-empty-template:nth-child(2){opacity:.5}.online-empty__templates .online-empty-template:nth-child(3){opacity:.2}.online-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.online-empty-template__body{height:1.7em;width:70%}.online-empty-template+.online-empty-template{margin-top:1em}\n        </style>\n    ");

    $('body').append(Lampa.Template.get('lampac_css', {}, true));
    $('body').append(NovaUI.css);
    novaApplyFocusStyle();
    novaApplyFullScreen();
    novaApplyEdgeFade();

    function resetTemplates() {
      Lampa.Template.add('lampac_prestige_full', "<div class=\"online-prestige online-prestige--full selector\">\n            <div class=\"online-prestige__img\">\n                <img alt=\"\">\n                <div class=\"online-prestige__loader\"></div>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__timeline\"></div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                    <div class=\"online-prestige__quality\">{quality}</div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_content_loading', "<div class=\"online-empty\">\n            <div class=\"broadcast__scan\"><div></div></div>\n\t\t\t\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template selector\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_does_not_answer', "<div class=\"online-empty\">\n            <div class=\"online-empty__title\">\n                #{lampac_balanser_dont_work}\n            </div>\n            <div class=\"online-empty__time\">\n                #{lampac_balanser_timeout}\n            </div>\n            <div class=\"online-empty__buttons\">\n                <div class=\"online-empty__button selector cancel\">#{cancel}</div>\n                <div class=\"online-empty__button selector change\">#{lampac_change_balanser}</div>\n            </div>\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_prestige_rate', "<div class=\"online-prestige-rate\">\n            <svg width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z\" fill=\"#fff\"></path>\n            </svg>\n            <span>{rate}</span>\n        </div>");
      Lampa.Template.add('lampac_prestige_folder', "<div class=\"online-prestige online-prestige--folder selector\">\n            <div class=\"online-prestige__folder\">\n                <svg viewBox=\"0 0 128 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect y=\"20\" width=\"128\" height=\"92\" rx=\"13\" fill=\"white\"></rect>\n                    <path d=\"M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z\" fill=\"white\" fill-opacity=\"0.23\"></path>\n                    <rect x=\"11\" y=\"8\" width=\"106\" height=\"76\" rx=\"13\" fill=\"white\" fill-opacity=\"0.51\"></rect>\n                </svg>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_prestige_watched', "<div class=\"online-prestige online-prestige-watched selector\">\n            <div class=\"online-prestige-watched__icon\">\n                <svg width=\"21\" height=\"21\" viewBox=\"0 0 21 21\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <circle cx=\"10.5\" cy=\"10.5\" r=\"9\" stroke=\"currentColor\" stroke-width=\"3\"/>\n                    <path d=\"M14.8477 10.5628L8.20312 14.399L8.20313 6.72656L14.8477 10.5628Z\" fill=\"currentColor\"/>\n                </svg>\n            </div>\n            <div class=\"online-prestige-watched__body\">\n                \n            </div>\n        </div>");
    }
    var button = "<div class=\"full-start__button selector view--online nova--button\" data-subtitle=\"".concat(manifst.name, " ").concat(manifst.version, "\">\n <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"4\" stroke=\"currentColor\" stroke-width=\"2\"></rect><path d=\"M10 9l5 3-5 3V9z\" fill=\"currentColor\"></path></svg>\n\n        <span>#{title_online}</span>\n    </div>");
    Lampa.Component.add('nova_video', component);
    resetTemplates();

    function addButton(e) {
    if (e.render.find('.nova--button').length) return;
    var btn = $(Lampa.Lang.translate(button));
    btn.on('hover:enter', function() {
        resetTemplates();
        Lampa.Component.add('nova_video', component);

        var id = Lampa.Utils.hash(e.movie.number_of_seasons ? e.movie.original_name : e.movie.original_title);
        var all = Lampa.Storage.get('clarification_search','{}');

        var isSeries = e.movie.number_of_seasons || e.movie.name;
        var continueEnabled = Lampa.Storage.field('lampac_continue_play') === true;
        var file_id = Lampa.Utils.hash(e.movie.number_of_seasons ? e.movie.original_name : e.movie.original_title);
        var watched = Lampa.Storage.cache('online_watched_last', 5000, {});
        var watchedData = watched[file_id];

        if (NovaUI.enabled()) {
          if (isSeries && watchedData && watchedData.balanser && watchedData.season && watchedData.episode) {
            var last_balanser_map = Lampa.Storage.cache('online_last_balanser', 3000, {});
            last_balanser_map[e.movie.id] = watchedData.balanser;
            Lampa.Storage.set('online_last_balanser', last_balanser_map);

            var resume_choice = Lampa.Storage.cache('online_choice_' + watchedData.balanser, 3000, {});
            if (!resume_choice[e.movie.id]) resume_choice[e.movie.id] = {};
            var resume_season = (parseInt(watchedData.season) || 1) - 1;
            if (resume_season < 0) resume_season = 0;
            resume_choice[e.movie.id].season = resume_season;
            if (watchedData.voice_name) resume_choice[e.movie.id].voice_name = watchedData.voice_name;
            Lampa.Storage.set('online_choice_' + watchedData.balanser, resume_choice);
          }

          Lampa.Activity.push({
            url: '',
            title: Lampa.Lang.translate('title_online'),
            component: 'nova_video',
            search: all[id] ? all[id] : e.movie.title,
            search_one: e.movie.title,
            search_two: e.movie.original_title,
            movie: e.movie,
            page: 1,
            clarification: all[id] ? true : false
          });
          return;
        }

        if (isSeries && continueEnabled && watchedData && watchedData.season && watchedData.episode) {
          var line = [];
          if (watchedData.balanser_name) line.push(watchedData.balanser_name);
          if (watchedData.voice_name) line.push(watchedData.voice_name);
          line.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + watchedData.season);
          line.push(Lampa.Lang.translate('torrent_serial_episode') + ' ' + watchedData.episode);

          Lampa.Select.show({
            title: Lampa.Lang.translate('lampac_continue_watch'),
            items: [
              { title: '▶ ' + Lampa.Lang.translate('lampac_continue_yes') + ' (' + line.join(' · ') + ')', continue_yes: true },
              { title: Lampa.Lang.translate('lampac_continue_no'), continue_no: true }
            ],
            onBack: function() {
              Lampa.Controller.toggle('content');
            },
            onSelect: function(sel) {
              Lampa.Select.close();

              if (sel.continue_yes && watchedData.balanser) {
                var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
                last_select_balanser[e.movie.id] = watchedData.balanser;
                Lampa.Storage.set('online_last_balanser', last_select_balanser);

                var choiceData = Lampa.Storage.cache('online_choice_' + watchedData.balanser, 3000, {});
                if (!choiceData[e.movie.id]) choiceData[e.movie.id] = {};
                var seasonIdx = (parseInt(watchedData.season) || 1) - 1;
                if (seasonIdx < 0) seasonIdx = 0;
                choiceData[e.movie.id].season = seasonIdx;
                if (watchedData.voice_name) choiceData[e.movie.id].voice_name = watchedData.voice_name;
                Lampa.Storage.set('online_choice_' + watchedData.balanser, choiceData);

                Lampa.Activity.push({
                  url: '',
                  title: Lampa.Lang.translate('title_online'),
                  component: 'nova_video',
                  search: all[id] ? all[id] : e.movie.title,
                  search_one: e.movie.title,
                  search_two: e.movie.original_title,
                  movie: e.movie,
                  page: 1,
                  clarification: all[id] ? true : false,
                  lampac_continue_episode: parseInt(watchedData.episode) || 1
                });
              } else {
                Lampa.Activity.push({
                  url: '',
                  title: Lampa.Lang.translate('title_online'),
                  component: 'nova_video',
                  search: all[id] ? all[id] : e.movie.title,
                  search_one: e.movie.title,
                  search_two: e.movie.original_title,
                  movie: e.movie,
                  page: 1,
                  clarification: all[id] ? true : false
                });
              }
            }
          });
        } else {
        Lampa.Activity.push({
            url: '',
            title: Lampa.Lang.translate('title_online'),
            component: 'nova_video',
            search: all[id] ? all[id] : e.movie.title,
            search_one: e.movie.title,
            search_two: e.movie.original_title,
            movie: e.movie,
            page: 1,
            clarification: all[id] ? true : false
        });
        }
    });

    if (Lampa.Storage.field('nova_button_first')) {
        var activity = Lampa.Activity.active().activity.render();
        var buttons_container = activity.find('.full-start-new__buttons');

        if (buttons_container.length) {

            buttons_container.prepend(btn);
        } else if (activity.find('.full-start__button').length) {

            activity.find('.full-start__button').first().before(btn);
        } else {
            e.render.before(btn);
        }
    } else {
        e.render.after(btn);
    }
}
    Lampa.Listener.follow('full', function(e) {
      if (e.type == 'complite') {
        addButton({
          render: e.object.activity.render().find('.view--torrent'),
          movie: e.data.movie
        });
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
      var balansers_sync = ["filmix", 'filmixtv', "fxapi", "rezka", "rhsprem", "lumex", "videodb", "collaps", "collaps-dash", "hdvb", "zetflix", "kodik", "ashdi", "kinoukr", "kinotochka", "remux", "iframevideo", "cdnmovies", "anilibria", "animedia", "animego", "animevost", "animebesst", "redheadsound", "alloha", "animelib", "moonanime", "kinopub", "vibix", "vdbmovies", "fancdn", "cdnvideohub", "vokino", "rc/filmix", "rc/fxapi", "rc/rhs", "vcdn", "videocdn", "mirage", "hydraflix","videasy","vidsrc","movpi","vidlink","twoembed","autoembed","smashystream","autoembed","rgshows", "pidtor", "videoseed", "iptvonline", "veoveo"];
      balansers_sync.forEach(function(name) {
        Lampa.Storage.sync('online_choice_' + name, 'object_object');
      });
      Lampa.Storage.sync('online_watched_last', 'object_object');
      Lampa.Storage.sync('online_last_balanser', 'object_object');
      Lampa.Storage.sync('nova_season_last', 'object_object');
      Lampa.Storage.sync('lampac_continue_play', 'bool');
    }
  }
  if (!window.nova_online_plugin) startPlugin();

})();
