import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
// import { actions as appActions } from 'containers/App/ducks';
import { getWindow } from 'utils/global';

import createReducer from './reducers';

// import perflogger from 'redux-perf-middleware';
// import Perf from 'react-addons-perf';
// window.Perf = Perf;

const composeEnhancers = getWindow()
  && getWindow().__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  && process.env.NODE_ENV !== 'production'
  // ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: ['rrf'] }) : compose;
  ? getWindow().__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

export default function configureStore(initialState, history) {
  const enhancers = [
    applyMiddleware(
      routerMiddleware(history),
    ),
  ];

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );

  // Extensions
  store.asyncReducers = {}; // Async reducer registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    const dynamicImport = (route) => new Promise((resolve) => require([route], resolve)); //eslint-disable-line
    module.hot.accept('./reducers', () => {
      dynamicImport('./reducers').then((reducerModule) => {
        const createReducers = reducerModule.default;
        const nextReducers = createReducers(store.asyncReducers);

        store.replaceReducer(nextReducers);
      });
    });
  }
  // if (getWindow()) {
  //   getWindow().onfocus = () => store.dispatch(appActions.setWindowStatus(true));
  //   getWindow().onblur = () => store.dispatch(appActions.setWindowStatus(false));
  // }

  return store;
}
