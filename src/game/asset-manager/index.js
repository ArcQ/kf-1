import * as PIXI from 'pixi.js';
import dicts from './dicts';

const assetUrl = process.env.REACT_APP_ASSET_URL;

function onFinishLoad(resources, resolve) {
  resolve(true);
}

export function load(dictName) {
  return new Promise(resolve =>
    Object.keys(dicts[dictName])
    .reduce((loader, key) =>
      loader.add(`${dictName}_${key}`, `${assetUrl}${dicts[dictName][key]}`), PIXI.loader,
    )
    .load((loader, resources) => onFinishLoad(resources, resolve)),
  );
}

export function getSprite(dictName, key) {
  console.log(arguments);
  return new PIXI.Sprite(
    PIXI.loader.resources[`${dictName}_${key}`].texture,
  );
}

export default {};
