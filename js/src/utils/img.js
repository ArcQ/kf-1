import config from 'config.json';

export function getImgSrc(path) {
  return `${config.game.assetUrl}${path}`;
}

export default {};
