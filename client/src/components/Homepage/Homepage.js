import React from 'react'
// import { useHistory } from 'react-router-dom'
import './Homepage.css'

const Homepage = () => {
    // const history = useHistory()
    
    function handleClick(){
        // history.push('http://localhost:5010/login')
        window.location.replace('http://localhost:5010/login')
        // console.log('hi')
    }

    return(
        <div className='homeOuterContainer'>
                <h1
                onClick={handleClick}
                >Join The Party</h1>
        </div>
    )
}

export default Homepage