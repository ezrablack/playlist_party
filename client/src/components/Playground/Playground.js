import React, { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
// import { Button} from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
// import Player from './Player'
import './Playground.css'

const Spotify = require('spotify-web-api-js')
const s = new Spotify()
  
export default function Playground(){
    const [user, setUser] = useState([])
    const [results, setResults] = useState([])
    const [devices, setDevices] = useState([])
    const [playlistOptions , setOptions] = useState([])
    const [playlist, setPlaylist] = useState(JSON.parse(localStorage.getItem('my-playlist')) || null)
    const [queue, setQueue] = useState(JSON.parse(localStorage.getItem('queue')) || [])
    const [random, setRandom ] = useState(0)
    const [queueURI, setQueueURI] = useState([])

    // const [currentSong, setSong] = useState([])
    const history = useHistory()

    //call to spotifyRouter to get user data    
    useEffect(()=>{ 
        fetch('http://localhost:5010/', { credentials: 'include'})
        .then(res=>res.json())
        .then(data=>{setUser(data)})
    }, [user.username]) 

    //get previous playlist to browse
    useEffect(()=>{
        fetch('http://localhost:5010/playlists',{
                method: "GET",
            })
            .then(res=>res.json())
            .then(data=>{setOptions(data)})
    }, [playlistOptions.length])

    //user creates collab playlist and sends link to friends. this prevents need for DB and can set playback
    function createPlaylist(e){
        e.preventDefault()
        var playlistName = e.target.elements.name.value
        var userId = user.spotifyId
        s.setAccessToken(`${user.access}`)
        s.createPlaylist(userId, { name: playlistName, public: false, collaborative: true})
            .then(function(data){fetch('http://localhost:5010/newPlaylist', {
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                  },
                  body: JSON.stringify({
                    data   
                  })
                })
                .then(res=>res.json())
                .then(newPlaylist=>{choosePlaylist(newPlaylist)})
            })
    }
  
    //choose and set previous playlist to current
    function choosePlaylist(playlist){
        localStorage.setItem('my-playlist', JSON.stringify(playlist))
        var chosenPlaylist = JSON.parse(localStorage.getItem('my-playlist')) 
        setPlaylist(chosenPlaylist)
        getQueue(chosenPlaylist)   
    }
    
    //get queue from selected Spotify track
    function getQueue(playlist){
        if(playlist === null){
            console.log('no songs added yet')
        }else{
        var currentPlaylist = playlist.playlist.playlistId
        s.setAccessToken(`${user.access}`)
        s.getPlaylistTracks(currentPlaylist)
        .then(data=>{liveQueue(data.items)})
        }
    }

    //sets current songs to local storage for rendering
    function liveQueue(tracks){
        localStorage.setItem('queue', JSON.stringify(tracks))
        var newQueue = JSON.parse(localStorage.getItem('queue')) 
        setQueue(newQueue)
    }

    //add song to queue
    function addSong(track){
        // console.log(track, playlist.playlist.playlistId)
        s.setAccessToken(`${user.access}`)
        s.addTracksToPlaylist(playlist.playlist.playlistId, [track.uri], function(err, obj){
            if(err){
                console.log(err)
            }else{
                getQueue(playlist)
            }
        })
    }

    //delete song from queue
    function removeSong(track){
        s.setAccessToken(`${user.access}`)
        s.removeTracksFromPlaylist(playlist.playlist.playlistId, [track.track.uri], function(err, obj){
            if(err){
                console.log(err)
            }else{
                getQueue(playlist)
            }
        })
    }

    //find available devices
    function getDevices(){
        s.setAccessToken(`${user.access}`)
        s.getMyDevices().then(
            function(data){
                var d = data.devices
                var devs = []
                d.map(device=>devs.push(device))
                setDevices(devs)
            }
        )
    }

    //set chosen device
    function setDevice(device){
        var chosenDevice = []
        chosenDevice.push(device)
        chosenDevice.join("")
        console.log(chosenDevice)
        s.setAccessToken(`${user.access}`)
        s.transferMyPlayback(chosenDevice)
        setDevices([])
    }

    //song search functionality
    var songQuery = null 
    async function searchSongs(e){
        s.setAccessToken(`${user.access}`)
        if (e.target.value === ''){
            setResults([])
        }
        songQuery = await s.search(e.target.value, ["track", "artist"], {"limit":10} )
        var tracks = songQuery.tracks.items
        var currentTrack = []
        tracks.forEach(track => 
            currentTrack.push(track)
        )
        setResults(currentTrack)
    }

    //spotify iframe refresh test
   function resetIframe() {
       setRandom(random + 1);
   }

   //send spotify hrefs to player - in progress
   useEffect(()=>{
    var trackUris = []
    queue.map(song=>trackUris.push(song.track.uri))
    console.log(trackUris)
    setQueueURI(trackUris)
   }, [])
   

    return(
       <body className='playOuterContainer'>
        <div className='outerContainer'>
            <div className='header'>
                {/* <Player queue={queue}/> -- player built by Daniel Stansberry */}
                
                <button className='logoutBtn' onClick={()=>history.push("/logout")} size='small' className="dropbtn"> Logout </button>
            </div>   
            <div className='currentlyOnline'>
                <h5> online: </h5>
                {user.map()}

            </div>
            {/* <button onClick={resetIframe}>Reset</button> */}
                {/* Spotify playback button - playlist
                <iframe key={random} src={`https://open.spotify.com/embed/playlist/${playlist.playlist.playlistId}`} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe> */}
            
            <div className='newPlaylistForm'>   
                {/* create playlist name */}
                <form onSubmit={(e)=>createPlaylist(e)}>
                    <div >
                      <label>Playlist Name</label>
                      <input type="text" name="name" placeholder="The Final Countdown..." required></input>
                    </div>
                    <button className="dropbtn" type="submit">Submit</button>
                </form>
            </div>  
                {/* filter through songs in queue */}
                <div className="ui right floated secondary vertical pointing menu">
                    <ul>
                        <h1>queue</h1>
                        {queue.map(song =>
                          <li key={song.track.id} className='item'>
                              {`${song.track.artists[0].name}-${song.track.name}`}
                            <img alt='album-cover' src={song.track.album.images[2].url}/>
                            <button onClick={()=>{
                                removeSong(song)}
                                } size='mini' className='ui icon inverted green button'>
                                    <i className='close icon'></i>
                            </button>
                          </li>   
                        )}                
                    </ul>
                </div>    
                {/* previous playlists stored on mongoDb */}
                <div className="dropdown">
                <button className="dropbtn">Previous Playlists</button>
                    <div className="dropdown-content">
                    {playlistOptions.map(playlist=>
                        <h5 key={playlist.playlist.playlistId} onClick={()=>{choosePlaylist(playlist)}}>{playlist.playlist.title}</h5>        
                        )}
                    </div>
                </div>     
                        {/* current playlist */}
                    {(playlist !== null) ? <h1>Current Playlist: {playlist.playlist.title}</h1> : <h1>Create Playlist</h1> }
                {/* song search bar */}
                <div className='ui search'> 
                    <div className="ui icon input">
                        <input className="prompt" onChange={(e)=>{searchSongs(e)}} type="text" placeholder="Search for songs..."/>
                        <i className="search link icon"></i>
                    </div>  
                </div>
                {/* song search results */}
                <div>
            
                        {results.map(result =>
                            <div className='results' onClick={()=>{addSong(result)}}>
                                {`${result.artists[0].name}-${result.name}`}
                                <img alt='album-cover' src={result.album.images[2].url}/>
                            </div>
                        )}                 
                    
                </div>
                {/* get devices - may not need with spotify player*/}
                {/* <div className="dropdown">
                    <button className="dropbtn" onClick={getDevices}>Find Devices</button>
                    <div className="dropdown-content">
                        {devices.map(device =>
                            <h5 className='item' onClick={()=>setDevice(device.id)}>{device.name}</h5>
                        )}                  
                    </div>
                </div> */}
                <div className="spotifyPlayer">
                    {console.log(queueURI)}
                <SpotifyPlayer 
                    token={user.access}
                    uris = {queueURI}
                    name = 'Playlist Party'
                    persistDeviceSelection = 'true'
                    syncExternalDeviceInterval = '5'
                    magnifySliderOnHover = 'true'
                    styles={{
                        bgColor: '#333',
                        color: '#fff',
                        loaderColor: '#fff',
                        sliderColor: '#1cb954',
                        savedColor: '#fff',
                        trackArtistColor: '#ccc',
                        trackNameColor: '#fff',
                      }}
                />
                </div>
        </div>
        </body> 
    )
}

