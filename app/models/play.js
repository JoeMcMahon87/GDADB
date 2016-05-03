// app/models/play.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PlaySchema = new Schema ({
    // "Hairspray (2016)"
    _id : String,
    // "Spring" or "Fall"
    PerformanceSeason : String, 
    // "2016"
    PerformanceYear : Number,
    // "Comedy", "1970s", ...
    Genres : [String],
    // "hair", "racism", "dancing", etc.
    Keywords : [String],
    // "Balitmore"
    Locations : [String],
    // 1/1/1970, 1/2/1970, etc.
    PerformanceDates : [Date],
    // "http://..."
    ImageURL : String
});

PlaySchema.virtual('PlayID').get(function() {
    return this._id;
});

module.exports = mongoose.model('Play', PlaySchema);
