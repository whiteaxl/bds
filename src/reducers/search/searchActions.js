'use strict';

import Api from "../../lib/FindApi";
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";
import {Alert} from "react-native";

const {
    ON_SEARCH_FIELD_CHANGE,
    SET_SEARCH_LOAI_TIN,
    FETCH_SEARCH_RESULT_FAIL,
    FETCH_SEARCH_RESULT_SUCCESS,
    CHANGE_LOADING_SEARCH_RESULT,
    FETCH_DETAIL_FAIL,
    FETCH_DETAIL_SUCCESS,
    SET_LOADING_DETAIL,
    SEARCH_STATE_INPUT,
    ON_MAP_CHANGE

} = require('../../lib/constants').default;

export function onMapChange(field, value){
    return {
        type: ON_MAP_CHANGE,
        payload: {field: field, value: value}
    };
}

export function onSearchFieldChange(field, value) {
    return {
        type: ON_SEARCH_FIELD_CHANGE,
        payload: {field: field, value: value}
    };
}


export function setSearchLoaiTin(value) {
    return {
        type: SET_SEARCH_LOAI_TIN,
        payload: value
    }
}

export function fetchSearchResultFail(error) {
    return {
        type: FETCH_SEARCH_RESULT_FAIL,
        payload: error
    };
}

export function fetchSearchResultSuccess(data) {
    return {
        type: FETCH_SEARCH_RESULT_SUCCESS,
        payload: data
    }
}

export function changeLoadingSearchResult(loading) {
    return {
        type: CHANGE_LOADING_SEARCH_RESULT,
        payload: loading
    }
}

export function fetchDetailFail(error) {
    return {
        type: FETCH_DETAIL_FAIL,
        payload: error
    };
}

export function fetchDetailSuccess(data) {
    return {
        type: FETCH_DETAIL_SUCCESS,
        payload: data
    }
}

export function setLoadingDetail() {
    return {
        type: SET_LOADING_DETAIL,
        payload: null
    }
}


export function search(credential, successCallback) {
    return dispatch => {

        dispatch(changeLoadingSearchResult(true));

        return Api.getItems(credential)
            .then((data) => {
                let dataBlob = [];
                if (data.list) {
                    //let listAds = data.list;

                    //console.log("Number of result: " + data.length);
                    console.log(data);

                    dispatch(fetchSearchResultSuccess(data));

                    successCallback();
                } else if (data.error) {
                    dispatch(fetchSearchResultFail(data.error));
                }

                else {
                    dispatch(fetchSearchResultFail(gui.ERR_LoiKetNoiMayChu));
                    //Alert.alert(gui.ERR_LoiKetNoiMayChu)
                }
            });
    }
}


export function getDetail(credential, successCallback) {
    return dispatch => {

        dispatch(setLoadingDetail());

        return Api.getDetail(credential)
            .then((data) => {
                console.log(data);
                if (data.ads) {
                    //let listAds = data.list;

                    //console.log("Number of result: " + data.length);
                    console.log(data);

                    dispatch(fetchDetailSuccess(data));

                    successCallback(data);
                } else if (data.error) {
                    dispatch(fetchDetailFail(data.error));
                }

                else {
                    dispatch(fetchDetailFail(gui.ERR_LoiKetNoiMayChu));
                    //Alert.alert(gui.ERR_LoiKetNoiMayChu)
                }
            });
    }
}
