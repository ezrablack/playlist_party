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

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

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

//socket.io used for chat and queue updates
io.on('connection', (socket)=>{
    console.log('we have connection')
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        
        if(error) return callback(error);
        
        console.log(user.room)
        socket.join(user.room);
    
        socket.emit('message', { user: 'admin', text: `Hey ${user.name}! Welcome to ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
        callback();
    })    

    socket.on('delete', (track)=>{
        io.emit('delete', (track))
    })

    socket.on('add', (track)=>{
        io.emit('add', (track))
    })

    socket.on('disconnect', ()=>{
        console.log('user has left!')
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
    
        io.to(user.room).emit('message', { user: user.name, text: message });
    
        callback();
    });
    
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);

      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
    })
})

http.listen(5010, () => {
    console.log(`listening on ${5010}`)
})
