// abstract away uses of window in case of ssr
import engine from 'kf-game-engine';
import { mapObjIndexed } from 'ramda';

const _window = window;
const _document = document;
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !_window.MSStream;

export const getWindow = () => window;
export const getDocument = () => document;

export const getWWidth = () => ((iOS) ? _window.screen.width : _window.innerWidth
  || _document._documentElement.clientWidth
  || _document.body.clientWidth);

export const getWHeight = () => ((iOS) ? _window.screen.height : _window.innerHeight
  || _document._documentElement.clientHeight
  || _document.body.clientHeight);

export const getWDimensions = () => ({ wWidth: getWWidth(), wHeight: getWHeight() });

export const getGameDimensions = () =>
  mapObjIndexed(v => v * engine.scale,
    engine.web.screen.bounds);

export const { devicePixelRatio } = _window;
