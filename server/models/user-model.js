const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const userSchema = new Schema({
    username: String,
    spotifyId: String,
    access: String,
    refresh: String
})

const User = mongoose.model('user', userSchema)

module.exports = User;