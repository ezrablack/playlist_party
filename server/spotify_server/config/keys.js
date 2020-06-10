//add to .gitignore

module.exports =  {
    spotify: {
    //Spotify Credentials
    client_id: 'a170a77258f2447b8ed267c5ef23d6ed', // Your client id
    client_secret: '94b9aded697d4542b23840396d9bb4a0', // Your secret
    redirect_uri: 'http://localhost:5010/callback'// Your redirect uri
    },
    mongodb: {
        dbURI: 'mongodb+srv://Cooper:Cooper123@cluster0-csrr2.mongodb.net/Cluster0?retryWrites=true&w=majority'
    },
    session: {
        cookieKey: 'playlist_party'
    }
}