import { moveCharF } from './update-functions';

export function eventControl(opts, inputDef) {
  switch (inputDef.type) {
    case 'click': {
      moveCharF('goblin', inputDef, opts);
      break;
    }
    case 'moveChar': {
      moveCharF(inputDef.charKey, inputDef, opts);
      break;
    }
    default:
  }
}

export default function update(gameLoopAttrs, deltaTime, inputState) {
  if (inputState.length > 0) {
    inputState.map(
      (def) => {
        const obsDict = eventControl(gameLoopAttrs, def);
        return obsDict;
      },
    );
  }
}

/**
 * startEndFs - functions injected on start and on end of update function given current event
 */
export const startEndFs = {
  charMove: {
    start(updateGameState, inputDef) {
      console.log(updateGameState);
      updateGameState({
        moveTargetCircle: {
          pos: inputDef.pos,
          isShow: true,
        },
      });
    },
    end(updateGameState) {
      updateGameState({
        moveTargetCircle: {
          isShow: false,
        },
      });
    },
  },
};
