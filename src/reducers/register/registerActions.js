'use strict';

const {
  ON_REGISTER_FIELD_CHANGE,
  REGISTER_SUCCESS
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

//just for checking
export function requestRegisterByPhone(phone) {
  return dispatch => {
    //dispatch(loginRequest());
    return userApi.requestVerifyCode(phone)
      .then(function (json) {
        log.info("requestRegisterByPhone.requestVerifyCode:", json);

        if (json.status===0) {
          dispatch(onRegisterFieldChange('serverVerifyCode', json.verifyCode));
        }

        return json;
      });
  };
}

export function registerUser(dto) {
  return dispatch => {
    return userApi.signup(dto)
      .then(function (json) {
        if (json.status===0) {
          //dispatch(onRegisterFieldChange('serverVerifyCode', json.verifyCode));
        }

        return json;
      });
  };
}

export function registerSuccess(userDto) {
  return {
    type: REGISTER_SUCCESS,
    payload: userDto
  };
}








