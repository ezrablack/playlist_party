import React, { Component } from 'react'
import ReactMediaVisualizer from 'react-media-visualizer'

export default class Player extends Component {

  constructor(props) {
    super(props)
    this.state = {
      playlist: ['https://api.spotify.com/v1/tracks/0vAb3U3NJhiuib2B7sJdeJ'],
      playlistIsPlaying: false,
      currentSongIndex: 0,
      theme: 'spotify'
    }
    // this.receiveStateUpdates = this.receiveStateUpdates.bind(this)
  }
 
  // {
  //   "updatePlaylist": "ƒ bound value() {}",
  //   "currentSongIndex": 2,
  //   "playlist": [
  //     "static/Random Access Memories/Give%20Life%20Back%20to%20Music.mp3",
  //     "static/Random Access Memories/The%20Game%20of%20Love.mp3",
  //     "static/Random Access Memories/Giorgio%20by%20Moroder.mp3",
  //     "static/Random Access Memories/Within.mp3",
  //     "static/Random Access Memories/Instant Crush.mp3",
  //     "static/Random Access Memories/Lose Yourself To Dance.mp3",
  //     "static/Random Access Memories/Touch (feat. Paul Williams).mp3",
  //     "static/Random Access Memories/Get Lucky (feat. Pharrell Williams).mp3",
  //     "static/Random Access Memories/Beyond.mp3",
  //     "static/Random Access Memories/Motherboard.mp3",
  //     "static/Random Access Memories/Fragments of Time (feat. Todd Edwards).mp3",
  //     "static/Random Access Memories/Doin' It Right (feat. Panda Bear).mp3",
  //     "static/Random Access Memories/Contact.mp3",
  //     "static/Random Access Memories/Horizon.mp3"
  //   ],
  //   "theme": "spotify",
  //   "handleThemeChange": "ƒ bound value() {}",
  //   "playlistIsPlaying": false
  // }
  
  
  render() {

    return (
      <React.Fragment>
        <div className="content">
          Wrap the content of your webpage in here
          {console.log(this.state.playlist)}
          {/* {console.log(this.state.playlist)} */}
        </div>
        <ReactMediaVisualizer
          playlist={this.state.playlist}
          receiveStateUpdates={this.receiveStateUpdates}
          playlistIsPlaying={this.state.playlistIsPlaying}
          theme={this.state.theme}
          currentSongIndex={this.state.currentSongIndex} />
      </React.Fragment>
    )
  }

  receiveStateUpdates(payload) {
    console.log(payload)
    if (payload.theme) {
      switch (payload.theme) {
        case 'spotify':
          document.documentElement.style.setProperty('--content-height', '82px')
          break
        case 'youtube':
          document.documentElement.style.setProperty('--content-height', '72px')
          break
        case 'soundcloud':
          document.documentElement.style.setProperty('--content-height', '48px')
          break
        default:
          break
      }
    }
    this.setState(payload)
  }
}