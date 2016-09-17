'use strict';

import RangeUtils from "../../lib/RangeUtils";
import ApiUtils from "../../lib/ApiUtils";
import findApi from "../../lib/FindApi";

import log from "../../lib/logUtil";
import danhMuc from '../../assets/DanhMuc';
import moment from 'moment';

import gui from '../../lib/gui';
import localStorage from '../../lib/localStorage';

const InitialState = require('./searchInitialState').default;

const {
  ON_ALERT_US_CHANGE,
  ON_POLYGONS_CHANGE,
  ON_DRAW_MODE_CHANGE,
  ON_SEARCH_FIELD_CHANGE,
  SET_SEARCH_LOAI_TIN,
  SEARCH_STATE_LOADING,
  SEARCH_STATE_SUCCESS,
  SEARCH_STATE_FAILURE,
  FETCH_SEARCH_RESULT_FAIL,
  FETCH_SEARCH_RESULT_SUCCESS,
  CHANGE_LOADING_SEARCH_RESULT,
  SEARCH_LIST_LIKE_SUCCESS,
  SEARCH_LIST_UNLIKE_SUCCESS,
  ON_DB_CHANGE,
  SEARCH_LOAD_SAVED_SEARCH,
  CHANGE_LOADING_HOME_DATA,
  LOAD_HOME_DATA_DONE,
  CHANGE_SEARCH_CALLED_FROM
} = require('../../lib/constants').default;

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function searchReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_SEARCH_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.setIn(['form', 'fields', field], value);

      return nextState;
    }
    case SET_SEARCH_LOAI_TIN :
    {
      let value = action.payload;

      let pickerData = null;

      if (value === 'ban') {
        pickerData = RangeUtils.sellPriceRange.getPickerData();
      } else {
        pickerData = RangeUtils.rentPriceRange.getPickerData();
      }

      let nextState = state
        .setIn(['form', 'fields', "gia"], RangeUtils.BAT_KY_RANGE)
        .setIn(['form', 'fields', "giaPicker"], pickerData)
        .setIn(['form', 'fields', "loaiTin"], value);
      return nextState;
    }

    case FETCH_SEARCH_RESULT_FAIL:
      return state.setIn(['result', 'errorMsg'], action.payload)
        .set("loadingFromServer", false);

    case ON_DRAW_MODE_CHANGE:
      return state.set("drawMode", action.payload);

    case ON_POLYGONS_CHANGE:
      return state.setIn(['map', 'polygons'], action.payload);

    case ON_ALERT_US_CHANGE:
      return state.set("alertUs", action.payload);

    case FETCH_SEARCH_RESULT_SUCCESS :
    {
      let {data, query} = action.payload;

      let recentSearchList = state.recentSearchList;
      query.polygon = undefined;
      let searchObj = {
        name: 'Search at ' + moment().format("DD-MM-YYYY HH:mm:ss"),
        timeModified: new Date().getTime(),
        query: query,
        isRecent: true,
        desc: findApi.convertQuery2String(query),
      };

      recentSearchList.push(searchObj);
      recentSearchList.sort((a, b) => b.timeModified - a.timeModified);
      let LIMIT = gui.LIMIT_RECENT_SEARCH;
      recentSearchList = recentSearchList.slice(0, LIMIT);

      //update lastSearch if called from search screen
      let hasDiaChinhChange = false;
      if (recentSearchList && recentSearchList.length > 0) {
        let oldQuery = recentSearchList[0];
        let oldDiaChinh = oldQuery.diaChinh;
        let diaChinh = query.diaChinh;
        hasDiaChinhChange = diaChinh && diaChinh.length > 0 && oldDiaChinh.fullName != diaChinh.fullName;
      }
      if (state.searchCalledFrom == 'Search' && hasDiaChinhChange) {
        localStorage.setLastSearch(JSON.stringify(searchObj));
      }

      return state.setIn(['result', "listAds"], data.list)
          .set("state", SEARCH_STATE_SUCCESS)
          .setIn(['result', "errorMsg"], null)
          .set("loadingFromServer", false)
          .set("recentSearchList", recentSearchList)
          .setIn(['result', "totalCount"], data.totalCount)
          ;
    }

    case CHANGE_LOADING_SEARCH_RESULT :
    {
      return state.set("loadingFromServer", action.payload)
    }

    case CHANGE_SEARCH_CALLED_FROM :
    {
      return state.set("searchCalledFrom", action.payload)
    }

    case ON_DB_CHANGE:
    {
      var {doc} = action.payload;
      var next = state;
      if (doc.type == 'User') {
        const e = doc;
        //log.info("globalreducer.ON_DB_CHANGE, user", e);
        log.info("searchReducer.ON_DB_CHANGE, update saveSearchList", e);

        if (e.saveSearch) {
          let list = e.saveSearch.filter(e => e);

          list.sort((a,b) => b.timeModified - a.timeModified);

          const LIMIT = gui.LIMIT_SAVE_SEARCH;
          list = list.slice(0, LIMIT);

          let saveSearchList = buildSaveSearch(list);
          next = state.set('saveSearchList', saveSearchList);
        }
      }

      return next;
    }

    case SEARCH_LOAD_SAVED_SEARCH:
    {
      var savedSearch = action.payload;
      log.enter("searchReducer.SEARCH_LOAD_SAVED_SEARCH, savedSearch", savedSearch);

      let cred = buildSearchCredentialFromSavedSearch(savedSearch.query);

      log.info("SEARCH_LOAD_SAVED_SEARCH, credential=", cred);

      let next = state
        .setIn(['form', 'fields', "loaiTin"], cred.loaiTin)
        .setIn(['form', 'fields', "loaiNhaDat"], cred.loaiNhaDat)
        .setIn(['form', 'fields', "soPhongNguSelectedIdx"], cred.soPhongNguSelectedIdx)
        .setIn(['form', 'fields', "soNhaTamSelectedIdx"], cred.soNhaTamSelectedIdx)
        .setIn(['form', 'fields', "dienTich"], cred.dienTich)
        .setIn(['form', 'fields', "gia"], cred.gia)
        .setIn(['form', 'fields', "orderBy"], cred.orderBy)
        .setIn(['form', 'fields', "viewport"], cred.viewport)
        .setIn(['form', 'fields', "diaChinh"], cred.diaChinh)
        .setIn(['form', 'fields', "radiusInKmSelectedIdx"], cred.radiusInKmSelectedIdx)
        .setIn(['form', 'fields', "center"], cred.center)
        .setIn(['form', 'fields', "huongNha"], cred.huongNha)
        .setIn(['form', 'fields', "ngayDaDang"], cred.ngayDaDang)
        .setIn(['form', 'fields', "polygon"], cred.polygon)
        .setIn(['form', 'fields', "isIncludeCountInResponse"], cred.isIncludeCountInResponse)
        ;
      return next;
    }

    case CHANGE_LOADING_HOME_DATA :
    {
      return state.set("loadingHomeData", action.payload)
    }

    case LOAD_HOME_DATA_DONE : {
      let res = action.payload;
      console.log("reducer LOAD_HOME_DATA_DONE", res);

      if (res.status == null ) {
        return state.set('loadingHomeData', false)
          .set('homeDataErrorMsg', gui.ERR_LoiKetNoiMayChu)
      } else if (res.status == 0) {
        let next = state.set('collections', res.data)
          .set('loadingHomeData', false)
          .set('homeDataErrorMsg', "");

        if (!res.data || res.data.length == 0) {
          return next.set('homeDataErrorMsg', gui.INF_KhongCoGoiYNao + ", dựa theo lần tìm kiếm cuối:\n\n"
            + JSON.stringify(res.lastQuery))
        }

        return next;

      } else {
        return state.set('loadingHomeData', false)
          .set('homeDataErrorMsg', gui.ERR_LoiKetNoiMayChu)
      }
    }
  }

  /**
   * ## Default
   */
  return state;
}

