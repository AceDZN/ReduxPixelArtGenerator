import React from 'react';
import Route from 'react-router/lib/Route'
import Router from 'react-router/lib/Router'
import hashHistory from 'react-router/lib/hashHistory'
import IndexRedirect from 'react-router/lib/IndexRedirect'

import App from './components/App.jsx';
import PixelCanvas from './components/PixelCanvas.jsx';


module.exports = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route name="PixelCanvas" path="/PixelCanvas" component={PixelCanvas} />
      <IndexRedirect to="/PixelCanvas" />
    </Route>
  </Router>
)
