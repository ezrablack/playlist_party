'use strict'

const chat = require('./chat_server/chat')
const chatRouter = require('./chat_server/chatDomain')
const spotify = require('./spotify_server/spotify')
const spotifyRouter = require('./spotify_server/spotifyDomain')

chat.listen(chatRouter.port, () => {
    console.log(`listening on ${chatRouter.port}`)
})

spotify.listen(spotifyRouter.port, () => {
    console.log(`listening on ${spotifyRouter.port}`)
})

console.log('hi')