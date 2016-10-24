var ReactNative = require('react-native');
var {
  AsyncStorage,
} = ReactNative;

var storageKeys = {
  PUSH_TOKEN : '@RELAND:PUSH_TOKEN',
  LAST_SEARCH : '@RELAND:LAST_SEARCH',

  LOGIN_INFO : '@RELAND:LOGIN_INFO'
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

  //{username, password, sessionCookie}
  setLoginInfo(loginObj) {
    return AsyncStorage.setItem(storageKeys.LOGIN_INFO, JSON.stringify(loginObj));
  }
  getLoginInfo() {
    return AsyncStorage.getItem(storageKeys.LOGIN_INFO).then(ret => {
      console.log("getLoginInfo", ret);
      return JSON.parse(ret);
    });
  }
  removeLogin(){
    AsyncStorage.removeItem(storageKeys.LOGIN_INFO);
  }
}


let localStorage = new LocalStorage();

export default localStorage;