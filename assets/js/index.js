/* global io, ChartLyrics */

$(function() {
  'use strict';

  var socket = io('http://localhost:8080');

  var updateLyrics = function(lyric) {
    $('#lyrics').html(lyric);
  };

  var clearInfo = function() {
    $('#artist').text('');
    $('#album').text('');
  };

  var showError = function(error) {
    clearInfo();
    $('#lyrics').html(error);
  };

  var showSongInformation = function(artist, album) {
    $('#artist').text(artist);
    $('#album').text(album);
  };

  var showLoading = function() {
    clearInfo();
    $('#lyrics').html('');
    $('#loading').text('Loading...');
  };

  var clearLoading = function() {
    $('#loading').text('');
  };

  socket.on('song_changed', function(data) {
    showLoading();

    ChartLyrics.findLyric(data.artist, data.title)

    .done(function(lyric) {
      showSongInformation(data.artist, data.title);
      updateLyrics(lyric);
    })

    .fail(function(error) {
      showError(error);
    })

    .always(function() {
      clearLoading();
    });
  });
});
