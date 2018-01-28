import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import 'sanitize.css/sanitize.css';

import App from 'core/app/app';
import configureStore from 'core/shared/store/store';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  (<Provider store={store}>
    <App store={store} />
  </Provider>),
  document.getElementById('root'),
);

registerServiceWorker();
