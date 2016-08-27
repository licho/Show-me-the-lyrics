'use strict';

// electron stuff
const electron = require('electron');
const {app, BrowserWindow} = electron;

app.on('ready', () => {
  let win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
});

// Server stuff
var io = require('socket.io')(8080);

io.on('connection', function(socket) {
  initDbus();
});

function initDbus() {
  var dbus = require('dbus-native');
  var sessionBus = dbus.sessionBus();
  var dest = 'org.mpris.MediaPlayer2.spotify';
  var path = '/org/mpris/MediaPlayer2';
  var _interface = 'org.freedesktop.DBus.Properties';

  var service = sessionBus.getService(dest);

  service.getInterface(path, _interface, function(err, notifications) {
    var player = 'org.mpris.MediaPlayer2.Player';

    if (err) {
      console.log(err);
    }

    notifications.Get(player, 'Metadata', function(err, content) {
      if (err) {
        console.log(err);
      }

      var song = {
        title: content[1][0][8][1][1][0],
        artist: content[1][0][4][1][1][0][0],
        album: content[1][0][3][1][1][0]
      };

      io.emit('song_changed', song);
    });

    notifications.addListener('PropertiesChanged', function(entry, content) {
      // Check if song was paused or played again
      if (content[0][0] === 'PlaybackStatus') {
        return false;
      }

      var song = {
        title: content[0][1][1][0][8][1][1][0],
        artist: content[0][1][1][0][4][1][1][0][0],
        album: content[0][1][1][0][3][1][1][0]
      };
      io.emit('song_changed', song);
    });
  });
}
