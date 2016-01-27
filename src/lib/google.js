'use strict';

var { NativeAppEventEmitter } = require('react-native');
var GoogleSignin = require('react-native-google-signin');


export default class RwgGoogleSignIn {

  constructor(launchObj) {
    console.log("call constructor of GoogleSignInService")
    this._configureOauth(
      '113039164647-968jspgcqgo1d3pbfn4ghfil77g6l6pq.apps.googleusercontent.com' //RwBDS
    );

    this.launchObj = launchObj;
  }

 _configureOauth(clientId) {
    GoogleSignin.configure(clientId, []);

    NativeAppEventEmitter.addListener('googleSignInError', (error) => {
      console.log('ERROR signin in', error);
      this.launchObj.signInFail(error);
    });

    NativeAppEventEmitter.addListener('googleSignIn', (user) => {
      this.launchObj.signInSuccess(user);
    });

    return true;
  }

  signIn() {
    GoogleSignin.signIn();
  }

  signOut() {
    GoogleSignin.signOut();
  }
};
