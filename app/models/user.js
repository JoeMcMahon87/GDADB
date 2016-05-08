// app/models/user.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema ({
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String
});

module.exports = mongoose.model('User', UserSchema);

