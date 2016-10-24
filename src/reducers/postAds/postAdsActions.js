'use strict';

import uploadApi from '../../lib/UploadApi';
import findApi from '../../lib/FindApi';
import log from "../../lib/logUtil";

const {
    ON_POST_ADS_FIELD_CHANGE,
    ON_UPLOAD_IMAGE,
    POST_ADS_REQUEST,
    POST_ADS_SUCCESS,
    POST_ADS_FAILURE,
    POST_ADS_GET_DIACHINH_REQUEST,
    POST_ADS_GET_DIACHINH_SUCCESS,
    POST_ADS_GET_DIACHINH_FAILURE
    
} = require('../../lib/constants').default;

export function onPostAdsFieldChange(field, value) {
    return {
        type: ON_POST_ADS_FIELD_CHANGE,
        payload: {field: field, value: value}
    };
}

export function setUploadingImage() {
    return {
        type: ON_UPLOAD_IMAGE,
        payload: null
    };
}

export function postAdsRequest() {
    return {
        type: POST_ADS_REQUEST
    };
}
export function postAdsSuccess(json) {
    return {
        type: POST_ADS_SUCCESS,
        payload: json
    };
}
export function postAdsFailure(error) {
    return {
        type: POST_ADS_FAILURE,
        payload: error
    };
}

export function postAdsGetDiaChinhRequest() {
    return {
        type: POST_ADS_GET_DIACHINH_REQUEST
    };
}
export function postAdsGetDiaChinhSuccess(json) {
    return {
        type: POST_ADS_GET_DIACHINH_SUCCESS,
        payload: json
    };
}
export function postAdsGetDiaChinhFailure() {
    return {
        type: POST_ADS_GET_DIACHINH_FAILURE,
        payload: null
    };
}

export function onUploadImage(filename, filepath, uploadCallBack) {
    return dispatch => {
        dispatch(setUploadingImage());
        return uploadApi.onUpload(filename, filepath, uploadCallBack);
    };
}

export function postAds(adsDto, token) {
    return dispatch => {
        dispatch(postAdsRequest());

        return uploadApi.postAds(adsDto, token)
            .then(function (json) {
                log.info("postAdsActions.postAds", json);
                if (json.status === 0) {
                    dispatch(postAdsSuccess(json));
                } else {
                    dispatch(postAdsFailure(json.error));
                }
                return json;
            });
    };
}

export function getDiaChinhFromGoogleData(dto) {
    return dispatch => {
        return findApi.getDiaChinhFromGoogleData(dto)
            .then(function (json) {
                log.info("postAdsActions.getDiaChinhFromGoogleData", json);
                if (json.status === 'OK') {
                    dispatch(postAdsGetDiaChinhSuccess(json));
                }
                return json;
            });
    };
}
