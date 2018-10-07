import { getImgSrc } from './img';
import request from './request';

export default (engine) => ({
  request,
  getImgSrc: getImgSrc(engine),
});
