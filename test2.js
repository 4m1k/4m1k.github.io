(function () {
  'use strict';

  // Определяем параметры плагина
  var plugin = {
    component: 'iptv_plugin',
    name: 'NEW-TON IPTV',
      icon: "<svg height=\"244\" viewBox=\"0 0 260 244\" xmlns=\"http://www.w3.org/2000/svg\" style=\"fill-rule:evenodd;\" fill=\"currentColor\"><path d=\"M259.5 47.5v114c-1.709 14.556-9.375 24.723-23 30.5a2934.377 2934.377 0 0 1-107 1.5c-35.704.15-71.37-.35-107-1.5-13.625-5.777-21.291-15.944-23-30.5v-115c1.943-15.785 10.61-25.951 26-30.5a10815.71 10815.71 0 0 1 208 0c15.857 4.68 24.523 15.18 26 31.5zm-230-13a4963.403 4963.403 0 0 0 199 0c5.628 1.128 9.128 4.462 10.5 10 .667 40 .667 80 0 120-1.285 5.618-4.785 8.785-10.5 9.5-66 .667-132 .667-198 0-5.715-.715-9.215-3.882-10.5-9.5-.667-40-.667-80 0-120 1.35-5.18 4.517-8.514 9.5-10z\"/><path d=\"M70.5 71.5c17.07-.457 34.07.043 51 1.5 5.44 5.442 5.107 10.442-1 15-5.991.5-11.991.666-18 .5.167 14.337 0 28.671-.5 43-3.013 5.035-7.18 6.202-12.5 3.5a11.529 11.529 0 0 1-3.5-4.5 882.407 882.407 0 0 1-.5-42c-5.676.166-11.343 0-17-.5-4.569-2.541-6.069-6.375-4.5-11.5 1.805-2.326 3.972-3.992 6.5-5zM137.5 73.5c4.409-.882 7.909.452 10.5 4a321.009 321.009 0 0 0 16 30 322.123 322.123 0 0 0 16-30c2.602-3.712 6.102-4.879 10.5-3.5 5.148 3.334 6.314 7.834 3.5 13.5a1306.032 1306.032 0 0 0-22 43c-5.381 6.652-10.715 6.652-16 0a1424.647 1424.647 0 0 0-23-45c-1.691-5.369-.191-9.369 4.5-12zM57.5 207.5h144c7.788 2.242 10.288 7.242 7.5 15a11.532 11.532 0 0 1-4.5 3.5c-50 .667-100 .667-150 0-6.163-3.463-7.496-8.297-4-14.5 2.025-2.064 4.358-3.398 7-4z\"/></svg>"
  };

  // Глобальные переменные
  var playlists = []; // Список IPTV плейлистов
  var selectedPlaylist = -1; // Выбранный плейлист
  var defaultGroup = 'Other'; // Группа каналов по умолчанию
  var channelCatalog = {}; // Каталог каналов
  var playlistConfig = {}; // Конфигурация плейлиста
  var epgData = {}; // Данные телепрограммы (EPG)
  var epgUpdateInterval; // Интервал обновления EPG
  var uniqueID = ''; // Уникальный идентификатор пользователя

  // Функция загрузки плейлистов
  function loadPlaylists() {
    var playlistURL = 'http://tv.new-ton.net.ru/plamik.m3u'; // Сюда подставьте реальный URL плейлистов
    fetch(playlistURL)
      .then(response => response.json())
      .then(data => {
        playlists = data;
        updateUI();
      })
      .catch(error => console.error('Ошибка загрузки плейлистов:', error));
  }

  // Функция обновления EPG (телепрограмма)
  function updateEPG(channelID) {
    var currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
    
    if (epgData[channelID] && currentTime >= epgData[channelID].start && currentTime <= epgData[channelID].end) {
      return;
    }

    epgData[channelID] = { start: currentTime, end: currentTime, data: null };

    fetch(`https://epg.example.com/api/${channelID}/now`) // Реальный URL для получения EPG
      .then(response => response.json())
      .then(epg => {
        epgData[channelID].data = epg;
        renderEPG(channelID);
      })
      .catch(() => {
        epgData[channelID].data = [];
        renderEPG(channelID);
      });
  }

  // Функция переключения каналов
  function switchChannel(channelNumber) {
    if (!Lampa.Player.opened()) return;

    var playlist = Lampa.PlayerPlaylist.get();
    if (!isValidPlaylist(playlist)) return;

    var channelIndex = parseInt(channelNumber);
    if (channelIndex > 0 && channelIndex <= playlist.length) {
      Lampa.PlayerPlaylist.listener.send('select', {
        playlist: playlist,
        position: channelIndex - 1,
        item: playlist[channelIndex - 1]
      });

      Lampa.Player.runas && Lampa.Player.runas(Lampa.Storage.field('player_iptv'));
    }
  }

  // Функция рендеринга телепрограммы (EPG)
  function renderEPG(channelID) {
    if (!epgData[channelID] || !epgData[channelID].data) return;

    var epgInfo = epgData[channelID].data;
    var epgElement = document.getElementById(`epg-${channelID}`);

    if (epgElement) {
      epgElement.innerHTML = epgInfo.title + ' - ' + epgInfo.start + ' - ' + epgInfo.end;
    }
  }

  // Функция инициализации плагина
  function initializePlugin() {
    loadPlaylists(); // Загружаем список IPTV плейлистов

    Lampa.Listener.follow("full", function (event) {
      if (event.type === "complite") {
        var movieData = Lampa.Activity.active().card;
        if (movieData.source === "iptv") {
          updateEPG(movieData.id); // Загружаем EPG при открытии канала
        }
      }
    });
  }

  // Запуск плагина при загрузке приложения
  if (window.appready) {
    initializePlugin();
  } else {
    Lampa.Listener.follow("app", function (event) {
      if (event.type === "ready") {
        initializePlugin();
      }
    });
  }

})();
