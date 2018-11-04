import { getImgSrc } from './img';
import request from './request';
import { MemoryFactory, runOnWasmLoad } from 'utils/wasm.utils';

export default (engine) => ({
  request,
  getImgSrc: getImgSrc(engine),
  MemoryFactory,
  runOnWasmLoad,
});
