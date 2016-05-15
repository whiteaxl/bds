'use strict';

/**
 * ## imports
 * * ```Provider``` will tie the React-Native to the Redux store
 * * ```App``` main page 
 * * ```configureStore``` will connect the ```reducers```, the
 * ```thunk``` and the initial state.
 */
import React, { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './lib/configureStore';

import db from "./lib/localDB";

var Orientation = require('react-native-orientation');

/**
 * ## States
 * There are 4 initial states defined and together they make the Apps
 * initial state
 */

import authInitialState from './reducers/auth/authInitialState';
import globalInitialState from './reducers/global/globalInitialState';
import searchInitialState from './reducers/search/searchInitialState';

import {lauchApp} from './reducers/global/globalActions';
import DeviceInfo from 'react-native-device-info';



/**
 *  The version of the app but not  displayed yet
 */
var VERSION='0.0.1';

/**
 *
 * ## Initial state
 * Create instances for the keys of each structure
 * @returns {Object} object with 4 keys
 */
function getInitialState() {
  const _initState = {
    auth: new authInitialState,
    global: (new globalInitialState),
    search: (new searchInitialState),
  };
  return _initState;
}

export default function native(platform) {

  let MainBDS = React.createClass( {
    componentWillMount() {
      Orientation.lockToPortrait();
    },

    componentDidMount() {

    },

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
          platform : platform,
        }
      };

      store.dispatch(lauchApp(data));

      /**
       * Provider wrap the ```App``` with a ```Provider``` and both
       * have a ```store```
       */
      return (
        <Provider store={store}>
          <App/>
        </Provider>
      );

    }
  });
 
  AppRegistry.registerComponent('bds', () => MainBDS);

}
