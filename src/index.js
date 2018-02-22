import React from 'react';
import PropTypes from 'prop-types';
import Game from 'game';
import { lifecycle } from 'recompose';
import Ui from 'ui';

import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import 'sanitize.css/sanitize.css';

import configureStore from 'shared/store/store';
import './tachyons.css';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();
const store = configureStore({}, history);

function App(props) {
  return (
    <div className="app">
      <Ui history={props.history} />
      <Game store={props.store} />
    </div>
  );
}

App.propTypes = {
  store: PropTypes.shape({}),
  history: PropTypes.shape({}),
};

const EnhancedApp = lifecycle({
  componentWillMount() {
    history.replace('/');
  },
})(App);

ReactDOM.render(
  (<Provider store={store}>
    <EnhancedApp store={store} history={history} />
  </Provider>),
  document.getElementById('root'),
);

registerServiceWorker();

export default EnhancedApp;
