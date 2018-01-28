import React from 'react';
import PropTypes from 'prop-types';
import Game from 'game';
import { MainMenu } from 'ui';
import './styles.css';

function App(props) {
  return (
    <div className="app">
      <MainMenu />
      <Game store={props.store} />
    </div>
  );
}

App.propTypes = {
  store: PropTypes.shape({}),
};

export default App;
