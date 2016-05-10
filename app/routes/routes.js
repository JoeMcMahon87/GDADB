// Exported routes to Node
// They respect a last declared hiearchy, so the ones defined at
// the bottom may override the ones at the top.
var mongoose = require('mongoose'),
    express = require('express'),
    passport = require('passport'),
    Contrib = require('../models/contrib'),
    Play = require('../models/play');

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

	app.get('/api/castname', isAuthenticated, function(req, res) {
		var joe = new Contrib();
		joe._id = 'McMahon, Joe';
		joe.GraduationYear = 1987;
		joe.School = 'Gonzaga';
		joe.save();
		console.log('Search for ' + req.query.q);
		Contrib.find(function(err, people) {
			console.log(people);
			if (people) {
				res.type('application/json');
				res.jsonp(people);
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
