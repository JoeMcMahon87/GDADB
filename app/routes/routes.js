// Exported routes to Node
// They respect a last declared hiearchy, so the ones defined at
// the bottom may override the ones at the top.
var mongoose = require('mongoose'),
    express = require('express'),
    passport = require('passport'),
    Contrib = require('../models/contrib'),
    Play = require('../models/play');
    PlayRole = require('../models/playrole');

var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(app) {
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash: true
	}));

	app.get('/register', function(req, res) {
		res.render('register', { message: req.flash('message') });
	});

	app.post('/register', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/register',
		failureFlash: true
	}));

	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/search', function(req, res) {
		var queryType = req.query.type;
		queryTerm = {'$text':{'$search':req.query.search}};
		Play.find(queryTerm)
			.sort('_id').exec(function(err, plays) {
				res.render('index', { plays : plays, auth : req.isAuthenticated() });
		});
	});

	app.get('/details/:id', function(req, res) {
		var playId = req.params.id;
		Play.findOne({ '_id' : req.params.id}, function(err, play) {
			res.render('details', { play : play, producers: "", directors: "", cast: [], crew: [], auth : req.isAuthenticated() });
		});
	});

	app.get('/add', function(req, res) {
		res.sendFile('public/views/addplay.html', { root: '/home/jmcmahon/gdadb/'});
	});

        app.get('/update/:id', isAuthenticated, function(req, res) {
		var playId = req.params.id;
		Play.findOne({ '_id' : req.params.id}, function(err, play) {
			res.render('updateplay', { play : play, producers: "", directors: "", cast: [], crew: [], auth : req.isAuthenticated() });
		});
	});

	app.get('/signin', function(req, res) {
		res.render('signin', { } );
	});

	app.post('/api/addperson', isAuthenticated, function(req, res) {
		var person = new Contrib({
			_id : req.body.name,
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

	app.get('/api/namesearch', isAuthenticated, function(req, res) {
		var queryTerm = {'_id':{'$regex':req.query.q,"$options":"i"}};
		Contrib.distinct('_id',queryTerm, function(err, people) {
			if (people) {
				res.type('application/json');
				res.jsonp(people);
			} else {
				console.log("No results");
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

	// Wildcard route serving static html page
	app.get('*', function(req, res) {
		// Displaying an already made view
		Play.find(function(err,plays) {
			res.render('index', { title: 'TEST', plays : plays, auth : req.isAuthenticated() } );
		});
		//res.sendFile('public/views/index.html', { root: '/home/jmcmahon/gdadb/'});
	});

}
