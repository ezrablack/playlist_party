const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const keys = require('./keys')
const User = require('../../models/user-model')
access = ''
refresh = ''
//use Passport to authenticate user
passport.use(
    new SpotifyStrategy(
        {   
            clientID: keys.spotify.client_id,
            clientSecret: keys.spotify.client_secret,
            callbackURL: keys.spotify.redirect_uri
        },
         ( accessToken, refreshToken, profile, done ) => {
            
            //check if user exists
            User.findOne({ spotifyId: profile.id }).then((currentUser)=>{
                if(currentUser){
                    currentUser.access = accessToken,
                    currentUser.refresh = refreshToken,
                    User.findByIdAndUpdate(
                        { spotifyId: profile.id }, 
                        {'$set': currentUser },
                        { new: true },
                        currentUser.save(
                        function (err ,user){
                            if (err) return (err);
                            currentUser = user
                        })
                    )
                    done(null, currentUser);
                }else{
                    new User({
                        username: profile.displayName,
                        spotifyId: profile.id,
                        access: accessToken,
                        refresh: refreshToken
                    }).save().then((newUser) => {
                        done(null, newUser);
                    })
                }
            })
        }
    )
)

//passport serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//passport deserialization
passport.deserializeUser((id, done) => {
    User.findById(id).then((user)=>{
    done(null, user);
    })
});

 