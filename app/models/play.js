// app/models/play.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PlaySchema = new Schema ({
    // "Hairspray (2016)"
    _id : String,
    name : String,
    // "Spring" or "Fall"
    performanceseason : String, 
    // "2016"
    performanceyear : Number,
    // "Comedy", "1970s", ...
    genres : [String],
    // "hair", "racism", "dancing", etc.
    keywords : [String],
    // "Balitmore"
    locations : [String],
    // 1/1/1970, 1/2/1970, etc.
    performancedates : [Date],
    // "http://..."
    imageURL : String
});

module.exports = mongoose.model('Play', PlaySchema);
