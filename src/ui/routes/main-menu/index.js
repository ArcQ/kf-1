import React from 'react';
import sceneManager from 'game/engine/scene-manager';

export default function MainMenu() {
  return (
    <div className="ui-layer">
      <h2 className="f2">Welcome to kf1</h2>
      <button
        onClick={() => sceneManager.pushScene('levelOne')}
        className="white border-button f2 pointer"
      >
        Start
      </button>
    </div>
  );
}

MainMenu.propTypes = {};
