var ReactNative = require('react-native');
var {
  AsyncStorage,
} = ReactNative;

var storageKeys = {
  PUSH_TOKEN : '@RELAND:PUSH_TOKEN'
};

class LocalStorage {
  setPushToken(token) {
    AsyncStorage.setItem(storageKeys.PUSH_TOKEN, token);
  }
  getPushToken(token) {
    AsyncStorage.getItem(storageKeys.PUSH_TOKEN, token);
  }
}


let localStorage = new LocalStorage();

export default localStorage;