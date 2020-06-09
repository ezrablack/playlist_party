'use strict'
const express = require('express');
const cors = require('cors');

const spotifyRouter = require('./router')

const app = express();

//spotify API router
app.use(cors())
app.use('/', spotifyRouter)

// const session = require('express-session');  
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

//Spotify Credentials
var client_id = 'a170a77258f2447b8ed267c5ef23d6ed'; // Your client id
var client_secret = '94b9aded697d4542b23840396d9bb4a0 '; // Your secret
var redirect_uri = 'http://localhost:3000/playground'; // Your redirect uri
var scope = 'streaming user-read-private user-read-email user-modify-playback-state user-read-playback-state';

//use Passport to authenticate user
passport.use(
    new SpotifyStrategy(
        {   
            clientID: client_id,
            clientSecret: client_secret,
            callbackURL: redirect_uri
        },
        function( accessToken, refreshToken, expires_in, profile, done){
            User.findOrCreate({ spotifyID: profile.id }, function(err, user){
                return done(err,user);
            });
        }
    )
)

module.exports = app