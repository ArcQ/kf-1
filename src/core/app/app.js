import React from 'react';
import Game from 'game';
import { MainMenu } from 'ui';
import './styles.css';

function App() {
  return (
    <div className="app">
      <MainMenu />
      <Game />
    </div>
  );
}

export default App;
