const electron = require('electron');
const {app, BrowserWindow} = electron;

app.on('ready', () => {
	let win = new BrowserWindow({width: 800, height: 600});
	win.loadURL(`file://${__dirname}/index.html`);
	win.webContents.openDevTools();	
});

var io = require('socket.io')(8080);

var dbus = require('dbus-native');
var sessionBus = dbus.sessionBus();

var spotifyService = sessionBus.getService('org.mpris.MediaPlayer2.spotify').getInterface(
    '/org/mpris/MediaPlayer2',
    'org.freedesktop.DBus.Properties', function(err, notifications) {

    notifications.Get('org.mpris.MediaPlayer2.Player', 'Metadata', function (err, content) {
        var title = content[1][0][8][1][1][0];
        var artist = content[1][0][4][1][1][0][0];
        var album = content[1][0][3][1][1][0];
        var song = {
        	title: title,
        	artist: artist,
        	album: album
        }

        io.emit('song_changed', song);
    });

    notifications.addListener('PropertiesChanged', function (entry, content) {
        var title = content[0][1][1][0][8][1][1][0];
        var artist = content[0][1][1][0][4][1][1][0][0];
        var album = content[0][1][1][0][3][1][1][0];

        var song = {
        	title: title,
        	artist: artist,
        	album: album
        }

        io.emit('song_changed', song);
    });

});
