(function(){
  'use strict';

  // Если плагин уже загружен, ничего не делаем
  if(window.KP_PLUGIN) return;

  // Основные переменные плагина
  var KP_PLUGIN = {};
  var network = new Lampa.Reguest();
  var cache = {};
  var total_cnt = 0;
  var proxy_cnt = 0;
  var good_cnt = 0;
  var CACHE_SIZE = 100;
  var CACHE_TIME = 1000 * 60 * 60;
  var SOURCE_NAME = 'KP';
  var SOURCE_TITLE = 'KP';
  // Жёстко задаём id страны «Россия»
  var rus_id = 34;

  // Функция GET с поддержкой прокси
  function get(method, oncomplite, onerror){
    var use_proxy = total_cnt >= 10 && good_cnt > total_cnt / 2;
    if(!use_proxy) total_cnt++;
    var kp_prox = 'https://cors.kp556.workers.dev:8443/';
    var url = 'https://kinopoiskapiunofficial.tech/' + method;
    network.timeout(15000);
    network.silent((use_proxy ? kp_prox : '') + url, function(json){
      oncomplite(json);
    }, function(a, c){
      use_proxy = !use_proxy && (proxy_cnt < 10 || good_cnt > proxy_cnt/2);
      if(use_proxy && (a.status == 429 || (a.status == 0 && a.statusText !== 'timeout'))){
         proxy_cnt++;
         network.timeout(15000);
         network.silent(kp_prox + url, function(json){
            good_cnt++;
            oncomplite(json);
         }, onerror, false, { headers: {'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'}});
      } else onerror(a,c);
    }, false, { headers: {'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'} });
  }

  function getComplite(method, oncomplite){
    get(method, oncomplite, function(){ oncomplite(null); });
  }

  function getCache(key){
    var res = cache[key];
    if(res){
      var cache_timestamp = new Date().getTime() - CACHE_TIME;
      if(res.timestamp > cache_timestamp) return res.value;
      for(var k in cache){
        if(!(cache[k] && cache[k].timestamp > cache_timestamp)) delete cache[k];
      }
    }
    return null;
  }

  function setCache(key, value){
    var timestamp = new Date().getTime();
    cache[key] = { timestamp: timestamp, value: value };
  }

  function getFromCache(method, oncomplite, onerror){
    var json = getCache(method);
    if(json){
      setTimeout(function(){ oncomplite(json, true); }, 10);
    } else {
      get(method, oncomplite, onerror);
    }
  }

  function clear(){
    network.clear();
  }

  // Функции преобразования элементов API в формат Lampa
  function convertElem(elem){
    var type = (!elem.type || elem.type === 'FILM' || elem.type === 'VIDEO') ? 'movie' : 'tv';
    var kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
    var title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
    var original_title = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
    var genres = [];
    if(elem.genres && Array.isArray(elem.genres)){
      genres = elem.genres.map(function(e){
        return { id: 0, name: e.genre, url: '' };
      });
    }
    return {
      source: SOURCE_NAME,
      id: SOURCE_NAME + '_' + kinopoisk_id,
      type: type,
      title: title,
      original_title: original_title,
      overview: elem.description || elem.shortDescription || '',
      img: elem.posterUrlPreview || elem.posterUrl || '',
      background_image: elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
      vote_average: parseFloat(elem.rating) || parseFloat(elem.ratingKinopoisk) || 0,
      vote_count: elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
      kinopoisk_id: kinopoisk_id,
      genres: genres,
      production_countries: elem.countries ? elem.countries.map(function(c){ return { name: c.country }; }) : [],
      year: elem.year || null
    };
  }

  function convertSeason(season){
    var episodes = season.episodes || [];
    episodes = episodes.map(function(e){
      return {
        season_number: e.seasonNumber,
        episode_number: e.episodeNumber,
        name: e.nameRu || e.nameEn || ('S' + e.seasonNumber + ' / Episode ' + e.episodeNumber),
        overview: e.synopsis || '',
        air_date: e.releaseDate
      };
    });
    return {
      season_number: season.number,
      episode_count: episodes.length,
      episodes: episodes,
      name: 'Сезон ' + season.number,
      overview: ''
    };
  }

  function convertPerson(person){
    return {
      id: person.staffId,
      name: person.nameRu || person.nameEn || '',
      url: '',
      img: person.posterUrl || '',
      character: person.description || '',
      job: Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
    };
  }

  // Функция получения списка элементов по категории
  function getList(method, params, oncomplite, onerror){
    var url = method;
    if(params.query){
      var keyword = encodeURIComponent(params.query);
      url = Lampa.Utils.addUrlComponent(url, 'keyword=' + keyword);
    }
    var page = params.page || 1;
    url = Lampa.Utils.addUrlComponent(url, 'page=' + page);
    getFromCache(url, function(json, cached){
      var items = [];
      if(json.items && json.items.length) items = json.items;
      else if(json.films && json.films.length) items = json.films;
      else if(json.results && json.results.length) items = json.results;
      if(!cached && items.length) setCache(url, json);
      var results = items.map(convertElem);
      results = results.filter(function(elem){ return !elem.adult; });
      var total_pages = json.pagesCount || json.totalPages || json.total_pages || 1;
      oncomplite({ results: results, page: page, total_pages: total_pages });
    }, onerror);
  }

  // Получение детальной информации по id
  function _getById(id, params, oncomplite, onerror){
    var url = 'api/v2.2/films/' + id;
    var film = getCache(url);
    if(film){
      setTimeout(function(){ oncomplite(convertElem(film)); }, 10);
    } else {
      get(url, function(film){
        if(film.kinopoiskId){
          var type = (!film.type || film.type === 'FILM' || film.type === 'VIDEO') ? 'movie' : 'tv';
          if(type === 'tv'){
            getComplite('api/v2.2/films/' + id + '/seasons', function(seasons){
              film.seasons_obj = seasons;
              getComplite('api/v2.2/films/' + id + '/distributions', function(distributions){
                film.distributions_obj = distributions;
                getComplite('/api/v1/staff?filmId=' + id, function(staff){
                  film.staff_obj = staff;
                  getComplite('api/v2.1/films/' + id + '/sequels_and_prequels', function(sequels){
                    film.sequels_obj = sequels;
                    getComplite('api/v2.2/films/' + id + '/similars', function(similars){
                      film.similars_obj = similars;
                      setCache(url, film);
                      oncomplite(convertElem(film));
                    });
                  });
                });
              });
            });
          } else {
            setCache(url, film);
            oncomplite(convertElem(film));
          }
        } else onerror();
      }, onerror);
    }
  }

  function getById(id, params, oncomplite, onerror){
    _getById(id, params, oncomplite, onerror);
  }

  // Основной раздел – сбор нескольких частей
  function main(params, oncomplite, onerror){
    params = params || {};
    var parts_limit = 5;
    var parts_data = [
      function(call){
        getList('api/v2.2/films/top?type=TOP_100_POPULAR_FILMS', params, function(json){
          json.title = Lampa.Lang.translate('title_now_watch');
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films/top?type=TOP_250_BEST_FILMS', params, function(json){
          json.title = Lampa.Lang.translate('title_top_movie');
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&type=FILM', params, function(json){
          json.title = 'Популярные фильмы';
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=FILM', params, function(json){
          json.title = 'Популярные российские фильмы';
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=TV_SERIES', params, function(json){
          json.title = 'Популярные российские сериалы';
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=MINI_SERIES', params, function(json){
          json.title = 'Популярные российские мини-сериалы';
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&type=TV_SHOW', params, function(json){
          json.title = 'Популярные телешоу';
          call(json);
        }, call);
      }
    ];
    function loadPart(partLoaded, partEmpty){
      Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
    }
    loadPart(oncomplite, onerror);
  }

  // Категории – похожая логика, добавляем российские категории
  function category(params, oncomplite, onerror){
    params = params || {};
    var parts_limit = 5;
    var parts_data = [
      function(call){
        call({
          results: Lampa.Favorite.continues(params.url) || [],
          title: params.url == 'tv' ? Lampa.Lang.translate('title_continue') : Lampa.Lang.translate('title_watched')
        });
      },
      function(call){
        call({
          results: Lampa.Arrays.shuffle(Lampa.Recomends.get(params.url)).slice(0,19) || [],
          title: Lampa.Lang.translate('title_recomend_watch')
        });
      },
      // Российские категории
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=FILM', params, function(json){
          json.title = 'Популярные российские фильмы';
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=TV_SERIES', params, function(json){
          json.title = 'Популярные российские сериалы';
          call(json);
        }, call);
      },
      function(call){
        getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=MINI_SERIES', params, function(json){
          json.title = 'Популярные российские мини-сериалы';
          call(json);
        }, call);
      }
    ];
    function loadPart(partLoaded, partEmpty){
      Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
    }
    loadPart(oncomplite, onerror);
  }

  // Детальная карточка
  function full(params, oncomplite, onerror){
    params = params || {};
    var kinopoisk_id = '';
    if(params.card && params.card.source === SOURCE_NAME){
      if(params.card.kinopoisk_id) kinopoisk_id = params.card.kinopoisk_id;
      else if(String(params.card.id).indexOf(SOURCE_NAME + '_') === 0){
         kinopoisk_id = String(params.card.id).substring(SOURCE_NAME.length + 1);
         params.card.kinopoisk_id = kinopoisk_id;
      }
    }
    if(kinopoisk_id){
      getById(kinopoisk_id, params, function(json){
         var status = new Lampa.Status(4);
         status.onComplite = oncomplite;
         status.append('movie', json);
         status.append('persons', json.persons);
         status.append('collection', json.collection);
         status.append('simular', json.simular);
      }, onerror);
    } else onerror();
  }

  // Поиск
  function search(params, oncomplite, onerror){
    params = params || {};
    var title = decodeURIComponent(params.query || '');
    var status = new Lampa.Status(1);
    status.onComplite = function(data){
      var items = [];
      if(data.query && data.query.results){
         var tmp = data.query.results.filter(function(elem){
           return elem.title.toLowerCase().indexOf(title.toLowerCase()) !== -1 ||
                  elem.original_title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
         });
         if(tmp.length && tmp.length !== data.query.results.length){
           data.query.results = tmp;
           data.query.more = true;
         }
         var movie = Object.assign({}, data.query);
         movie.results = data.query.results.filter(function(elem){ return elem.type === 'movie'; });
         movie.title = Lampa.Lang.translate('menu_movies');
         movie.type = 'movie';
         if(movie.results.length) items.push(movie);
         var tv = Object.assign({}, data.query);
         tv.results = data.query.results.filter(function(elem){ return elem.type === 'tv'; });
         tv.title = Lampa.Lang.translate('menu_tv');
         tv.type = 'tv';
         if(tv.results.length) items.push(tv);
      }
      oncomplite(items);
    };
    getList('api/v2.1/films/search-by-keyword', params, function(json){
       status.append('query', json);
    }, status.error.bind(status));
  }

  // Discovery (для раздела поиска)
  function discovery(){
    return {
      title: SOURCE_TITLE,
      search: search,
      params: {
         align_left: true,
         object: { source: SOURCE_NAME }
      },
      onMore: function(params){
         Lampa.Activity.push({
           url: 'api/v2.1/films/search-by-keyword',
           title: Lampa.Lang.translate('search') + ' - ' + params.query,
           component: 'category_full',
           page: 1,
           query: encodeURIComponent(params.query),
           source: SOURCE_NAME
         });
      },
      onCancel: network.clear.bind(network)
    };
  }

  // Персона
  function person(params, oncomplite, onerror){
    params = params || {};
    var status = new Lampa.Status(1);
    status.onComplite = function(data){
      var result = {};
      if(data.query){
         var p = data.query;
         result.person = {
           id: p.personId,
           name: p.nameRu || p.nameEn || '',
           url: '',
           img: p.posterUrl || '',
           gender: p.sex === 'MALE' ? 2 : p.sex === 'FEMALE' ? 1 : 0,
           birthday: p.birthday,
           place_of_birth: p.birthplace,
           deathday: p.death,
           place_of_death: p.deathplace,
           known_for_department: p.profession || '',
           biography: (p.facts || []).join(' ')
         };
         var director_films = [];
         var director_map = {};
         var actor_films = [];
         var actor_map = {};
         if(p.films){
           p.films.forEach(function(f){
              if(f.professionKey === 'DIRECTOR' && !director_map[f.filmId]){
                 director_map[f.filmId] = true;
                 director_films.push(convertElem(f));
              } else if(f.professionKey === 'ACTOR' && !actor_map[f.filmId]){
                 actor_map[f.filmId] = true;
                 actor_films.push(convertElem(f));
              }
           });
         }
         var knownFor = [];
         if(director_films.length){
           director_films.sort(function(a,b){ return b.vote_average - a.vote_average || a.id - b.id; });
           knownFor.push({ name: Lampa.Lang.translate('title_producer'), credits: director_films });
         }
         if(actor_films.length){
           actor_films.sort(function(a,b){ return b.vote_average - a.vote_average || a.id - b.id; });
           knownFor.push({ name: Lampa.Lang.translate(p.sex === 'FEMALE' ? 'title_actress' : 'title_actor'), credits: actor_films });
         }
         result.credits = { knownFor: knownFor };
      }
      oncomplite(result);
    };
    var url = 'api/v1/staff/' + params.id;
    getFromCache(url, function(json, cached){
      if(!cached && json.personId) setCache(url, json);
      status.append('query', json);
    }, status.error.bind(status));
  }

  // Экспонируем методы плагина
  KP_PLUGIN.SOURCE_NAME = SOURCE_NAME;
  KP_PLUGIN.SOURCE_TITLE = SOURCE_TITLE;
  KP_PLUGIN.main = main;
  KP_PLUGIN.menu = menu;
  KP_PLUGIN.full = full;
  KP_PLUGIN.list = getList;
  KP_PLUGIN.category = category;
  KP_PLUGIN.clear = clear;
  KP_PLUGIN.person = person;
  KP_PLUGIN.seasons = function(tv, from, oncomplite){ seasons(tv, from, oncomplite); };
  KP_PLUGIN.menuCategory = function(params, oncomplite){ oncomplite([]); };
  KP_PLUGIN.discovery = discovery;

  // Функция добавления плагина в Lampa
  function startPlugin()
    Lampa.Api.sources[KP_PLUGIN.SOURCE_NAME] = KP_PLUGIN;
    Object.defineProperty(Lampa.Api.sources, KP_PLUGIN.SOURCE_NAME, {
      get: function(){ return KP_PLUGIN; }
    });
    var sources = {};
    if(Lampa.Params.values && Lampa.Params.values['source']){
      sources = Object.assign({}, Lampa.Params.values['source']);
      sources[KP_PLUGIN.SOURCE_NAME] = KP_PLUGIN.SOURCE_TITLE;
    } else {
      sources[KP_PLUGIN.SOURCE_NAME] = KP_PLUGIN.SOURCE_TITLE;
    }
    Lampa.Params.select('source', sources, 'tmdb');
  }
  if(window.appready) startPlugin();
  else Lampa.Listener.follow('app', function(e){ if(e.type === 'ready') startPlugin(); });

  // Функция добавления кнопки «Кинопоиск» в меню
  function addKPMenuButton(){
    var ITEM_TV_SELECTOR = '[data-action="tv"]';
    var ITEM_MOVE_TIMEOUT = 2000;
    var moveItemAfter = function(item, after){
      return setTimeout(function(){
        $(item).insertAfter($(after));
      }, ITEM_MOVE_TIMEOUT);
    };
    // Новая иконка, приведённая к размеру 1em
    var iconKP = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 192 192" fill="none"><path d="M96.5 20L66.1 75.733V20H40.767v152H66.1v-55.733L96.5 172h35.467C116.767 153.422 95.2 133.578 80 115c28.711 16.889 63.789 35.044 92.5 51.933v-30.4C148.856 126.4 108.644 115.133 85 105c23.644 3.378 63.856 7.889 87.5 11.267v-30.4L85 90c27.022-11.822 60.478-22.711 87.5-34.533v-30.4C143.789 41.956 108.711 63.11 80 80l51.967-60z" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    var button = $(`
      <li class="menu__item selector" data-action="kp">
        <div class="menu__ico">${iconKP}</div>
        <div class="menu__text">Кинопоиск</div>
      </li>
    `);
    button.on('hover:enter', function(){
      console.log('Нажата кнопка Кинопоиск');
      Lampa.Select.show({
         title: 'Кинопоиск',
         items: [
           { title: 'Популярные Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_100_POPULAR_FILMS' } },
           { title: 'Топ Фильмы', data: { url: 'api/v2.2/films/top?type=TOP_250_BEST_FILMS' } },
           { title: 'Популярные российские фильмы', data: { url: 'api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=FILM' } },
           { title: 'Популярные российские сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=TV_SERIES' } },
           { title: 'Популярные российские мини-сериалы', data: { url: 'api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=MINI_SERIES' } },
           { title: 'Популярные телешоу', data: { url: 'api/v2.2/films?order=NUM_VOTE&type=TV_SHOW' } }
         ],
         onSelect: function(item){
            console.log('[Выбран пункт:]', item);
            Lampa.Activity.push({
              url: item.data.url,
              title: item.title,
              component: 'category_full',
              source: KP_PLUGIN.SOURCE_NAME,
              card_type: true,
              page: 1,
              onBack: function(){
                 Lampa.Controller.toggle("menu");
              }
            });
         },
         onBack: function(){
            Lampa.Controller.toggle("menu");
         }
      });
      console.log('Окно выбора категорий открыто');
    });
    var menu = Lampa.Menu.render();
    var tvItem = menu.find(ITEM_TV_SELECTOR);
    if(tvItem.length){
       tvItem.after(button);
       console.log('Кнопка Кинопоиск добавлена после элемента TV');
    } else {
       menu.append(button);
       console.log('Кнопка Кинопоиск добавлена в конец меню');
    }
  }
  
  if(window.appready) addKPMenuButton();
  else Lampa.Listener.follow('app', function(e){
    if(e.type === 'ready') addKPMenuButton();
  });
  
  window.KP_PLUGIN = KP_PLUGIN;
})();
