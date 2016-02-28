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

/**
 * ## Actions
 *  The necessary actions for dispatching our bootstrap values
 */
import {setPlatform, setVersion} from './reducers/device/deviceActions';
import {setStore} from './reducers/global/globalActions';


/**
 * ## States
 * There are 4 initial states defined and together they make the Apps
 * initial state
 */

//import authInitialState from './reducers/auth/authInitialState';
import deviceInitialState from './reducers/device/deviceInitialState';
import globalInitialState from './reducers/global/globalInitialState';
//import profileInitialState from './reducers/profile/profileInitialState';

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
    //auth: new authInitialState,
    device: (new deviceInitialState).set('isMobile',true),
    global: (new globalInitialState),
    //profile: new profileInitialState
  };
  return _initState;
}
/**
 * ## Native
 *
 * ```configureStore``` with the ```initialState``` and set the
 * ```platform``` and ```version``` into the store by ```dispatch```.
 * *Note* the ```store``` itself is set into the ```store```.  This
 * will be used when doing hot loading
 */
export default function native(platform) {

  let MainBDS = React.createClass( {
    render() {
      let _initState = getInitialState();
   
      const store = configureStore(_initState);
      store.dispatch(setPlatform(platform));
      store.dispatch(setVersion(VERSION));
      store.dispatch(setStore(store));
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
