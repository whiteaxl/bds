// Api.js

import ApiUtils from './ApiUtils';

import cfg from "../cfg";

var requestVerifyCodeUrl = cfg.rootUrl + "/user/requestVerifyCode";

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
  }
};

export {userApi as default};
