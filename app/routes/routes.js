// Exported routes to Node
// They respect a last declared hiearchy, so the ones defined at
// the bottom may override the ones at the top.
var mongoose = require('mongoose'),
    express = require('express'),
    passport = require('passport'),
    Play = require('../models/play');

var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(app) {
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/test',
		failureRedirect: '/',
		failureFlash: true
	}));

	app.get('/register', function(req, res) {
		res.render('register', { message: req.flash('message') });
	});

	app.post('/register', passport.authenticate('register', {
		successRedirect: '/',
		failureRedirect: '/register',
		failureFlash: true
	}));

	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// Test route to with request and response
	app.get('/test', function(req, res) {
		// Writing to the Header of the response
		res.writeHead(200);
		
		// Writing to the body of the response using Writeable interface
		// Look it takes HTML!
		res.write('<h1>I\'m HTML!</h1>');
		// Must always end the Writeable stream 
		res.end();
	});

	app.get('/search', function(req, res) {
		var queryType = req.query.type;
		queryTerm = {'$text':{'$search':req.query.search}};
		Play.find(queryTerm)
			.sort('_id').exec(function(err, plays) {
				res.render('index', { plays : plays });
		});
	});

	app.get('/details/:id', function(req, res) {
		var playId = req.params.id;
		Play.findOne({ '_id' : req.params.id}, function(err, play) {
			res.render('details', { play : play, producers: "", directors: "", cast: [], crew: [] });
		});
	});

	app.get('/add', function(req, res) {
		res.sendFile('public/views/addplay.html', { root: '/home/jmcmahon/gdadb/'});
	});

        app.get('/update/:id', isAuthenticatied, function(req, res) {
		var playId = req.params.id;
		Play.findOne({ '_id' : req.params.id}, function(err, play) {
			res.render('updateplay', { play : play, producers: "", directors: "", cast: [], crew: [] });
		});
	});

	app.get('/signin', function(req, res) {
		res.render('signin', { } );
	});

	// Wildcard route serving static html page
	app.get('*', function(req, res) {
		// Displaying an already made view
		Play.find(function(err,plays) {
			res.render('index', { title: 'TEST', plays : plays } );
		});
		//res.sendFile('public/views/index.html', { root: '/home/jmcmahon/gdadb/'});
	});

}
