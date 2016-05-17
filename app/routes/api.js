// Module for API Routes (serving JSON)
var mongoose = require('mongoose'),
	Play = require('../models/play'),
	PlayRole = require('../models/playrole'),
	Contrib = require('../models/contrib')

var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(app) {
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

	app.get('/api/namesearch', isAuthenticated, function(req, res) {
		var queryTerm = {'name':{'$regex':req.query.q,"$options":"i"}};
		Contrib.distinct('name',queryTerm, function(err, people) {
			if (people) {
				res.type('application/json');
				res.jsonp(people);
			} else {
				console.log("No results");
			}
		});
	});

	app.post('/api/addperson', isAuthenticated, function(req, res) {
		var person = new Contrib({
			name : req.body.name,
			graduationyear: req.body.year,
			school: req.body.school,
			contributorbio: req.body.bio,
                        picURL: ""
		});
		person.save(function(err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.send("");
			}
		});
	});

	app.post('/api/addrole', isAuthenticated, function(req, res) {
		var role = new PlayRole({
			contribname : req.body.name,
			contribclass : req.body.year,
			playID : req.body.play,
			contribrole : req.body.role
		});
		role.save(function(err) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.send("");
			}
		});
	});

	app.get('/api/school', isAuthenticated, function(req, res) {
		var queryTerm = {'school' : { "$regex" : req.query.q, "$options":"i"}};
		Contrib.distinct('school', queryTerm, function(err, schools) {
			if (schools) {
				res.type('application/json');
				res.jsonp(schools);
			} else {
				console.log("No results");
			}
		});
	});
}
