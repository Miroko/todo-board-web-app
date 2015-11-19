import 'bootstrap/dist/css/bootstrap.min.css'
import './client.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { createHistory } from 'history';

import TodoAppView from './app/todo-app-view'

const history = createHistory();

const routes = (
  <Router history={history}>
    <Route path="/*" component={TodoAppView}>
    </Route>
  </Router>
);

ReactDOM.render(
  routes,
  document.getElementById('app')
);
