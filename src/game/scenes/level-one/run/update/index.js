import { moveCharF } from './update-functions';
import battleGround from 'battleground/out/battle.core';

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
    console.log(battleGround.start());
    // battleGroundStart();
    const obsArr = inputState.map(
      (def) => {
        const obsDict = eventControl(gameLoopAttrs, def);
        return obsDict;
      },
    );
  }
}
