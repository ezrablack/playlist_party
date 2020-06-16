const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const playlistSchema = new Schema({
    playlist: {
        uri: String,
        playlistId: String,
        link: String,
        title: String,
        tracks: Array,
        image: Array
    }
})

const Playlist = mongoose.model('playlist', playlistSchema)

module.exports = Playlist;