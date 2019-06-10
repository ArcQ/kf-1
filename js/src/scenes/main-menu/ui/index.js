import React from 'react';
import engine from 'kf-game-engine';

export default function MainMenu() {
  return (
    <div className="ui-layer">
      <h2 className="f2">
        Welcome to kf1
      </h2>
      <button
        type="button"
        onClick={() => engine.sceneManager.pushScene('levelOne')}
        className="white border-button f2 pointer"
      >
        Start
      </button>
    </div>
  );
}

MainMenu.propTypes = {};
