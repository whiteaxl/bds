var ReactNative = require('react-native');
var {
  AsyncStorage,
} = ReactNative;

var storageKeys = {
  PUSH_TOKEN : '@RELAND:PUSH_TOKEN',
  LAST_SEARCH : '@RELAND:LAST_SEARCH'
};

class LocalStorage {
  setPushToken(token) {
    AsyncStorage.setItem(storageKeys.PUSH_TOKEN, token);
  }
  getPushToken() {
    return AsyncStorage.getItem(storageKeys.PUSH_TOKEN, token);
  }

  /*
   searchObj : {
     name : 'Search at ' + moment().format("DD-MM-YYYY HH:mm:ss"),
     timeModified : new Date().getTime(),
     query : query,
     isRecent : true,
     desc: findApi.convertQuery2String(query),
   }
   */
  setLastSearch(searchObj) {
    return AsyncStorage.setItem(storageKeys.LAST_SEARCH, searchObj);
  }
  getLastSearch() {
    return AsyncStorage.getItem(storageKeys.LAST_SEARCH);
  }
}


let localStorage = new LocalStorage();

export default localStorage;