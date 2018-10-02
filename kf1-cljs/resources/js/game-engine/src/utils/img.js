const assetUrl = process.env.REACT_APP_ASSET_URL;

export function getImgSrc(path) {
  return `${assetUrl}${path}`;
}

export default {};
