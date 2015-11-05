import 'bootstrap/dist/css/bootstrap.min.css'
import './client.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { createHistory } from 'history';

import Main from './components/main'
import TodoApp from './components/todo-app'

const history = createHistory();

const routes = (
  <Router history={history}>
    <Route path="/:boardId" component={TodoApp}>
    </Route>
  </Router>
);

ReactDOM.render(
  routes,
  document.getElementById('app')
);
