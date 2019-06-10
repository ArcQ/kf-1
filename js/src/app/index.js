import React from 'react';
import { replace } from 'react-router-redux';
import PropTypes from 'prop-types';
import { lifecycle } from 'recompose';
import Game from './game';
import Ui from './ui';

function App(props) {
  return (
    <div className="app">
      <Ui history={props.history} />
      <Game store={props.store} />
    </div>
  );
}

App.propTypes = {
  store: PropTypes.shape({}),
  history: PropTypes.shape({}),
};


export default lifecycle({
  componentWillMount() {
    replace('/');
  },
})(App);
