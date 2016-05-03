// app/models/playrole.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PlayRoleSchema = new Schema ({
    // "Warman, John"
    ContribName : String,
    // "director"
    ContribClass : String,
    // "Damn Yankees (1986)"
    PlayID : String,
    // "Directed"
    ContribRole : String
});

module.exports = mongoose.model('PlayRole', PlayRoleSchema);
