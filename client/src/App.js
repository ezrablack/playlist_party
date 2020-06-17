import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import Homepage from './components/Homepage/Homepage' 
import Playground from './components/Playground/Playground'
import Logout from './components/Logout/Logout'
import Layout from './components/Layout'

const App = () => {
    return (
        <Router>
            <Route path='/layout' exact component={Layout}/>
            <Route path='/' exact component={Homepage} />
            <Route path='/playground' exact component={Playground}/>
            <Route path='/logout' exact component={Logout}/>
        </Router>
    )
}

export default App