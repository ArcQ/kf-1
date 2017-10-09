import React from 'react';
import Game from 'game';
import logo from './logo.svg';
import './app.css';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <img alt="logo" src={logo} className="App-logo" />
        <h2>Welcome to React</h2>
      </div>
      <Game />
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
}

export default App;
