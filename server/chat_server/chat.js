'use strict'
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const chatRouter = require('./router')

const chatApp = express();
const server = http.createServer(chatApp);
const io = socketio(server);

//chat routes
chatApp.use(cors())
chatApp.use('/', chatRouter) 


//Chat socket
io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room})

        if(error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to ${user.room}`})
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`})

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})
        
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message})
        io.to(user.room).emit('roomData', { room: user.room, text: message})

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`})
        }
    })
})

module.exports = chatApp