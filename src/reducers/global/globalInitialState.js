'use strict';

import {Record} from 'immutable';

var InitialState = Record({
  currentUser: new (Record({
  	userID : null,
    token:'',
  	fullName : '',
    phone : '',
    email: '',
    avatar:'',
    adsLikes : [],
    saveSearch : [],
    mainAccount: 0,
    bonusAccount: 0
  })),

  setting: {
    autoLoadAds : false
  },

  deviceInfo : {
    deviceID : null,
    deviceModel: null,
    tokenID : null,
    tokenOs : null,
    tokenRegistered: false
  },

  appInfo : {
    version : null,
    platform: null
  },

  loggedIn : false,
  savedPassword: false,
  scene : {},
  prevScene: {}
});

export default InitialState;
