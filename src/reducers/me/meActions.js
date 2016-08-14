'use strict';

const {
  ON_ME_FIELD_CHANGE,
  ON_TOPUP_SCRATCH_FIELD_CHANGE
} = require('../../lib/constants').default;

import log from "../../lib/logUtil";

import userApi from '../../lib/userApi';
import topupApi from '../../lib/topupApi';


export function onMeFieldChange(field, value) {
  return {
    type: ON_ME_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function onTopupScratchFieldChange(field, value) {
  return {
    type: ON_TOPUP_SCRATCH_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}


export function updateMyInfo(userDto) {
  log.info("meAction, updateMyInfo");

  return dispatch => {
    dispatch(onMeFieldChange('reloading', true));

    userApi.getAdsLikes(userID)
      .then(res => {
        if (res.status == 0) {
          dispatch(onMeFieldChange('likedList', res.data));
        } else {
          log.error("updateMyInfo error", res);
        }
        dispatch(onMeFieldChange('refreshing', false));
      })
  }
}


export function topupScratch(dto) {
  log.info("meAction, topupScratch");

  return dispatch => {
    dispatch(onTopupScratchFieldChange('submitting', true));

    return topupApi.topupScratch(dto)
      .then(res => {
        onTopupScratchFieldChange('submitting', false);

        return res;
      })
  }

}


