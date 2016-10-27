'use strict';

import React from "react";
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import App from './containers/App';
import configureStore from './lib/configureStore';

var Orientation = require('react-native-orientation');


import authInitialState from './reducers/auth/authInitialState';
import globalInitialState from './reducers/global/globalInitialState';
import searchInitialState from './reducers/search/searchInitialState';
import postAdsInitialState from './reducers/postAds/postAdsInitialState';

import {lauchApp, registerPushTokenSuccess} from './reducers/global/globalActions';
import {login} from './reducers/auth/authActions';
import {onSearchFieldChange} from './reducers/search/searchActions';

import DeviceInfo from 'react-native-device-info';

import PushNotification from 'react-native-push-notification';
import userApi from "./lib/userApi";
import localStorage from './lib/localStorage';

var VERSION = '0.0.1';

function getInitialState() {
  const _initState = {
    auth: new authInitialState,
    global: (new globalInitialState),
    search: (new searchInitialState),
    postAds: (new postAdsInitialState),
  };
  return _initState;
}

export default class MainBDS extends React.Component {
  componentWillMount() {
    Orientation.lockToPortrait();
  }

  _initStartupConfiguration(store) {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        let deviceDto = {
          tokenID: token.token,
          tokenOs: token.os,
          deviceModel: DeviceInfo.getModel(),
          deviceID: DeviceInfo.getUniqueID()
        };
        let data = {
          appInfo: {
            version: VERSION
          },
          deviceInfo : deviceDto
        };

        store.dispatch(lauchApp(data));

        userApi.updateDevice(deviceDto)
          .then((res) => {
            if (res.status && res.status > 0) {
              //error
            } else {
              store.dispatch(registerPushTokenSuccess(data));
            }
          });
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },

      // ANDROID ONLY: (optional) GCM Sender ID.
      senderID: "YOUR GCM SENDER ID",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * IOS ONLY: (optional) default: true
       * - Specified if permissions will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });

    // init diaChinh by getting value from lastsearch
    // TODO: need to implement if last search only contain GEO location
    localStorage.getLastSearch().then( (ret) => {
      if (ret){
        let lastSearch = JSON.parse(ret);
        if (lastSearch.query && lastSearch.query.diaChinh){
          store.dispatch(onSearchFieldChange('diaChinh', lastSearch.query.diaChinh));
          store.dispatch(onSearchFieldChange('viewport', undefined));
          store.dispatch(onSearchFieldChange('diaChinhViewport', undefined));
        }
      }
    });

    // auto login if save password
    localStorage.getLoginInfo().then( (ret)=> {
      if (ret){
        console.log("call auto login");
        store.dispatch(login(ret.username, ret.password))
      }
    });
  }


  render() {
    var _initState = getInitialState();

    let deviceInfo = {
      deviceModel: DeviceInfo.getModel(),
      deviceID: DeviceInfo.getUniqueID()
    };
    let data = {
      appInfo: {
        version: VERSION
      },
      deviceInfo : deviceInfo
    };
    let global = _initState.global;
    global = global
      .set('appInfo',data.appInfo)
      .set('deviceInfo',data.deviceInfo);
    _initState.global = global;

    const store = configureStore(_initState);

    this._initStartupConfiguration(store);

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );

  }
}

