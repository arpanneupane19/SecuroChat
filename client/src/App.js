import React from 'react'
import Home from './components/pages/Home';
import Join from './components/pages/Join';
import Chat from './components/pages/Chat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:5000')

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/create'>
            <Home />
          </Route>
          <Route exact path='/join'>
            <Join />
          </Route>
          <Route exact path='/:code?'>
            <Chat />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
