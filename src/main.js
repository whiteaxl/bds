'use strict';

import React from "react";
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './lib/configureStore';

var Orientation = require('react-native-orientation');


import authInitialState from './reducers/auth/authInitialState';
import globalInitialState from './reducers/global/globalInitialState';
import searchInitialState from './reducers/search/searchInitialState';

import {lauchApp} from './reducers/global/globalActions';
import DeviceInfo from 'react-native-device-info';

var VERSION='0.0.1';

function getInitialState() {
  const _initState = {
    auth: new authInitialState,
    global: (new globalInitialState),
    search: (new searchInitialState),
  };
  return _initState;
}

export default class MainBDS extends React.Component {
    componentWillMount() {
      Orientation.lockToPortrait();
    }

    componentDidMount() {
    }

    render() {
      let _initState = getInitialState();
   
      const store = configureStore(_initState);

      let data = {
        deviceInfo: {
          ID: DeviceInfo.getUniqueID(),
          model: DeviceInfo.getModel(),
        },
        appInfo : {
          version : VERSION,
        }
      };

      store.dispatch(lauchApp(data));

      return (
        <Provider store={store}>
          <App/>
        </Provider>
      );

    }
  }
