import React, { useState, useEffect } from 'react'
// import { Button} from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import './Playground.css'

const Spotify = require('spotify-web-api-js')
const s = new Spotify()

export default function Playground(){
    const [user, setUser] = useState('')
    const [results, setResults] = useState([])
    const [devices, setDevices] = useState([])
    const history = useHistory()
    
    useEffect(()=>{
        fetch('http://localhost:5010/', { credentials: 'include'})
        .then(res=>res.json())
        .then(data=>{setUser(data)})
    }, []) 

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
    }

    //song search functionality
    var songQuery = null 
    async function searchSongs(e){
        console.log(e.target.value)
        s.setAccessToken(`${user.access}`)
        if (e.target.value === ''){
            setResults([])
        }
        songQuery = await s.search(e.target.value, ["track", "artist"], {"limit":10} )
        var tracks = songQuery.tracks.items
        var currentTrack = []
        tracks.forEach(track =>{ 
                // let uri = track.uri;
                var title = track.name;
                var artistName = track.artists[0].name
                var song = `${artistName} - ${title}`
                currentTrack.push(song)
            })
            setResults(currentTrack)
            // selectedTrack(uri, track)
    }

    //log user out
    function Logout(){
        history.push('/logout')
    }
    return(
        <body className='body'>
        <div>
                <div class='ui inverted menu'>
                    <button onClick={Logout} size='small' className="ui inverted green button"> Logout </button>
                    <button size ='small' className="ui inverted green button"> Join room</button>
                    <button size ='small' className="ui inverted green button"> Playlist History</button>
                </div>
                    <h1> Welcome, {user.username} </h1>
                <div>
                    <div class="ui search">
                        <input onChange={(e)=>{searchSongs(e)}} class="prompt" type="text" placeholder="Search for songs..."/>
                    </div>  
                    <div class="ui secondary vertical pointing menu">
                        <ul>
                            {results.map(result =>
                                <li class='item'>{result}</li>
                            )}                  
                        </ul>
                    </div>
                    <button size='small' className="ui inverted green button" onClick={getDevices}>Find Devices</button>
                    <div class="ui secondary vertical pointing menu">
                        <ul>
                            {devices.map(device =>
                                <li class='item' onClick={()=>setDevice(device.id)}>{device.name}</li>
                            )}                  
                        </ul>
                    </div>
                </div>
        </div>
    </body>
    )
}

