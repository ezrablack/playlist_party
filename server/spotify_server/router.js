const express = require('express');
const spotifyRouter = express.Router();

/* GET homepage */
spotifyRouter.get('/', (req, res) => {
    res.send('server is up and running')
})

//auth login
spotifyRouter.get('/login', (req,res) =>{
    res.send('logging in with spotify')
})

//auth logout
spotifyRouter.get('/logout', (req, res) =>{
    res.send('logging out')
})

module.exports = spotifyRouter;
