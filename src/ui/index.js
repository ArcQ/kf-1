import React from 'react';
import PropTypes from 'prop-types';

import _MainMenu from './main-menu';

export const MainMenu = _MainMenu;

export default function UI(props) {
  return <div className="ui-layer full-screen">
    {
      <MainMenu />
    }
  </div>;
}

UI.propTypes = {
  type: PropTypes.string,
};
