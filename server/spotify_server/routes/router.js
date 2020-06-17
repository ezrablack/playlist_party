const spotifyRouter = require('express').Router();
const passport = require('passport')
const bodyParser = require('body-parser')
const Playlist = require('../../models/playlist-model')

spotifyRouter.use(bodyParser.json());

spotifyRouter.use(bodyParser.urlencoded({ extended: false }));

/* GET homepage */
spotifyRouter.get('/', (req, res) => {
    res.send(req.user)
})
 
//auth with spotify localhost:5010/spotify
spotifyRouter.get('/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-modify-private playlist-modify-public'],
    showDialog: true
}))

//callback route for Spotify to redirect to localhost:5010/callback
spotifyRouter.get('/callback', passport.authenticate('spotify', { failureRedirect: '/'}),
    (req, res) => {
        res.redirect('http://localhost:3000/playground')
})

spotifyRouter.get('/playground', passport.authenticate('spotify', { failureRedirect: '/'}),
    (req, res)=>{
        res.redirect('http://localhost:3000/playground')
    }
)

//user post to queue
spotifyRouter.post('/newPlaylist', (req, res) =>{
    const playlist = req.body.data
    new Playlist({
        playlist: {
            uri: playlist.uri,
            playlistId: playlist.id,
            link: playlist.href,
            title: playlist.name,
            tracks: playlist.tracks.items,
            image: playlist.images
        }
    }).save().then((newPlaylist)=>{
         res.send(newPlaylist)
    })
})

//user request queue
spotifyRouter.get('/playlists', (req, res)=>{
    Playlist.find({}, (err, playlist)=>{
        res.send(playlist)
    })
})

//delete song from queue
spotifyRouter.delete('/delete', (req, res)=>{
    var id = req.body.song._id
    Playlist.findByIdAndDelete(id, (err, docs)=>{
        if(err){
            console.log(err)
        }else{
            console.log('successfully deleted:', docs)
        }
    })
    // console.log(req.body.song._id)
})
//find in mongoDb w ID and delete

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
