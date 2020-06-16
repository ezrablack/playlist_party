import React from 'react'

import './Homepage.css'

const Homepage = () => {
    
    function handleClick(){
        window.location.replace('http://localhost:5010/spotify')
    }

    return(
        <body className='homeOuterContainer'>
            <div >
                 <button className='loginButton' onClick={handleClick}>Join The Party</button>
            </div>
        </body>
    )
}

export default Homepage