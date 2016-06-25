'use strict';

const {
  ON_ADSMGMT_FIELD_CHANGE,
} = require('../../lib/constants').default;

import log from "../../lib/logUtil";

import userApi from '../../lib/userApi';

export function onAdsMgmtFieldChange(field, value) {
  return {
    type: ON_ADSMGMT_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}


// likedList get from Server
export function loadAdsMgmtData(userID) {
  return dispatch => {
    dispatch(onAdsMgmtFieldChange('refreshing', true));

    userApi.getAdsLikes(userID)
      .then(res => {
        if (res.status == 0) {
          dispatch(onAdsMgmtFieldChange('likedList', res.data));
          let sellList = Object.assign({}, res.data);
          let rentList = Object.assign({}, res.data);

          dispatch(onAdsMgmtFieldChange('sellList', sellList));
          dispatch(onAdsMgmtFieldChange('rentList', rentList));
        } else {
          log.error("loadAdsMgmtData error", res);
        }
        dispatch(onAdsMgmtFieldChange('refreshing', false));
      })
  }
}
export function refreshLikedTab(userID) {
  return dispatch => {
    dispatch(onAdsMgmtFieldChange('refreshing', true));

    userApi.getAdsLikes(userID)
      .then(res => {
        if (res.status == 0) {
          dispatch(onAdsMgmtFieldChange('likedList', res.data));
        } else {
          log.error("refreshLikedTab error", res);
        }
        dispatch(onAdsMgmtFieldChange('refreshing', false));
      })
  }
}

