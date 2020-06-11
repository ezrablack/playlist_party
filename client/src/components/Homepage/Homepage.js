import React from 'react'
import { Button } from 'semantic-ui-react'
import './Homepage.css'

const Homepage = () => {
    
    function handleClick(){
        window.location.replace('http://localhost:5010/spotify')
    }

    return(
        <body className='body'>
            <div>
                 <Button size='medium' inverted color='green' className="ui button medium" onClick={handleClick}>Join The Party</Button>
            </div>
        </body>
    )
}

export default Homepage