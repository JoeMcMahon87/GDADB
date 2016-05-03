// app/models/playnotes.js

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PlayNotesSchema = new Schema ({
    // "Hairspray (2016)"
    PlayID : String,
    // "director notes"
    NotesType : String, 
    // "CONT"
    NotesSubtype : String,
    // "This play was difficult to pull off given the large cast, the loss of a week of practice due to snow..."
    NotesText : String
});

module.exports = mongoose.model('PlayNotes', PlayNotesSchema);
