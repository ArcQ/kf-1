(ns kf1.views.game.scenes.loading.main
  (:require
    [re-frame.core :as re-frame]
    [kf1.subs :as subs]
    ))
import sceneManager from 'game/engine/scene-manager';

export default function MainMenu() {
  return (
    <div className="ui-layer">
      <h2 className="f2">
        Welcome to kf1
      </h2>
      <button
        type="button"
        onClick={() => sceneManager.pushScene('levelOne')}
        className="white border-button f2 pointer"
      >
        Start
      </button>
    </div>
  );
}

MainMenu.propTypes = {};
