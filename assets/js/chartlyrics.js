var ChartLyrics = (function() {
  'use strict';

  var url = 'http://api.chartlyrics.com/apiv1.asmx/';

  var timeout = 1000;
  var intents = 0;
  var intentsLimit = 10;

  var tryAgain = function(fun, deferred, funArgs) {
    if (intents === intentsLimit) {
      deferred.reject('Limit of intents reached!');
    }

    setTimeout(function() {
      intents++;
      fun.apply(this, funArgs);
    }, timeout);
  };

  return {
    searchLyric: function(artist, song) {
      var deferred = new $.Deferred();
      var args = arguments;

      (function search(artist, song) {
        $.ajax({
          url: url + 'SearchLyric',
          type: 'get',
          dataType: 'xml',
          data: {artist: artist, song: song}
        })

        .done(function(data) {
          var results = [];
          var $songs = $(data).find('SearchLyricResult');

          $songs.each(function() {
            results.push({
              lyricCheckSum: $(this).find('LyricChecksum').text(),
              lyricId: $(this).find('LyricId').text()
            });
          });

          if (results[0].lyricCheckSum === "" || results[0].lyricId === "") {
            deferred.reject('Lyric not found');
          } else {
            deferred.resolve(results);
          }
        })

        .fail(function(err) {
          console.log('searchLyric error', err);
          tryAgain(search, deferred, args);
        });
      })(artist, song);

      return deferred.promise();
    },

    getLyric: function(lyricId, lyricCheckSum) {
      var deferred = new $.Deferred();
      var args = arguments;

      (function search(lyricId, lyricCheckSum) {
        $.ajax({
          url: url + 'GetLyric',
          type: 'GET',
          dataType: 'xml',
          data: {lyricId: lyricId, lyricCheckSum: lyricCheckSum}
        })

        .done(function(data) {
          var lyric = '';
          lyric = $(data).find('Lyric').text();
          deferred.resolve(lyric);
        })

        .fail(function(err) {
          console.log('getlyric error', err);
          tryAgain(search, deferred, args);
        });
      })(lyricId, lyricCheckSum);

      return deferred.promise();
    },

    findLyric: function(artist, song) {
      intents = 0;

      var deferred = new $.Deferred();
      var self = this;

      this.searchLyric(artist, song)

      .fail(function(err) {
        deferred.reject(err);
      })

      .then(function(results) {
        var search = results[0];
        return self.getLyric(search.lyricId, search.lyricCheckSum);
      })

      .done(function(lyric) {
        deferred.resolve(lyric);
      });

      return deferred.promise();
    }
  };
})();
