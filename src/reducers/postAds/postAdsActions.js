'use strict';

import uploadApi from '../../lib/UploadApi';

const {
    ON_POST_ADS_FIELD_CHANGE,
    ON_UPLOAD_IMAGE

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

export function onUploadImage(filename, filepath, uploadCallBack) {
    return dispatch => {
        dispatch(setUploadingImage());
        return uploadApi.onUpload(filename, filepath, uploadCallBack);
    };
}
