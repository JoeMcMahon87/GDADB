// Exported routes to Node
// They respect a last declared hiearchy, so the ones defined at
// the bottom may override the ones at the top.
var mongoose = require('mongoose'),
    multiparty = require('multiparty'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('node-uuid'),
    util = require('util'),
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

	app.get('/signin', function(req, res) {
		res.render('signin', { } );
	});

	app.get('/search', function(req, res) {
		var queryType = req.query.type;
		queryTerm = {'$text':{'$search':req.query.search}};
		Play.find(queryTerm)
			.sort('name').exec(function(err, plays) {
				res.render('index', { plays : plays, auth : req.isAuthenticated() });
		});
	});

	app.get('/person/:id', function(req, res) {
		var personId = req.params.id;
		Contrib.findOne({ 'name' : req.params.id}, function(err, person) {
			PlayRole.find({ 'contribname' : req.params.id}, function(err, perfs) {
				res.render('person', { person : person, performances : perfs, auth : req.isAuthenticated() });
			});
                });
	});

	app.get('/details/:id', function(req, res) {
		var playId = req.params.id;
		Play.findOne({ 'name' : req.params.id}, function(err, play) {
			console.log(JSON.stringify(play));
			PlayRole.find({ 'playID' : playId }, null, { sort : { 'contribname' : 1 }}, function(err, roles) {
				var dirs = [];
				var prods = [];
				var cast = [];
				var crew = [];
				var playpics = [];
				for (var index in roles) {
					var person = roles[index];
					if (person.contribrole.substring(0,4) == "DIR:") {
						person.contribrole = person.contribrole.substring(4);
						dirs.push(person);
					} else if (person.contribrole.substring(0,5) == "PROD:") {
						person.contribrole = person.contribrole.substring(5);
						prods.push(person);
					} else if (person.contribrole.substring(0,5) == "CAST:") {
						person.contribrole = person.contribrole.substring(5);
						cast.push(person);
					} else if (person.contribrole.substring(0,5) == "CREW:") {
						person.contribrole = person.contribrole.substring(5);
						crew.push(person);
					}
				};
				play.year = play.PerformanceYear;
				play.season = play.PerformanceSeason;
				playpics.push({'url' : "/assets/images/woo.jpg", 'title' : "Test"});
				playpics.push({'url' : "/assets/images/woo.jpg", 'title' : "Test 2"});
console.log(playpics);
				console.log(JSON.stringify(play));
				res.render('details', { play : play, people: roles, directors : dirs, producers : prods, cast : cast, crew : crew, dirs : dirs, prods : prods, playpics : playpics, auth : req.isAuthenticated() });
			});
		});
	});

	app.get('/addplay', function(req, res) {
		res.render('addplay', { auth : req.isAuthenticated() });
	});

	app.get('/genre', function(req, res) {
		queryTerm = { 'genres' : req.query.q };
		Play.find(queryTerm)
			.sort('name').exec(function(err, plays) {
				res.render('index', { plays : plays, auth : req.isAuthenticated() });
			});
	});

        app.get('/update/:id', isAuthenticated, function(req, res) {
		var playId = req.params.id;
		Play.findOne({ 'name' : req.params.id}, function(err, play) {
			PlayRole.find({ 'playID' : playId }, function(err, roles) {
				var dirs = [];
				var prods = [];
				var cast = [];
				var crew = [];
				for (var index in roles) {
					var person = roles[index];
					if (person.contribrole.substring(0,5) == "CAST:") {
						person.contribrole = person.contribrole.substring(5);
						cast.push(person);
					} else if (person.contribrole.substring(0,5) == "CREW:") {
						person.contribrole = person.contribrole.substring(5);
						crew.push(person);
					} else if (person.contribrole.substring(0,4) == "DIR:") {
						person.contribrole = person.contribrole.substring(5);
						dirs.push(person);
					} else if (person.contribrole.substring(0,5) == "PROD:") {
						person.contribrole = person.contribrole.substring(5);
						prods.push(person);
					}
				};
				res.render('updateplay', { play : play, people : roles, cast : cast, crew : crew, dirs : dirs, prods : prods, auth : req.isAuthenticated() });
			});
		});
	});

	app.post('/update/:id', isAuthenticated, function(req, res) {
		var form = new multiparty.Form();
		form.parse(req, function(err, fields, files) {
console.log(fields);
			if (err) {
        			res.writeHead(400, {'content-type': 'text/plain'});
        			res.end("invalid request: " + err.message);
        			return;
      			}
			Play.findOne({ 'name' : fields._id}, function(err2, play) {
				var imgURL = '';
				if ((files.playbillimage[0]) && (files.playbillimage[0].originalFilename.trim().length > 0))  {
					fs.readFile(files.playbillimage[0].path, function(err, data) {
						imgURL = '/images/' + uuid.v1() + path.extname(files.playbillimage[0].originalFilename);
						var newPath = __dirname + '/../../public' + imgURL;
						fs.writeFile(newPath, data, function(err) {
							play.imageURL = imgURL;
							play.keywords = fields.keywords;
							play.genres = fields.genres;
							play.season = fields.season;
							play.performanceyear = Number(fields.year);
							play.description = fields.description;
				
console.log(JSON.stringify(play));
							play.save(function(err) {
								if (err) {
									console.log(err);
								}
							});
							PlayRole.find({ 'playID' : play._id }, function(err, roles) {
								var dirs = [];
								var prods = [];
								var cast = [];
								var crew = [];
								for (var index in roles) {
									var person = roles[index];
									if (person.contribrole.substring(0,5) == "CAST:") {
										person.contribrole = person.contribrole.substring(5);
										cast.push(person);
									} else if (person.contribrole.substring(0,5) == "CREW:") {
										person.contribrole = person.contribrole.substring(5);
										crew.push(person);
									} else if (person.contribrole.substring(0,4) == "DIR:") {
										person.contribrole = person.contribrole.substring(5);
										dirs.push(person);
									} else if (person.contribrole.substring(0,5) == "PROD:") {
										person.contribrole = person.contribrole.substring(5);
										prods.push(person);
									}
								};
								res.render('updateplay', { play : play, people : roles, cast : cast, crew : crew, dirs : dirs, prods : prods, auth : req.isAuthenticated() });
							});
						});
					});
				} else {
					play.keywords = fields.keywords;
					play.genres = fields.genres;
					play.season = fields.season;
					play.performanceyear = Number(fields.year);
					play.description = fields.description;
					
					play.save(function(err) {
						if (err) {
							console.log(err);
						}
					});
					PlayRole.find({ 'playID' : play._id }, function(err, roles) {
						var cast = [];
						var crew = [];
						var dirs = [];
						var prods = [];
						for (var index in roles) {
							var person = roles[index];
							if (person.contribrole.substring(0,5) == "CAST:") {
								person.contribrole = person.contribrole.substring(5);
								cast.push(person);
							} else if (person.contribrole.substring(0,5) == "CREW:") {
								person.contribrole = person.contribrole.substring(5);
								crew.push(person);
							} else if (person.contribrole.substring(0,4) == "DIR:") {
								person.contribrole = person.contribrole.substring(5);
								dirs.push(person);
							} else if (person.contribrole.substring(0,5) == "PROD:") {
								person.contribrole = person.contribrole.substring(5);
								prods.push(person);
							}
						};
						res.render('updateplay', { play : play, people : roles, cast : cast, crew : crew, dirs : dirs, prods : prods, auth : req.isAuthenticated() });
					});
				}
			});
		});
		return;
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
