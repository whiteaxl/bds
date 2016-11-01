// Api.js

import ApiUtils from './ApiUtils';

import cfg from "../cfg";
import log from "./logUtil";
import gui from "./gui";

var userApiUrl = cfg.rootUrl + "/user/";
var requestVerifyCodeUrl = userApiUrl + "requestVerifyCode";
var registerUser = userApiUrl + "registerUser";
var likeAdsUrl = cfg.rootUrl + "/likeAds";
var unlikeAdsUrl = cfg.rootUrl + "/unlikeAds";
var getAdsLikesUrl = cfg.rootUrl + "/user/getAdsLikes";
var getMyAdsUrl = cfg.rootUrl + "/user/getMyAds";
var getUpdateAdsUrl = cfg.rootUrl + "/user/getUpdateAds";
var deleteAdsUrl = cfg.rootUrl + "/user/deleteAds";
var saveSearchUrl = cfg.rootUrl + "/saveSearch";
var loginUrl = cfg.rootUrl + "/login";
var signUrl = cfg.rootUrl + "/signup";
var profileUrl = cfg.rootUrl + "/profile";
var updateProfileUrl = cfg.rootUrl + "/updateProfile";
var changePasswordUrl = cfg.rootUrl + "/changePassword";

var userApi = {
  requestVerifyCode(phone) {
    var params = {
      'phone': phone
    };
    return fetch(`${requestVerifyCodeUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        console.log("Response requestVerifyCode", response);
        return response.json()
      })
      .catch(e => {
        console.log("Error in requestVerifyCode", e);
        return e
      });
  },

  login(username, password){
    var params = {
      'phone': undefined,
      'email' : undefined,
      'matKhau' : password
    };

    if (username.indexOf("@") > -1) {
      params.email = username;
    } else {
      params.phone = username;
    };
    
    log.info("fetch ", params, loginUrl);

    return fetch(`${loginUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        log.info("Response of login", response);
        return response.json()
      })
      .catch(e => {
        log.info("Error in login", e);
        return {
          status : 101,
          msg: gui.ERR_LoiKetNoiMayChu
        }
      });
  },

  signup(userDto) {
    var params = {
      'phone': userDto.phone,
      'email': userDto.email,
      'fullName' : userDto.fullName,
      'matKhau' : userDto.matKhau,
      'avatar' : userDto.avatar || undefined,
      'deviceID': userDto.deviceID || undefined,
      'deviceModel': userDto.deviceModel || undefined,
    };

    log.info("fetch ", params, registerUser);

    return fetch(`${signUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          log.info("Response of signup", response);
          return response.json()
        })
        .catch(e => {
          log.info("Error in signup", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  registerUser(userDto) {
    var params = {
      'phone': userDto.phone,
      'fullName' : userDto.fullName,
      'matKhau' : userDto.matKhau,
      'avatar' : userDto.avatar || undefined
    };

    log.info("fetch ", params, registerUser);

    return fetch(`${registerUser}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        log.info("Response of registerUser", response);
        return response.json()
      })
      .catch(e => {
        log.info("Error in registerUser", e);
        return {
          status : 101,
          msg: gui.ERR_LoiKetNoiMayChu
        }
      });
  },

  //tokenID and deviceID
  updateDevice(tokenDto) {
    const url  = `${userApiUrl}updateDevice`;
    log.info("fetch ", url, tokenDto);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tokenDto)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        return response.json()
      })
      .catch(e => {
        log.info("Error in updateDevice", e);
        return {
          status : 101,
          msg: gui.ERR_LoiKetNoiMayChu
        }
      });
  },

  //{userID and adsID}
  likeAds(dto) {
    const url  = likeAdsUrl;
    log.info("Call fetch ", url, dto);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        return response.json()
      })
      .catch(e => {
        log.info("Error in likeAds", e);
        return {
          status : 101,
          msg: gui.ERR_LoiKetNoiMayChu
        }
      });
  },

  //{userID and adsID}
  unlikeAds(dto) {
    const url  = unlikeAdsUrl;
    log.info("Call fetch ", url, dto);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in unlikeAds", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  getAdsLikes(userID) {
    const url  = getAdsLikesUrl;
    const dto = {userID};
    log.info("Call fetch ", url, userID);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        return response.json()
      })
      .catch(e => {
        log.info("Error in getAdsLikes", e);
        return {
          status : 101,
          msg: gui.ERR_LoiKetNoiMayChu
        }
      });
  },

  getMyAds(userID) {
    const url  = getMyAdsUrl;
    const dto = {userID};
    log.info("Call fetch ", url, userID);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in getAdsLikes", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  getUpdateAds(adsID, token) {
    const url  = getUpdateAdsUrl;
    const dto = {adsID: adsID};
    log.info("Call fetch ", url, adsID);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(dto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in getAdsLikes", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  profile(userID, token){
    const url  = profileUrl;
    var dto = {userID};

    log.info("Call fetch ", url, userID);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(dto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in get user information", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  updateProfile(userDto, token){
    const url  = updateProfileUrl;

    log.info("Call fetch ", url, userDto);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(userDto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in update profile", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  changePassword(dto, token){
    const url  = changePasswordUrl;

    log.info("Call fetch ", url);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(dto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in update profile", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  deleteAds(dto, token){
    const url  = deleteAdsUrl;

    log.info("Call fetch ", url);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(dto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in update profile", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  },

  saveSearch(dto, token) {
    const url  = saveSearchUrl;
    const {query} = dto;
    log.info("Call fetch ", url, query);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(dto)
    })
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json()
        })
        .catch(e => {
          log.info("Error in getAdsLikes", e);
          return {
            status : 101,
            msg: gui.ERR_LoiKetNoiMayChu
          }
        });
  }

};

export {userApi as default};
