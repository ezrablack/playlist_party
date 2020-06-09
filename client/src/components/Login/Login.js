import React from 'react'
import { useHistory } from 'react-router-dom'


const Login = () => {
    const history = useHistory()

    function handleClick(){
        history.push('/join')
    }
    return(
        <div className='homeOuterContainer'>
                <h1
                onClick={handleClick}
                >You're logged in</h1>
        </div>
    )
}

export default Login