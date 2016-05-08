// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');

// Configs
var db = require('./config/db');

// Connect to the DB
mongoose.connect(db.url);

// Initialize the Express App
var app = express();

// Configure 

// To expose public assets to the world
app.use(express.static(__dirname + '/public'));

// log every request to the console
app.use(morgan('dev'));

// For parsing HTTP responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('view engine', 'jade');
app.set('views', __dirname + '/public/views');

app.use(expressSession({secret: 'gdadbSecret'}));

var User = require('./app/models/user');
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var loginStrategy = require('./passport/login.js');
loginStrategy(passport);
var registerStrategy = require('./passport/register.js');
registerStrategy(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Express Routes
require('./app/routes/api')(app);
require('./app/routes/routes')(app);

// Start the app with listen and a port number
app.listen(3000);
