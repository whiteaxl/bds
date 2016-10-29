'use strict';

const {
  ON_ME_FIELD_CHANGE,
  ON_TOPUP_SCRATCH_FIELD_CHANGE,
  ON_PROFILE_FIELD_CHANGE,
  ON_LOADING_PROFILE_REQUEST,
  ON_LOADING_PROFILE_SUCCESS,
  ON_LOADING_PROFILE_FAILURE,
  ON_UPDATING_PROFILE_REQUEST,
  ON_UPDATING_PROFILE_SUCCESS,
  ON_UPDATING_PROFILE_FAILURE
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

export function onProfileFieldChange(field, value) {
    return {
        type: ON_PROFILE_FIELD_CHANGE,
        payload: {field: field, value: value}
    };
}

export function onTopupScratchFieldChange(field, value) {
  return {
    type: ON_TOPUP_SCRATCH_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function onLoadingProfileRequest() {
    return {
        type: ON_LOADING_PROFILE_REQUEST,
        payload: null
    };
}

export function onLoadingProfileSuccess(userProfile) {
    return {
        type: ON_LOADING_PROFILE_SUCCESS,
        payload: userProfile
    };
}

export function onLoadingProfileFailure(err) {
    return {
        type: ON_LOADING_PROFILE_FAILURE,
        payload: err
    };
}

export function onUpdatingProfileRequest() {
    return {
        type: ON_UPDATING_PROFILE_REQUEST
    };
}

export function onUpdatingProfileSuccess() {
    return {
        type: ON_UPDATING_PROFILE_SUCCESS
    };
}

export function onUpdatingProfileFailure(err) {
    return {
        type: ON_UPDATING_PROFILE_FAILURE,
        payload: err
    };
}

export function profile(userID, token) {
    log.info("meAction, get Profile");

    return dispatch => {
        dispatch(onLoadingProfileRequest());

        return userApi.profile(userID, token)
            .then(res => {
                if (res.success) {
                    dispatch(onLoadingProfileSuccess(res.user));
                } else {
                    log.error("get Profile error", res);
                    dispatch(onLoadingProfileFailure(res.msg));
                }
                return res;
            })
    }
}

export function updateProfile(userDto, token) {
    log.info("meAction, update Profile");

    return dispatch => {
        dispatch(onUpdatingProfileRequest());

        return userApi.updateProfile(userDto, token)
            .then(function(res) {
                if (res.success) {
                    console.log("update profile successfully");
                    dispatch(onUpdatingProfileSuccess());
                } else {
                    log.error("update Profile error", res);
                    dispatch(onUpdatingProfileFailure(res.msg));
                }
                return res;
            });
    }
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