function buildSaveSearch(saveSearch) {
  if (!saveSearch) {
    return [];
  }

  let ret = saveSearch.filter(e => e).map(e => {
    return {
      name: e.name,
      desc: findApi.convertQuery2String(e.query),
      query: e.query,
      timeModified: e.timeModified,
      isSaveSearch: true
    }
  });

  return ret;
}


function buildSearchCredentialFromSavedSearch(query) {
  let {diaChinh, loaiTin, loaiNhaDat, soPhongNguGREATER, soPhongTamGREATER
    , dienTichBETWEEN, giaBETWEEN, orderBy, viewport, huongNha, ngayDangTinGREATER, polygon
      , circle, isIncludeCountInResponse} = query;

  let ngayDaDang = 0;
  if (ngayDangTinGREATER) {
    let now = moment();
    let ngayDangTin = moment(ngayDangTinGREATER, 'YYYYMMDD');
    ngayDaDang = now.diff(ngayDangTin, 'days');
  }
  let ret = {
    loaiTin: loaiTin == 0 ? 'ban' : 'thue',
    loaiNhaDat: loaiNhaDat || '',
    soPhongNguSelectedIdx: danhMuc.getIdx(danhMuc.SoPhongNgu, soPhongNguGREATER),
    soNhaTamSelectedIdx : danhMuc.getIdx(danhMuc.SoPhongTam, soPhongTamGREATER),
    dienTich: RangeUtils.dienTichRange.rangeVal2Display(dienTichBETWEEN),
    gia: RangeUtils.sellPriceRange.rangeVal2Display(giaBETWEEN),
    orderBy: orderBy && Object.keys(orderBy).length == 2 ? orderBy.name + orderBy.type : '',
    viewport: viewport,
    diaChinh : diaChinh,
    center: circle.center || {},
    radiusInKmSelectedIdx: danhMuc.getIdx(danhMuc.RadiusInKm, circle.radius),
    huongNha: huongNha && huongNha.length > 0 ? huongNha[0] : 0,
    ngayDaDang: ngayDaDang, //batky
    polygon: polygon,
    isIncludeCountInResponse: isIncludeCountInResponse
  };

  return ret;
}

