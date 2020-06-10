const spotifyRouter = require('express').Router();
const passport = require('passport')

/* GET homepage */
spotifyRouter.get('/', (req, res) => {
    res.send('spotify is up and running')
})

//auth with spotify
spotifyRouter.get('/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email user-read-private'],
    showDialog: true
}))

//callback route for Spotify to redirect to
spotifyRouter.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login'}),
    (req, res) => {
        res.send('is this working?')
        // res.redirect('http://localhost:3000/playground')
})

//callback url
spotifyRouter.get('/playground', passport.authenticate('spotify'), (req, res) => {
   
})

//auth login
spotifyRouter.get('/login', passport.authenticate('spotify'), (req,res) =>{
    res.send('logging in with spotify')
})

//auth logout
spotifyRouter.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/')
    res.alert('logging out')
})

module.exports = spotifyRouter;
