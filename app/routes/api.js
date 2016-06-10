// Module for API Routes (serving JSON)
var mongoose = require('mongoose'),
	Play = require('../models/play'),
	PlayRole = require('../models/playrole'),
	Contrib = require('../models/contrib')

var multiparty = require('multiparty');

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
			.sort('name').exec(function(err, plays) {
				res.send(plays);
			});
	});

	app.get('/genresearch', function(req, res) {
		queryTerm = { 'genres' : req.query.q };
		console.log(queryTerm);
		Play.find(queryTerm)
			.sort('name').exec(function(err, plays) {
				console.log(plays);
				res.send(plays);
			});
	});

	// Create a play
	app.post('/api/saveplay', isAuthenticated, function (req, res) {
		var form = new multiparty.Form();
		form.parse(req, function(err, fields, files) {
			if (err) {
				console.log("ERROR: " + err);
				res.redirect("/");
			}
			var play = new Play();
			play._id = fields._id[0];
			play.name = fields._id[0];
			play.keywords = fields.keywords[0].split(",");
			play.genres = fields.genres[0].split(",");
			play.performanceseason = fields.season[0];
			play.performanceyear = fields.year[0];
			play.save(function(err) {
				if (err) {
					console.log(err);
					res.redirect("/");
				} else {
					res.redirect("/");
				}
			});
		});
	});


	app.get('/showPlay/:play_id', function (req, res) {
		Play.findOne({ 'name' : req.params.play_id}, function(err, play) {
			res.send(play)
		});
	});

	// Example DELETE route
	app.delete('/play/:play_id', function (req, res) {
		Play.remove({
			name : req.params.play_id
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

	app.post('/api/upload', isAuthenticated, function(req, res) {
		var confirmation = {}
		console.log("Upload start");
		for(var key in req.files)
		{
			console.log(key + " " + req.files[key]);
		}

		res.json(confirmation)
	});

}
