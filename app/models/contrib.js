// app/models/contrib.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var ContributorSchema = new Schema ({
    // "Warman, John"
    _id : String,
    // 1957
    GraduationYear : Number, 
    // "Gonzaga"
    School : String,
    // "John Warman, affectionately known as 'Doc'..."
    ContributorBio : [String],
    // "http://...."
    PicURL : String
});

ContributorSchema.virtual('ContribName').get(function() {
    return this._id;
});

module.exports = mongoose.model('Contributor', ContributorSchema);
