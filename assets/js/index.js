/* global io, ChartLyrics */

$(function() {
  'use strict';

  var socket = io('http://localhost:8080');

  var updateLyrics = function(lyric) {
    $('#lyrics').html(lyric);
  };

  var showError = function(error) {
    $('#lyrics').html(error);
    $('#artist').text('');
    $('#album').text('');
  };

  var showSongInformation = function(artist, album) {
    $('#artist').text(artist);
    $('#album').text(album);
  };

  socket.on('song_changed', function(data) {
    ChartLyrics.findLyric(data.artist, data.title)

    .done(function(lyric) {
      showSongInformation(data.artist, data.title);
      updateLyrics(lyric);
    })

    .fail(function(error) {
      showError(error);
    });
  });
});
