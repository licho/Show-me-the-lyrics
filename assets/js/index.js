$(function () {
	var socket = io('http://localhost:8080');

	socket.on('song_changed', function (data) {
		ChartLyrics.findLyric(data.artist, data.title).done(function (lyric) {
			console.log(lyric);
			$('#lyrics').html(lyric)
		});
	});

});

