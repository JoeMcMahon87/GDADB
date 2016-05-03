// Exported routes to Node
// They respect a last declared hiearchy, so the ones defined at
// the bottom may override the ones at the top.
var mongoose = require('mongoose'),
    Play = require('../models/play');

module.exports = function(app) {
	
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

	app.get('/details/:id', function(req, res) {
		var playId = req.params.id;
		Play.findOne({ '_id' : req.params.id}, function(err, play) {
			res.render('details', play);
			//res.sendFile('public/views/details.html', { root: '/home/jmcmahon/gdadb/'});
		});
	});

	app.get('/add', function(req, res) {
		res.sendFile('public/views/addplay.html', { root: '/home/jmcmahon/gdadb/'});
	});

	// Wildcard route serving static html page
	app.get('*', function(req, res) {
		// Displaying an already made view
		Play.find(function(err,plays) {
console.log(JSON.stringify(plays));
			res.render('index', { title: 'TEST', plays : plays } );
		});
		//res.sendFile('public/views/index.html', { root: '/home/jmcmahon/gdadb/'});
	});

}
