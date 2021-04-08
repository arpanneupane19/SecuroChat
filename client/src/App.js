import React from 'react'
import Home from './components/pages/Home';
import Join from './components/pages/Join';
import Chat from './components/pages/Chat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { io } from 'socket.io-client';


const socket = io();

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Home
            socket={socket}
          />
        </Route>
        <Route exact path='/create'>
          <Home
            socket={socket}
          />
        </Route>
        <Route exact path='/join'>
          <Join
            socket={socket}
          />
        </Route>
        <Route exact path='/:code?'>
          <Chat
            socket={socket}
          />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
