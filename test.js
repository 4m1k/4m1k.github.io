(function() {
  'use strict';

  var Defined = {
    api: 'lampac',
    localhost: 'http://showwwy.com/', // Можно изменить на домен второго кода, если нужно
    apn: ''
  };

  var unic_id = Lampa.Storage.get('lampac_unic_id', '');
  if (!unic_id) {
    unic_id = Lampa.Utils.uid(8).toLowerCase();
    Lampa.Storage.set('lampac_unic_id', unic_id);
  }

  // Проверка типа подключения (из второго кода)
  var rchtype = 'web';
  var check = function(good) {
    rchtype = Lampa.Platform.is('android') ? 'apk' : good ? 'cors' : 'web';
  };
  if (Lampa.Platform.is('android') || Lampa.Platform.is('tizen')) check(true);
  else {
    var net = new Lampa.Reguest();
    net.silent('https://github.com/', function() {
      check(true);
    }, function() {
      check(false);
    }, false, {
      dataType: 'text'
    });
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
    var initialized = false;
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

    // Список балансеров из второго кода
    var balansers_with_search = [
      'eneyida', 'seasonvar', 'lostfilmhd', 'kinotochka', 'kinopub', 'kinoprofi', 'kinokrad', 'kinobase', 'filmix', 'filmixtv', 
      'redheadsound', 'animevost', 'animego', 'animedia', 'animebesst', 'anilibria', 'rezka', 'rhsprem', 'kodik', 'remux', 'animelib', 
      'kinoukr'
    ];

    function account(url) {
      url = url + '';
      if (url.indexOf('account_email=') == -1) {
        var email = Lampa.Storage.get('account_email');
        if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));
      }
      if (url.indexOf('uid=') == -1) {
        var uid = Lampa.Storage.get('lampac_unic_id', '');
        if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));
      }
      if (url.indexOf('token=') == -1) {
        var token = '';
        if (token != '') url = Lampa.Utils.addUrlComponent(url, 'token=');
      }
      url = Lampa.Utils.addUrlComponent(url, 'ab_token=' + Lampa.Storage.get('token'));
      return url;
    }

    this.initialize = function() {
      var _this = this;
      this.loading(true);
      filter.onSearch = function(value) {
        Lampa.Activity.replace({
          search: value,
          clarification: true
        });
      };
      filter.onBack = function() {
        this.start();
      };
      filter.render().find('.selector').on('hover:enter', function() {
        clearInterval(balanser_timer);
      });
      filter.render().find('.filter--search').appendTo(filter.render().find('.torrent-filter'));
      filter.onSelect = function(type, a, b) {
        if (type == 'filter') {
          if (a.reset) {
            this.replaceChoice({
              season: 0,
              voice: 0,
              voice_url: '',
              voice_name: ''
            });
            setTimeout(function() {
              Lampa.Select.close();
              Lampa.Activity.replace({
                clarification: 0
              });
            }, 10);
          } else {
            var url = filter_find[a.stype][b.index].url;
            var choice = _this.getChoice();
            if (a.stype == 'voice') {
              choice.voice_name = filter_find.voice[b.index].title;
              choice.voice_url = url;
            }
            choice[a.stype] = b.index;
            this.saveChoice(choice);
            this.reset();
            this.request(url);
            setTimeout(Lampa.Select.close, 10);
          }
        } else if (type == 'sort') {
          Lampa.Select.close();
          object.lampac_custom_select = a.source;
          this.changeBalanser(a.source);
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
          return balanser.slice(0, b.length) == b;
        })) {
          filter.render().find('.filter--search').addClass('hide');
        }
        this.search();
      })["catch"](function(e) {
        this.noConnectToServer(e);
      });
    };

    this.rch = function(json, noreset) {
      var _this2 = this;
      var load = function load() {
        if (hubConnection) {
          clearTimeout(hub_timer);
          hubConnection.stop();
          hubConnection = null;
        }
        hubConnection = new signalR.HubConnectionBuilder().withUrl(json.ws).build();
        hubConnection.start().then(function() {
          window.rch.Registry('https://abmsx.tech', hubConnection, function() {
            if (!noreset) _this2.find();
            else noreset();
          });
        })["catch"](function(err) {
          console.log('RCH', err.toString());
          return console.error(err.toString());
        });
        if (json.keepalive > 0) {
          hub_timer = setTimeout(function() {
            hubConnection.stop();
            hubConnection = null;
          }, 1000 * json.keepalive);
        }
      };
      if (typeof signalR == 'undefined') {
        Lampa.Utils.putScript(["https://abmsx.tech/signalr-6.0.25_es5.js"], function() {}, false, function() {
          load();
        }, true);
      } else load();
    };

    this.externalids = function() {
      return new Promise(function(resolve, reject) {
        if (!object.movie.imdb_id || !object.movie.kinopoisk_id) {
          var query = [];
          query.push('id=' + object.movie.id);
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
      query.push('id=' + object.movie.id);
      if (object.movie.imdb_id) query.push('imdb_id=' + (object.movie.imdb_id || ''));
      if (object.movie.kinopoisk_id) query.push('kinopoisk_id=' + (object.movie.kinopoisk_id || ''));
      query.push('title=' + encodeURIComponent(object.clarification ? object.search : object.movie.title || object.movie.name));
      query.push('original_title=' + encodeURIComponent(object.movie.original_title || object.movie.original_name));
      query.push('serial=' + (object.movie.name ? 1 : 0));
      query.push('original_language=' + (object.movie.original_language || ''));
      query.push('year=' + ((object.movie.release_date || object.movie.first_air_date || '0000') + '').slice(0, 4));
      query.push('source=' + card_source);
      query.push('rchtype=' + rchtype); // Добавляем rchtype из второго кода
      query.push('clarification=' + (object.clarification ? 1 : 0));
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

    this.startSource = function(json) {
      return new Promise(function(resolve, reject) {
        json.forEach(function(j) {
          var name = j.balanser || j.name.split(' ')[0].toLowerCase();
          sources[name] = {
            url: j.url,
            name: j.name,
            show: typeof j.show == 'undefined' ? true : j.show
          };
        });
        filter_sources = Lampa.Arrays.getKeys(sources);
        if (filter_sources.length) {
          var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
          balanser = last_select_balanser[object.movie.id] || Lampa.Storage.get('online_balanser', filter_sources[0]);
          if (!sources[balanser]) balanser = filter_sources[0];
          if (!sources[balanser].show && !object.lampac_custom_select) balanser = filter_sources[0];
          source = sources[balanser].url;
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
          if (json.accsdb) return reject(json);
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
        var fin = function fin(call) {
          network.timeout(3000);
          network.silent(account(url), function(json) {
            life_wait_times++;
            filter_sources = [];
            sources = {};
            json.online.forEach(function(j) {
              var name = j.balanser || j.name.split(' ')[0].toLowerCase();
              sources[name] = {
                url: j.url,
                name: j.name,
                show: typeof j.show == 'undefined' ? true : j.show
              };
            });
            filter_sources = Lampa.Arrays.getKeys(sources);
            filter.set('sort', filter_sources.map(function(e) {
              return {
                title: sources[e].name,
                source: e,
                selected: e == balanser,
                ghost: !sources[e].show
              };
            }));
            filter.chosen('sort', [sources[balanser] ? sources[balanser].name : balanser]);
            gou(json);
            var lastb = _this3.getLastChoiceBalanser();
            if (life_wait_times > 15 || json.ready) {
              filter.render().find('.lampac-balanser-loader').remove();
              gou(json, true);
            } else if (!red && sources[lastb] && sources[lastb].show) {
              gou(json, true);
              life_wait_timer = setTimeout(fin, 1000);
            } else {
              life_wait_timer = setTimeout(fin, 1000);
            }
          }, function() {
            life_wait_times++;
            if (life_wait_times > 15) {
              reject();
            } else {
              life_wait_timer = setTimeout(fin, 1000);
            }
          });
        };
        fin();
      });
    };

    this.createSource = function() {
      var _this4 = this;
      return new Promise(function(resolve, reject) {
        var url = _this4.requestParams(Defined.localhost + 'lite/events?life=true');
        network.timeout(15000);
        network.silent(account(url), function(json) {
          if (json.accsdb) return reject(json);
          if (json.life) {
            _this4.memkey = json.memkey;
            filter.render().find('.filter--sort').append('');
            _this4.lifeSource().then(_this4.startSource).then(resolve)["catch"](reject);
          } else {
            _this4.startSource(json).then(resolve)["catch"](reject);
          }
        }, reject);
      });
    };

    this.doesNotAnswer = function(er) {
      var _this9 = this;
      this.reset();
      var html = Lampa.Template.get('lampac_does_not_answer', {
        balanser: balanser
      });
      if (er && er.accsdb) html.find('.online-empty__title').html(er.msg);
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

    this.start = function() {
      if (Lampa.Activity.active().activity !== this.activity) return;
      if (!initialized) {
        initialized = true;
        this.initialize();
      }
      Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
      Lampa.Controller.add('content', {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render(), files.render());
          Lampa.Controller.collectionFocus(last || false, scroll.render());
        },
        gone: function gone() {
          clearTimeout(balanser_timer);
        },
        up: function up() {
          if (Navigator.canmove('up')) {
            Navigator.move('up');
          } else Lampa.Controller.toggle('head');
        },
        down: function down() {
          Navigator.move('down');
        },
        right: function right() {
          if (Navigator.canmove('right')) Navigator.move('right');
          else filter.show(Lampa.Lang.translate('title_filter'), 'filter');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');
          else Lampa.Controller.toggle('menu');
        },
        back: this.back.bind(this)
      });
      Lampa.Controller.toggle('content');
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
      number_of_requests++;
      if (number_of_requests < 10) {
        network["native"](account(url), this.parse.bind(this), this.doesNotAnswer.bind(this), false, {
          dataType: 'text'
        });
        clearTimeout(number_of_requests_timer);
        number_of_requests_timer = setTimeout(function() {
          number_of_requests = 0;
        }, 4000);
      } else this.empty();
    };

    this.parse = function(str) {
      var json = Lampa.Arrays.decodeJson(str, {});
      if (Lampa.Arrays.isObject(str) && str.rch) json = str;
      if (json.rch) return this.rch(json);
      try {
        var items = this.parseJsonDate(str, '.videos__item');
        var buttons = this.parseJsonDate(str, '.videos__button');
        if (items.length == 1 && items[0].method == 'link' && !items[0].similar) {
          filter_find.season = items.map(function(s) {
            return {
              title: s.text,
              url: s.url
            };
          });
          this.replaceChoice({
            season: 0
          });
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
              var find_voice_url = buttons.find(function(v) {
                return v.url == select_voice_url;
              });
              var find_voice_name = buttons.find(function(v) {
                return v.text == select_voice_name;
              });
              var find_voice_active = buttons.find(function(v) {
                return v.active;
              });
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
              var season = filter_find.season[select_season];
              if (!season) season = filter_find.season[0];
              console.log('Lampac', 'go to season', season);
              this.request(season.url);
            }
          } else {
            this.doesNotAnswer(json);
          }
        }
      } catch (e) {
        console.log('Lampac', 'error', e.stack);
        this.doesNotAnswer(e);
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
              first.quality = json_call.quality || item.qualitys;
              first.subtitles = json.subtitles;
              _this5.appendAPN(first);
              _this5.setDefaultQuality(first);
              if (item.season) {
                videos.forEach(function(elem) {
                  var cell = _this5.toPlayElement(elem);
                  if (elem == item) cell.url = json.url;
                  else {
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
                              cell.subtitles = stream.subtitles;
                              _this5.appendAPN(cell);
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
                  _this5.appendAPN(cell);
                  _this5.setDefaultQuality(cell);
                  playlist.push(cell);
                });
              } else {
                playlist.push(first);
              }
              if (playlist.length > 1) first.playlist = playlist;
              if (first.url) {
                Lampa.Player.play(first);
                Lampa.Player.playlist(playlist);
                item.mark();
                this5.updateBalanser(balanser);
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

    this.destroy = function() {
      network.clear();
      this.clearImages();
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
  }

  function startPlugin() {
    window.lampac_plugin = true;
    var manifst = {
      type: 'video',
      version: '2.1', // Объединенный номер версии
      name: '4m1K Showy',
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
        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'lampac',
          search: object.title,
          movie: object,
          page: 1
        });
      }
    };
    Lampa.Manifest.plugins = manifst;

    Lampa.Lang.add({
      lampac_watch: { //
        ru: 'Онлайн 4am1k Showy',
        en: 'Online 4am1k Showy',
        uk: 'Онлайн 4am1k Showy',
        zh: '在线观看 4am1k Showy'
      }
    });

    Lampa.Component.add('lampac', component);

    function addButton(e) {
      if (e.render.find('.lampac--button').length) return;
      var btn = $(Lampa.Lang.translate(button));
      btn.on('hover:enter', function() {
        resetTemplates();
        Lampa.Component.add('lampac', component);
        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'lampac',
          search: e.movie.title,
          movie: e.movie,
          page: 1
        });
      });
      e.render.after(btn);
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

    if (Lampa.Manifest.app_digital >= 177) {
      var balansers_sync = ["filmix", "fxapi", "rezka", "rhsprem", "lumex", "videodb", "collaps", "hdvb", "zetflix", "kodik", "ashdi", "kinoukr", "kinotochka", "remux", "iframevideo", "cdnmovies", "anilibria", "animedia", "animego", "animevost", "animebesst", "redheadsound", "animelib", "moonanime", "kinopub", "vibix", "vdbmovies", "fancdn", "cdnvideohub", "vokino"];
      balansers_sync.forEach(function(name) {
        Lampa.Storage.sync('online_choice_' + name, 'object_object');
      });
      Lampa.Storage.sync('online_watched_last', 'object_object');
    }

    if (!window.lampac_plugin) startPlugin();
  }
})();
