// Module for API Routes (serving JSON)
module.exports = function(app) {
	var mongoose = require('mongoose'),
		Play = require('../models/play')

	// Get the Plays
	app.get('/plays', function(req, res) {
		Play.find(function(err, plays) {
			res.send(plays);
		});
	});

	// Get a play by query
	app.get('/play', function(req, res) {
		queryTerm = {'$text':{'$search':req.query.q}};
		Play.find(queryTerm)
			.sort('_id').exec(function(err, plays) {
				res.send(plays);
			});
	});

	// Create a play
	app.post('/play', function (req, res) {
		Play.create({
			_id : req.body.PlayID, // Bound using Angular
			PerformanceSeason : req.body.PerformanceSeason,
			PerformanceYear : req.body.PerformanceYear,
			Genres : req.body.Genres,
			Keywords : req.body.Keywords,
			Locations : req.body.Locations,
			PerformanceDates : req.body.PerformanceDates,
			ImageURL : req.body.ImageURL
		}, function(err, play) {
			if(err) {
				res.send(err);
			}

			Play.find(function(err, plays) {
				res.send(plays);
			});
		});
	});


	app.get('/showPlay/:play_id', function (req, res) {
		Play.findOne({ '_id' : req.params.play_id}, function(err, play) {
			res.send(play)
		});
	});

	// Example DELETE route
	app.delete('/play/:play_id', function (req, res) {
		Play.remove({
			_id: req.params.play_id
		}, function(err, play) {
			if(err) {
				res.send(err);
			}

			Play.find(function(err, plays) {
				res.send(plays);
			});
		});
	});
}
