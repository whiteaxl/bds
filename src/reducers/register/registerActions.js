'use strict';

const {
  ON_REGISTER_FIELD_CHANGE,
} = require('../../lib/constants').default;

const _ = require('lodash');

import userApi from "../../lib/userApi";
import log from "../../lib/logUtil";

export function onRegisterFieldChange(field, value) {
  return {
    type: ON_REGISTER_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function registerByPhone(phone) {
  return dispatch => {
    //dispatch(loginRequest());
    return userApi.requestVerifyCode(phone)
      .then(function (json) {
        log.info("registerByPhone.requestVerifyCode:", json);

        if (json.status===0) {
          dispatch(onRegisterFieldChange('serverVerifyCode', json.verifyCode));
        }

        return json;
      });
  };
}



