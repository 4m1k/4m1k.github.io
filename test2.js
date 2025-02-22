function checkParser(url, title, parserObj) {
  return new Promise(function (resolve, reject) {
    console.log('Начало проверки парсера:', url);
    let protocol = location.protocol === "https:" ? "https://" : "http://";
    let apiKey = '';
    if (url === "spawn.pp.ua:59117") {
      apiKey = '2';
    }
    if (url === "79.137.204.8:9117") {
      apiKey = "777";
    }
    if (url === "jr.maxvol.pro") {
      protocol = "https://";
    } else {
      protocol = "http://";
    }
    let apiUrl = protocol + url + "/api/v2.0/indexers/status:healthy/results?apikey=" + apiKey;
    console.log('Формируется запрос к:', apiUrl);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.timeout = 3000;
    xhr.onload = function () {
      if (xhr.status === 200) {
        parserObj.title = `<span style="color: #64e364;">&#10004;&nbsp;&nbsp;${title}</span>`;
      } else {
        parserObj.title = `<span style="color: #ff2121;">&#10008;&nbsp;&nbsp;${title}</span>`;
      }
      console.log('Результат проверки для', url, ':', parserObj.title);
      resolve(parserObj);
    };
    xhr.onerror = function () {
      parserObj.title = `<span style="color: #ff2121;">&#10008;&nbsp;&nbsp;${title}</span>`;
      console.error('Ошибка при запросе к', url);
      resolve(parserObj);
    };
    xhr.ontimeout = function () {
      parserObj.title = `<span style="color: #ff2121;">&#10008;&nbsp;&nbsp;${title}</span>`;
      console.error('Таймаут запроса к', url);
      resolve(parserObj);
    };
    xhr.send();
  });
}

function selectParsers(parsers) {
  let promises = [];
  for (let i = 0; i < parsers.length; i++) {
    promises.push(checkParser(parsers[i].url, parsers[i].title, parsers[i]));
  }
  return Promise.all(promises);
}

function showParserMenu() {
  console.log('Вызов функции showParserMenu');
  let current = Lampa.Controller.enabled().name;
  let parsers = [];
  parsers.push({
    'title': "Lampa32",
    'url': '79.137.204.8:2601',
    'url_two': "jac_lampa32_ru",
    'jac_key': '',
    'jac_int': 'all',
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "ByLampa Jackett",
    'url': "79.137.204.8:9117",
    'url_two': "bylampa_jackett",
    'jac_key': "777",
    'jac_int': 'healthy',
    'jac_lang': 'df'
  });
  parsers.push({
    'title': "Jacred.xyz",
    'url': "jacred.xyz",
    'url_two': "jacred_xyz",
    'jac_key': '',
    'jac_int': "healthy",
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "Jacred Maxvol Pro",
    'url': "jr.maxvol.pro",
    'url_two': "jr_maxvol_pro",
    'jac_key': '',
    'jac_int': "healthy",
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "Jacred Pro",
    'url': "jacred.pro",
    'url_two': "jacred_my_to",
    'jac_key': '',
    'jac_int': 'all',
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': 'Viewbox',
    'url': "jacred.viewbox.dev",
    'url_two': 'jacred_viewbox_dev',
    'jac_key': "viewbox",
    'jac_int': "all",
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "JAOS My To Jacred",
    'url': "trs.my.to:9117",
    'url_two': "spawn_jacred",
    'jac_key': '',
    'jac_int': 'all',
    'jac_lang': 'lg'
  });
  parsers.push({
    'title': "Spawn Jackett",
    'url': "spawn.pp.ua:59117",
    'url_two': "spawn_jackett",
    'jac_key': '2',
    'jac_int': "healthy",
    'jac_lang': 'df'
  });
  parsers.push({
    'title': "Johnny Jacred",
    'url': "altjacred.duckdns.org",
    'url_two': "altjacred_duckdns_org",
    'jac_key': '',
    'jac_int': "all",
    'jac_lang': 'lg'
  });
  
  selectParsers(parsers).then(function (result) {
    console.log('Все проверки завершены. Результаты:', result);
    Lampa.Select.show({
      'title': "Меню смены парсера",
      'items': result.map(function (item) {
        return {
          'title': item.title,
          'url': item.url,
          'url_two': item.url_two,
          'jac_key': item.jac_key,
          'jac_int': item.jac_int,
          'jac_lang': item.jac_lang
        };
      }),
      'onBack': function () {
        Lampa.Controller.toggle(current);
      },
      'onSelect': function (selected) {
        Lampa.Storage.set('jackett_url', selected.url);
        Lampa.Storage.set('jackett_urltwo', selected.url_two);
        Lampa.Storage.set("jackett_key", selected.jac_key);
        Lampa.Storage.set("jackett_interview", selected.jac_int);
        Lampa.Storage.set("parse_lang", selected.jac_lang);
        Lampa.Storage.set("parse_in_search", true);
        Lampa.Controller.toggle(current);
        let activity = Lampa.Storage.get('activity');
        setTimeout(function () {
          window.history.back();
        }, 1000);
        setTimeout(function () {
          Lampa.Activity.push(activity);
        }, 2000);
      }
    });
  }).catch(function (error) {
    console.error("Ошибка при формировании меню парсеров:", error);
  });
}
