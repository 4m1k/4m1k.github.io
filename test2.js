/*
// https://ss-iptv.com/ru/operators/catchup
// niklabs.com/catchup-settings/
// http://plwxk8hl.russtv.net/iptv/00000000000000/9201/index.m3u8?utc=1666796400&lutc=1666826200
*/
;(function () {
'use strict';
var plugin = {
    component: 'my_iptv2',
    icon: "<svg height=\"244\" viewBox=\"0 0 260 244\" xmlns=\"http://www.w3.org/2000/svg\" style=\"fill-rule:evenodd;\" fill=\"currentColor\"><path d=\"M259.5 47.5v114c-1.709 14.556-9.375 24.723-23 30.5a2934.377 2934.377 0 0 1-107 1.5c-35.704.15-71.37-.35-107-1.5-13.625-5.777-21.291-15.944-23-30.5v-115c1.943-15.785 10.61-25.951 26-30.5a10815.71 10815.71 0 0 1 208 0c15.857 4.68 24.523 15.18 26 31.5zm-230-13a4963.403 4963.403 0 0 0 199 0c5.628 1.128 9.128 4.462 10.5 10 .667 40 .667 80 0 120-1.285 5.618-4.785 8.785-10.5 9.5-66 .667-132 .667-198 0-5.715-.715-9.215-3.882-10.5-9.5-.667-40-.667-80 0-120 1.35-5.18 4.517-8.514 9.5-10z\"/></svg>",
    name: 'Hack TV'
};

var lists = [];
var curListId = -1;
var defaultGroup = 'Other';
var catalog = {};
var listCfg = {};
var EPG = {};
var epgInterval;
var UID = '';

var playlistUrl = 'http://tv.new-ton.net.ru/plamik.m3u';
var epgUrl = 'http://tv.new-ton.net.ru/xmltv.xml';

// Функция загрузки плейлиста и EPG
function loadPlaylist() {
    console.log('Загрузка плейлиста:', playlistUrl);
    console.log('Загрузка программы передач:', epgUrl);
    fetch(playlistUrl)
        .then(response => response.text())
        .then(data => {
            console.log('Плейлист загружен');
            processPlaylist(data);
        })
        .catch(error => console.error('Ошибка загрузки плейлиста:', error));
    
    fetch(epgUrl)
        .then(response => response.text())
        .then(data => {
            console.log('EPG загружен');
            processEPG(data);
        })
        .catch(error => console.error('Ошибка загрузки EPG:', error));
}

function processPlaylist(data) {
    console.log('Обработка данных плейлиста...');
    // Здесь можно реализовать парсинг M3U и добавление каналов
}

function processEPG(data) {
    console.log('Обработка данных EPG...');
    // Здесь можно реализовать парсинг XMLTV и отображение программы передач
}

// Добавление кнопки обновления в UI
function addUIElements() {
    // Кнопка обновления
    var button = document.createElement('button');
    button.innerHTML = 'Обновить IPTV';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.background = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', function() {
        console.log('Обновление IPTV');
        loadPlaylist();
    });
    
    document.body.appendChild(button);

    // Иконка запуска
    var icon = document.createElement('div');
    icon.innerHTML = plugin.icon;
    icon.style.position = 'fixed';
    icon.style.bottom = '10px';
    icon.style.right = '10px';
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.cursor = 'pointer';
    icon.style.fill = '#007bff';
    
    icon.addEventListener('click', function() {
        console.log('Запуск IPTV плагина');
        loadPlaylist();
    });
    
    document.body.appendChild(icon);
}

document.addEventListener('DOMContentLoaded', function() {
    addUIElements();
    loadPlaylist();
});

})();
