'use strict'
const express = require('express');
const cors = require('cors');
const spotifyRouter = require('./router')
require('../spotify_server/config/spotify_auth')
const passport = require('passport')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const cookieSession = require('cookie-session')


const app = express();

//setup and encrypt session cookie
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))

//passport initialization
app.use(passport.initialize())
app.use(passport.session())

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, {useNewUrlParser: true, useUnifiedTopology: true,}, () => {
    // console.log('connected to mongodb')
})

//spotify API router
app.use(cors())

//set up router
app.use('/', spotifyRouter)

//home route
app.get('/', (req, res) => {
    res.send('hello world')
})

module.exports = app