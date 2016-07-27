var ChartLyrics = (function () {
	var url = 'http://api.chartlyrics.com/apiv1.asmx/'; 

	return {
		searchLyric: function (artist, song) {
			var deferred = $.Deferred();

			$.ajax({
				url: url + 'SearchLyric',
				type: 'get',
				dataType: 'xml',
				data: {artist: artist, song: song}
			}).done(function (data) {
				var results = [], $songs = $(data).find('SearchLyricResult');

				$songs.each(function () {
					results.push({
						lyricCheckSum: $(this).find('LyricChecksum').text(),
						lyricId: $(this).find('LyricId').text() 
					});
				});

				deferred.resolve(results);
			});

			return deferred.promise();
		},

		getLyric: function (lyricId, lyricCheckSum) {
			var deferred = $.Deferred();

			$.ajax({
				url: url + 'GetLyric',
				type: 'GET',
				dataType: 'xml',
				data: {lyricId: lyricId, lyricCheckSum: lyricCheckSum},
			}).done(function (data) {
				var lyric = '';
				lyric = $(data).find('Lyric').text();
				deferred.resolve(lyric);
			});

			return deferred;
		},

		findLyric: function (artist, song) {
			var deferred = $.Deferred();
			var self = this;

			this.searchLyric(artist, song).then(function (results) {
				var search = results[0];
				return self.getLyric(search.lyricId, search.lyricCheckSum);
			})

			.done(function (lyric) {
				deferred.resolve(lyric);
			});

			return deferred.promise();
		}
	};
})();
