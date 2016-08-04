/* global io, ChartLyrics */

$(function() {
  'use strict';

  var socket = io('http://localhost:8080');

  var updateLyrics = function(lyric) {
    $('#lyrics').html(lyric);
  };

  var showError = function(error) {
    $('#lyrics').html(error);
  };

  socket.on('song_changed', function(data) {
    ChartLyrics.findLyric(data.artist, data.title)

    .done(function(lyric) {
      updateLyrics(lyric);
    })

    .fail(function(error) {
      showError(error);
    });
  });
});
