import React from 'react';
import PropTypes from 'prop-types';
import Game from 'game';
import Ui from 'ui';

import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import 'sanitize.css/sanitize.css';

import configureStore from 'shared/store/store';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();
const store = configureStore(history);

export default function App(props) {
  return (
    <div className="app">
      <Ui />
      <Game store={props.store} />
    </div>
  );
}

App.propTypes = {
  store: PropTypes.shape({}),
};

ReactDOM.render(
  (<Provider store={store}>
    <App store={store} />
  </Provider>),
  document.getElementById('root'),
);

registerServiceWorker();
