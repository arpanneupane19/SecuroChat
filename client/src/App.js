import React from 'react'
import Home from './components/pages/Home';
import Join from './components/pages/Join';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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
        </Switch>
      </Router>
    </div>
  )
}

export default App
