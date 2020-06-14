import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

// import Join from './components/Join/Join'
// import Chat from './components/Chat/Chat'
import Homepage from './components/Homepage/Homepage'
import Login from './components/Login/Login'
import Playground from './components/Playground/Playground'
import Logout from './components/Logout/Logout'

const App = () => {
    return (
        <Router>
            <Route path='/' exact component={Homepage} />
            <Route path='/playground' exact component={Playground}/>
            <Route path='/login' exact component={Login}/>
            <Route path='/logout' exact component={Logout}/>
            {/* <Route path='/join' exact component={Join}/> */}
            {/* <Route path='/chat' component={Chat}/> */}
        </Router>
    )
}

export default App