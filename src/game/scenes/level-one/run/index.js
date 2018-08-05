import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { buffer, filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

import createGameLoop from 'game/engine/game-loop';
import { codeToKey } from 'utils/keyCodes';
import { createGoblin } from './sprites/goblin';
import createTiledMap from './tile-maps/create-tile-map';

// This is our core stream of keyDown input events. It emits an object like `{"spacebar": 32}`
//  each time a key is pressed down.

const gameState$ = new BehaviorSubject({});

function render(state) {};

function update(deltaTime, state, inputState) {
  render(state);
  return state;
}

export function startScene(stage, sceneCustomRes) {
  const tileMap = createTiledMap(sceneCustomRes.gameMap);
  tileMap.map(tile => stage.addChild(tile));

  const goblin = createGoblin();
  stage.addChild(goblin);
}

export default function runLevelOne(stage, sceneCustomRes) {
  startScene(stage, sceneCustomRes);
  const frames$ = createGameLoop(obsGetterList, update, gameState$);
  frames$.subscribe((gameState) => {
    // render(gameState);
  });
}

const obsGetterList = [
  function getKeysDownPerFrame(frames$) {
    const keysDown$ = fromEvent(document, 'keydown')
      .pipe(
        map((event) => {
          const name = codeToKey(event.keyCode);
          if (name !== '') {
            const keyMap = {};
            keyMap[name] = event.code;
            return keyMap;
          }
          return undefined;
        }),
        filter(keyMap => keyMap !== undefined),
      );

    // Here we buffer our keyDown stream until we get a new frame emission. This
    //  gives us a set of all the keyDown events that have triggered since the previous
    //  frame. We reduce these all down to a single dictionary of keys that were pressed.
    const keysDownPerFrame$ = keysDown$
      .pipe(
        buffer(frames$),
        map(frames => frames.reduce(
          (prev, curr) => ({ ...prev, ...curr }), {},
        )),
      );

    return keysDownPerFrame$;
  },
];
