$(function () {
	var App = function () {

		this.init = function () {
			ChartLyrics.findLyric('all that remains', 'what if i was nothing').done(function (lyric) {
				console.log(lyric);
			});
		};
	};

	let app = new App();
	app.init();
});

