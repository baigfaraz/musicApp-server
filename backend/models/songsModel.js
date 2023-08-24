const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
    song_title : {
        type : String,
        required : true
    },
    song_artist : {
        type : String,
        required : true
    },
    song_album : {
        type : String,
        required : true
    },
    song_artwork : {
        type : String,
        required : true
    },
    song_duration : {
        type : Number,
        required : true
    },
    song_year : {
        type : String,
        required : true
    },
    song_file : {
        type : String,
        required : true
    },
    
},{
    timestamps : true,
})

module.exports = mongoose.model('Song' , songSchema)