import React from 'react'
import { Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import './Logout.css'

const Login = () => {
    const history = useHistory()

    function handleClick(){
        history.push('/')
    }
    return(
        <body className='body'>
            <div className='logoutContainer'>
                <Button id='button' inverted color='green' size ='small' className="ui button"
                onClick={handleClick}
                >Hop Back In!</Button>
                <h1 className='logoutMessage'> Thanks For Coming To The Party! </h1>
            </div>
        </body>
    )
}

export default Login