//save playlist to local storage
    // useEffect(()=>{
    //     const data = localStorage.getItem('my-playlist')
    //     if(data){
    //        setPlaylist(JSON.parse(data)) 
    //     }
    // }, [])

    // useEffect(()=>{
    //     localStorage.setItem('my-playlist', JSON.stringify(playlist))
    // }) 
    //end save playlist to local storage 

       //auto-load previous playlist, set first one to current playlist
    // useEffect(()=>{
    //     fetch('http://localhost:5010/playlists',{
    //         method: "GET",
    //     })
    //     .then(res=>res.json())
    //     .then(data=>{localStorage.setItem('my-playlist', JSON.stringify(data[0]))})
    // }, [playlist])




<div>
                
<button onClick={createPlaylist} size='mini' class='ui icon inverted green button'></button>
    <div class="ui secondary inverted menu"> 
        <h1>{`Welcome, ${user.username}`}</h1>
        <div class='right inverted menu'>
            <div class="ui icon input">
                <input onChange={(e)=>{searchSongs(e)}} class="prompt" type="text" placeholder="Search for songs..."/>
                <i class="search link icon"></i>
            </div>  
            <a href="/logout" size='small' className="active inverted green item"> Logout </a>
        </div>
    </div>       
        <div class="ui left floated secondary vertical pointing menu">
            <ul>
                {results.map(result =>
                    <li onClick={()=>{liveQueue(result)}}class='item'>
                        {`${result.artists[0].name}-${result.name}`}
                        <img alt='album-cover' src={result.album.images[2].url}/>
                    </li>
                )}                 
            </ul>
        </div>
        <div class="ui right floated secondary vertical pointing menu">
            <ul>
                {queue.map(song =>
                  <li class='item'>
                      {`${song.song.artist}-${song.song.title}`}
                    <img alt='album-cover' src={song.song.image}/>
                    <button onClick={()=>{removeFromQueue(song)}} size='mini' class='ui icon inverted green button'>
                            <i class='close icon'></i>
                    </button>
                  </li>   
                )}                
            </ul>
        </div>
        <button size='small' className="ui left floated inverted green button" onClick={getDevices}>Find Devices</button>
        <div class="ui secondary vertical pointing menu">
            <ul>
                {devices.map(device =>
                    <li class='item' onClick={()=>setDevice(device.id)}>{device.name}</li>
                )}                  
            </ul>
        </div>
</div>