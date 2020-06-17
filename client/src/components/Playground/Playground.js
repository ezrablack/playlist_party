import './Playground.css'

import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import socketio from 'socket.io-client'
const socket = socketio('http://localhost:5010')


const Spotify = require('spotify-web-api-js')
const s = new Spotify()

export default function Playground() {
    const [user, setUser] = useState(null)
    const [results, setResults] = useState([])
    const [devices, setDevices] = useState([])
    const [playlistOptions, setOptions] = useState([])
    const [playlist, setPlaylist] = useState(JSON.parse(localStorage.getItem('my-playlist')) || null)
    const [queue, setQueue] = useState(JSON.parse(localStorage.getItem('queue')) || [])
    
    const history = useHistory()

    //socket delete song from queue
    useEffect(()=>{
        if(user !== null){
        socket.on('delete', (track)=>{
            console.log(playlist)
            getQueue(playlist)
        })}
    }, [user])

    //socket add song to queue
    useEffect(()=>{
        if(user !== null){
        socket.on('add', (track)=>{
            console.log(playlist)
            getQueue(playlist)
        })}
    }, [user])

    //call to spotifyRouter to get user data    
    useEffect(() => {
        if(user === null){
        fetch('http://localhost:5010/', { credentials: 'include' })
            .then(res => res.json())
            .then(data => { setUser(data) })}
    }, [user])

    //get previous playlist to browse
    useEffect(() => {
        fetch('http://localhost:5010/playlists', {
            method: "GET",
        })
            .then(res => res.json())
            .then(data => { setOptions(data) })
    }, [playlistOptions.length])

    //user creates collab playlist and sends link to friends. this prevents need for DB and can set playback
    function createPlaylist(e) {
        e.preventDefault()
        var playlistName = e.target.elements.name.value
        var userId = user.spotifyId
        s.setAccessToken(`${user.access}`)
        s.createPlaylist(userId, { name: playlistName, public: false, collaborative: true })
            .then(function (data) {
                fetch('http://localhost:5010/newPlaylist', {
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
                .then(res => res.json())
                .then(newPlaylist => { choosePlaylist(newPlaylist) })
            })
    }

    //choose and set previous playlist to current
    function choosePlaylist(playlist) {
        localStorage.setItem('my-playlist', JSON.stringify(playlist))
        var chosenPlaylist = JSON.parse(localStorage.getItem('my-playlist'))
        setPlaylist(chosenPlaylist)
        getQueue(chosenPlaylist)
    }

  
    //get queue from selected Spotify track
    function getQueue(playlist) {
        if (playlist === null) {
            console.log('no songs added yet')
        } else {
            var currentPlaylist = playlist.playlist.playlistId
            s.setAccessToken(`${user.access}`)
            s.getPlaylistTracks(currentPlaylist)
                .then(data => {
                    liveQueue(data.items)
                })
        }
    }

    //sets current songs to local storage for rendering
    function liveQueue(tracks) {
        localStorage.setItem('queue', JSON.stringify(tracks))
        var newQueue = JSON.parse(localStorage.getItem('queue'))
        setQueue(newQueue)
    }

    //add song to queue
    function addSong(track) {
        socket.emit('add', playlist)
        if(queue.find(song => song.track.uri === track.uri)){
            alert('Song is already on playlist. Please pick another')
        }else{
        s.setAccessToken(`${user.access}`)
        s.addTracksToPlaylist(playlist.playlist.playlistId, [track.uri], function (err, obj) {
            if (err) {
                console.log(err)
            } else {
                getQueue(playlist)
            }
        })}
    }

    //play song from queue
    async function playSong(track){
        console.log(track)
        var song = {uris: [track.track.uri]}
        s.setAccessToken(`${user.access}`)
        await s.play(song, function(err, obj){
            if(err){
                console.log(err)
            }else{
                console.log(obj)
            }
        })

    }

    //delete song from queue
    function removeSong(track) {
        socket.emit('delete', playlist)
        s.setAccessToken(`${user.access}`)
        s.removeTracksFromPlaylist(playlist.playlist.playlistId, [track.track.uri], function (err, obj) {
            if (err) {
                console.log(err)
            } else {
                getQueue(playlist)
            }
        })
    }

    //find available devices
    function getDevices() {
        if(user === null){
            console.log('no user')
        }else{
        s.setAccessToken(`${user.access}`)
        s.getMyDevices().then(
            function (data) {
                var d = data.devices
                var devs = []
                d.map(device => devs.push(device))
                setDevices(devs)
            }
        )}
    }
   
    //set chosen device
    function setDevice(device) {
        var chosenDevice = []
        chosenDevice.push(device)
        chosenDevice.join("")
        s.setAccessToken(`${user.access}`)
        s.transferMyPlayback(chosenDevice)
        setDevices([])
    }

    //song search functionality
    var songQuery = null
    async function searchSongs(e) {
        s.setAccessToken(`${user.access}`)
        if (e.target.value === '') {
            setResults([])
        }
        songQuery = await s.search(e.target.value, ["track", "artist"], { "limit": 10 })
        var tracks = songQuery.tracks.items
        var currentTrack = []
        tracks.forEach(track =>
            currentTrack.push(track)
        )
        setResults(currentTrack)
    }

    //pop up form for new playlist
    function openForm() {
        document.getElementById("myForm").style.display = "block";
      }
      
      function closeForm() {
        document.getElementById("myForm").style.display = "none";
      }

    if(user === null){
        return "Loading"
    }
    return (
        <div className='playOuterContainer'>
            {/* column 1 - chat components */}
            <div className='column'>
                <h5 className='userContainer'> online: </h5>
                <h6 className='userBox'>{user.username}</h6>
            </div>
            {/* column 2 - spotify components */}
            <div className='column'>
                {(playlist !== null) ? <h1 style={{ float: 'left' }}>Current Playlist: {playlist.playlist.title}</h1> : <h1>Create Playlist</h1>}
                <button className='logoutBtn' onClick={() => history.push("/logout")}> Logout </button>
            {/* previous playlists */}
                <div class='dropdown'>   
                    <button className="dropbtn" >Previous Lists</button>
                    <div id='myDropdown' className="dropdown-content">
                        {playlistOptions.map(playlist =>
                            <h4 key={playlist.playlist.playlistId} onClick={() => { choosePlaylist(playlist) }}>{playlist.playlist.title}</h4>
                        )}
                    </div>
                </div>
            {/* get devices */}
                <div className="deviceDropdown">
                    <button className="deviceDropbtn" onMouseOver={getDevices}>Find Devices</button>
                    <div className="deviceDropdown-content">
                        {devices.map(device =>
                            <h4 onClick={()=>setDevice(device.id)}>{device.name}</h4>
                        )}                  
                    </div>
                </div> 
            {/* button to create playlist form */}
                <button onClick={openForm} className='open-button'>New Playlist</button>
            {/* song search bar */}
                <div className='searchInput'>       
                <input className="prompt" onChange={(e) => { searchSongs(e) }} type="text" placeholder="Search for songs..." />
                </div>
                {(results === [] ? 
                    <div className='empty'></div>
                :   
                <div className='search-menu'>
            {/* song search results */}
                    {results.map(result =>
                    <div className='resultCard'>
                        <h5 className='result' onClick={() => { addSong(result) }}>{`${result.artists[0].name}-${result.name}`}
                        <img  className='resultImage' alt='album-cover' src={result.album.images[2].url} />
                        </h5>
                    </div>    
                    )}
                </div>
                )}
            {/* new playlist form */}
                <div className='form-popup' id='myForm'>
                    <form onSubmit={(e)=>createPlaylist(e)} class='form-container'>
                        <label for='playlistName'>Playlist Name</label>
                        <input type="text" name="playlistName" placeholder="The Final Countdown..." required></input>
                        <button type="submit" class='submitBtn'>Submit</button>
                        <button type="submit" class='cancelBtn' onClick={closeForm}>Cancel</button>
                    </form>
                </div>
            {/* Current Queue */}
                <div className="vertical-menu"> 
                    {queue.map(song =>
                    <div className='songCard'>
                        <h5 key={song.added_at} className='queueItem'>{`${song.track.artists[0].name}-${song.track.name}`}
                        <img className='songImage' alt='album-cover' src={song.track.album.images[2].url}></img>
                        <button onClick={() => {removeSong(song)}} size='mini' className='ui right floated icon inverted green button'>
                        <i className='close icon'></i>
                        </button>  
                        <button onClick={()=>{playSong(song)}}size='mini' className='ui right floated icon inverted green button'>
                        <i className='play icon'></i>
                        </button>
                        </h5>
                    </div>    
                    )}
                </div>
        </div>
    </div>
    )
}

