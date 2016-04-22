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
    SEARCH_STATE_INPUT

} = require('../../lib/constants').default;


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
                } else {
                    dispatch(fetchSearchResultFail(gui.ERR_LoiKetNoiMayChu));
                    //Alert.alert(gui.ERR_LoiKetNoiMayChu);
                    Alert.alert(gui.ERR_LoiKetNoiMayChu)
                }
            });
    }
}

