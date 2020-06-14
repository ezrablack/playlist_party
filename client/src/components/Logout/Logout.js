import React from 'react'
import { Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'


const Login = () => {
    const history = useHistory()

    function handleClick(){
        history.push('/')
    }
    return(
        <body className='body'>
            <div className='homeOuterContainer'>
                <Button inverted color='green' size ='small' className="ui button"
                onClick={handleClick}
                >Hop Back In!</Button>
                <div className='logoutMessage'>
                    <h1> Thanks For Coming To The Party! </h1>
                </div>
            </div>
        </body>
    )
}

export default Login