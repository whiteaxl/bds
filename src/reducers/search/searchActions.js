'use strict';

import Api from "../../lib/FindApi";
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";
import log from "../../lib/logUtil";
import {Alert} from "react-native";

import userApi from '../../lib/userApi';
import ls from '../../lib/localStorage';
import localStorage  from '../../lib/localStorage';
import {NetInfo} from 'react-native';

const {
  ON_ALERT_US_CHANGE,
  ON_POLYGONS_CHANGE,
  ON_CIRCLE_CHANGE,
  ON_DRAW_MODE_CHANGE,
  ON_POSITION_SEARCH_MODE_CHANGE,
  ON_DRAW_SEARCH_MODE_CHANGE,
  ON_RESET_LIST_ADS,
  ON_CHANGE_MAP_PAGE_NO,
  ON_CHANGE_LIST_SCROLL_POS,
  ON_SEARCH_FIELD_CHANGE,
  SET_SEARCH_LOAI_TIN,
  FETCH_SEARCH_RESULT_FAIL,
  FETCH_SEARCH_RESULT_SUCCESS,
  CHANGE_LOADING_SEARCH_RESULT,
  FETCH_DETAIL_FAIL,
  FETCH_DETAIL_SUCCESS,
  SET_LOADING_DETAIL,
  SEARCH_STATE_INPUT,
  SEARCH_LIST_LIKE_SUCCESS,
  SEARCH_LIST_UNLIKE_SUCCESS,
  SEARCH_LOAD_SAVED_SEARCH,
  CHANGE_LOADING_HOME_DATA,
  LOAD_HOME_DATA_DONE,
  CHANGE_SEARCH_CALLED_FROM,
  CHANGE_HOME_REFRESHING,
  SAVED_SEARCH_SUCCESS,
  SAVED_SEARCH_FAIL,
  LOAD_LAST_SEARCH_SUCCESS,
  UPLOADING_LIKED_ADS,
  SEARCH_LIST_LIKE_FAILURE,
  SEARCH_LIST_UNLIKE_FAILURE
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

export function changeHomeRefreshing(refreshing) {
  return {
    type: CHANGE_HOME_REFRESHING,
    payload: refreshing
  }
}

export function onDrawModeChange(loading) {
  return {
    type: ON_DRAW_MODE_CHANGE,
    payload: loading
  }
}

export function onPositionSearchModeChange(loading) {
  return {
    type: ON_POSITION_SEARCH_MODE_CHANGE,
    payload: loading
  }
}

export function onDrawSearchModeChange(loading) {
  return {
    type: ON_DRAW_SEARCH_MODE_CHANGE,
    payload: loading
  }
}


export function onResetAdsList() {
  return {
    type: ON_RESET_LIST_ADS,
    payload: null
  }
}

export function onChangeMapPageNo(pageNo) {
  return {
    type: ON_CHANGE_MAP_PAGE_NO,
    payload: pageNo
  }
}

export function onChangeListScrollPos(pos) {
  return {
    type: ON_CHANGE_LIST_SCROLL_POS,
    payload: pos
  }
}

export function onPolygonsChange(loading) {
  return {
    type: ON_POLYGONS_CHANGE,
    payload: loading
  }
}

export function onCircleChange(loading) {
  return {
    type: ON_CIRCLE_CHANGE,
    payload: loading
  }
}

export function onAlertUsChange(loading) {
  return {
    type: ON_ALERT_US_CHANGE,
    payload: loading
  }
}

export function changeSearchCalledFrom(loading) {
  return {
    type: CHANGE_SEARCH_CALLED_FROM,
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

function callApiSearch(params, dispatch, successCallback, failCallback) {
  dispatch(changeLoadingSearchResult(true));
  NetInfo.fetch().then(isConnected => {
    if (isConnected == 'none') {
      dispatch(fetchSearchResultFail(gui.ERR_NoInternetConnection));
      //Alert.alert(gui.ERR_LoiKetNoiMayChu)
      failCallback && failCallback(gui.ERR_NoInternetConnection);
    } else {
      return Api.getItems(params)
          .then((data) => {
            if (data.errMsg) {
              dispatch(fetchSearchResultFail(data.errMsg));
              failCallback && failCallback(data.errMsg);
            }
            else if (data.list) {
              //let listAds = data.list;
              log.info("searchActions.search, Number of result: " + data.length);
              //log.info("searchActions.search", data);

              dispatch(fetchSearchResultSuccess({data, query:params}));

              successCallback();
            } else if (data.error) {
              dispatch(fetchSearchResultFail(data.error));
              failCallback && failCallback(data.error);
            }
          });
    }
  });
}

export function search(credential, successCallback, failCallback) {
  return dispatch => {
    let params = Api.convertFieldsToQueryParams(credential);
    dispatch(changeSearchCalledFrom("Search"));

    return callApiSearch(params, dispatch, successCallback, failCallback)
  }
}

export function abortSearch() {
  return dispatch => {
    return Api._abortRequest();
  }
}

export function searchFromHome(query, successCallback, failCallback) {
  return dispatch => {
    dispatch(changeSearchCalledFrom("Home"));

    return callApiSearch(query, dispatch, successCallback, failCallback)
  }
}


export function getDetail(credential, successCallback) {
  return dispatch => {

    dispatch(setLoadingDetail());

    NetInfo.fetch().then(isConnected => {
      if (isConnected == 'none') {
        dispatch(fetchDetailFail(gui.ERR_LoiKetNoiMayChu));
      } else {
        return Api.getDetail(credential)
            .then((data) => {
              log.info("getDetail", data);
              if (data.ads) {
                dispatch(fetchDetailSuccess(data));

                successCallback(data);
              } else if (data.error) {
                dispatch(fetchDetailFail(data.error));
              }

            });
      }
    });
  }
}

export function savedSearchSuccess(payload) {
  return {
    type: SAVED_SEARCH_SUCCESS,
    payload: payload
  }
}

export function loadLastSearchSuccess(payload) {
  return {
    type: LOAD_LAST_SEARCH_SUCCESS,
    payload: payload
  }
}

export function onUploadingLikedAds(adsID) {
  return {
    type: UPLOADING_LIKED_ADS,
    payload: adsID
  }
}

export function likeSuccess(payload) {
  return {
    type: SEARCH_LIST_LIKE_SUCCESS,
    payload: payload
  }
}

export function likeFailure() {
  return {
    type: SEARCH_LIST_LIKE_FAILURE
  }
}

export function unlikeSuccess(payload) {
  return {
    type: SEARCH_LIST_UNLIKE_SUCCESS,
    payload: payload
  }
}

export function unlikeFailure() {
  return {
    type: SEARCH_LIST_UNLIKE_FAILURE
  }
}

export function likeAds(userID, adsID) {
  return dispatch => {
    dispatch(onUploadingLikedAds(adsID));

    let dto = {
      userID: userID,
      adsID: adsID
    };
    
    userApi.likeAds(dto).then((res) => {
      if (res.success) {
        if (res.status ===0) {
          dispatch(likeSuccess(res.adsLikes));
        }
      } else {
        dispatch(likeFailure());
        Alert.alert("Không thành công!");
      }
      return res;
    });
  }
}

export function unlikeAds(userID, adsID) {
  return dispatch => {
    dispatch(onUploadingLikedAds(adsID));

    let dto = {
      userID: userID,
      adsID: adsID
    };

    userApi.unlikeAds(dto).then((res) => {
      if (res.success){
        if (res.status === 0) {
          dispatch(unlikeSuccess(res.adsLikes));
        }
      } else {
        dispatch(unlikeFailure());
        Alert.alert("Không thành công!");
      }
      return res;
    });
  }
}

export function saveSearch(userID, searchObj, token) {
  return dispatch => {
    let dto = {
      saveSearchName: searchObj.name,
      query: searchObj.query,
      timeModified: searchObj.timeModified
    };

    userApi.saveSearch(dto, token).then((res) => {
      if (res.status === 0) {
        //dispatch(likeSuccess(res.adsLikes));
        
        dispatch(savedSearchSuccess(res.savedSearch));
        Alert.alert("Lưu tìm kiếm thành công!");
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


// HOME screen
export function changeLoadingHomeData(loading) {
  return {
    type: CHANGE_LOADING_HOME_DATA,
    payload: loading
  }
}

export function loadHomeDataDone(res) {
  return {
    type: LOAD_HOME_DATA_DONE,
    payload: res
  }
}


export function loadHomeData(failCallback) {
  return dispatch => {
    dispatch(changeLoadingHomeData(true));
    dispatch(changeHomeRefreshing(true));

    return localStorage.getLastSearch().then((ret) => {
      log.info("loadHomeData.getLastSearch", ret);
      let lastSearchObj = ret && JSON.parse(ret);
      if (!lastSearchObj) {
        let today = new Date(); today.setHours(0,0,0);
        lastSearchObj = {
          timeModified : today.getTime(),
          query : {}
        }
      }else{
        if (lastSearchObj.query && lastSearchObj.query.loaiNhaDat && lastSearchObj.query.loaiNhaDat.length>0){
          lastSearchObj.query.loaiNhaDat = lastSearchObj.query.loaiNhaDat.filter((n) => n)
                                                                          .map((e) => {return Number(e)});
        }
      }

      var getHomeData = (currentLocation) => {
        NetInfo.fetch().then(isConnected => {
          if (isConnected == 'none') {
            failCallback && failCallback(gui.ERR_NoInternetConnection);
          } else {
            return Api.getAppHomeData({
              timeModified : lastSearchObj.timeModified,
              query : lastSearchObj.query,
              currentLocation: currentLocation
            }).then((res) => {
              log.info("getAppHomeData", res);
              dispatch(loadHomeDataDone(res));
              dispatch(changeHomeRefreshing(false));
              if (res.msg) {
              }
            });
          }
        });
      };

      return navigator.geolocation.getCurrentPosition(
        (position) => {
          return getHomeData({
            "lat": position.coords.latitude,
            "lon": position.coords.longitude
          });
        },
        (error) => {
          alert(error.message);

          return getHomeData(gui.defaultLocation);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    });
  }
}
