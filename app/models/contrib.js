// app/models/contrib.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var ContributorSchema = new Schema ({
    // "Warman, John"
    _id : String,
    // 1957
    graduationyear : Number, 
    // "Gonzaga"
    school : String,
    // "John Warman, affectionately known as 'Doc'..."
    contributorbio : String,
    // "http://...."
    picURL : String
});

ContributorSchema.virtual('contribname').get(function() {
    return this._id;
});

module.exports = mongoose.model('Contributor', ContributorSchema);
