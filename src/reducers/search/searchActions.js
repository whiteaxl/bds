'use strict';

import Api from "../../lib/FindApi";
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";
import log from "../../lib/logUtil";
import {Alert} from "react-native";

import userApi from '../../lib/userApi';
import db from '../../lib/localDB';

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
  ON_MAP_CHANGE,
  SEARCH_LIST_LIKE_SUCCESS,
  SEARCH_LOAD_SAVED_SEARCH

} = require('../../lib/constants').default;

export function onMapChange(field, value) {
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

    let params = Api.convertFieldsToQueryParams(credential);

    return Api.getItems(params)
      .then((data) => {
        let dataBlob = [];
        if (data.list) {
          //let listAds = data.list;
          log.info("searchActions.search, Number of result: " + data.length);
          //log.info("searchActions.search", data);

          dispatch(fetchSearchResultSuccess({data, query:params}));

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
        log.info("getDetail", data);
        if (data.ads) {
          dispatch(fetchDetailSuccess(data));

          successCallback(data);
        } else if (data.error) {
          dispatch(fetchDetailFail(data.error));
        }

        else {
          dispatch(fetchDetailFail(gui.ERR_LoiKetNoiMayChu));
        }
      });
  }
}

export function likeSuccess(payload) {
  return {
    type: SEARCH_LIST_LIKE_SUCCESS,
    payload: payload
  }
}

export function likeAds(userID, rowData, sectionID, rowID) {
  return dispatch => {
    let dto = {
      userID: userID,
      adsID: rowData.adsID
    };

    db.likeAds(dto).then((res) => {
      if (res.status === 0) {
        dispatch(likeSuccess(res.adsLikes));
        Alert.alert("Thành công!");
      } else {
        Alert.alert("Không thành công!");
      }
    });

    /*
     userApi.likeAds(dto).then(res => {
     if (res.status === 0) {
     let payload = {rowData, sectionID, rowID};
     dispatch(likeSuccess(payload));
     Alert.alert("Thành công!");
     } else {
     Alert.alert(res.msg);
     }
     });
     */
  }
}

export function saveSearch(userID, searchObj) {
  return dispatch => {
    let dto = {
      userID: userID,
      searchObj: searchObj
    };

    db.saveSearch(dto).then((res) => {
      if (res.status === 0) {
        //dispatch(likeSuccess(res.adsLikes));
        Alert.alert("Thành công!");
      } else {
        Alert.alert(res.msg);
      }
    });
  }
}


//use for both Recent and SaveSearch
export function loadSavedSearch(savedSearch) {
  return {
    type: SEARCH_LOAD_SAVED_SEARCH,
    payload: savedSearch
  }
}

