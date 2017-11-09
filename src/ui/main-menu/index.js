import React from 'react';
import logo from './logo.svg';

export default function MainMenu() {
  return (
    <div className="main-menu">
      <img alt="logo" src={logo} className="app-logo" />
      <h2>Welcome to React</h2>
    </div>
  );
}

MainMenu.propTypes = {};
