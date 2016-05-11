// app/models/playrole.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PlayRoleSchema = new Schema ({
    // "Warman, John"
    contribname : String,
    // "director"
    contribclass : String,
    // "Damn Yankees (1986)"
    playID : String,
    // "Directed"
    contribrole : String
});

module.exports = mongoose.model('PlayRole', PlayRoleSchema);
