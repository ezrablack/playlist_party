'use strict'

const spotifyRouter = require('./spotify_server/routes/router')
const express = require('express');
const cors = require('cors');
require('./spotify_server/config/spotify_auth')
const passport = require('passport')
const mongoose = require('mongoose')
const keys = require('./spotify_server/config/keys')
const app = express();
const cookieSession = require('cookie-session')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const authCheck = (req,res,next) => {
    if(!req.user){
        res.redirect('/homepage')
    }else{
        next()
    }
}

app.get('/playground', authCheck, (req,res) =>{
    res.send(req.session.user)
})

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
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

//set up router
app.use('/', spotifyRouter)

//home route
app.get('/', (req, res) => {
    res.send('hello world')
})

io.on('connection', (socket)=>{
    socket.on('delete', (track)=>{
        io.emit('delete', (track))
    })

    socket.on('add', (track)=>{
        io.emit('add', (track))
    })

    socket.on('disconnect', ()=>{
        console.log('user has left!')
    })
})

http.listen(5010, () => {
    console.log(`listening on ${5010}`)
})
