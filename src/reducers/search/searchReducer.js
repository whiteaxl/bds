'use strict';

import RangeUtils from "../../lib/RangeUtils";
import ApiUtils from "../../lib/ApiUtils";
import findApi from "../../lib/FindApi";

import log from "../../lib/logUtil";
import danhMuc from '../../assets/DanhMuc';
import moment from 'moment';

import gui from '../../lib/gui';

const InitialState = require('./searchInitialState').default;

const {
  ON_SEARCH_FIELD_CHANGE,
  SET_SEARCH_LOAI_TIN,
  SEARCH_STATE_LOADING,
  SEARCH_STATE_SUCCESS,
  SEARCH_STATE_FAILURE,
  FETCH_SEARCH_RESULT_FAIL,
  FETCH_SEARCH_RESULT_SUCCESS,
  CHANGE_LOADING_SEARCH_RESULT,
  ON_MAP_CHANGE,
  SEARCH_LIST_LIKE_SUCCESS,
  ON_DB_CHANGE,
  SEARCH_LOAD_SAVED_SEARCH

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

    case FETCH_SEARCH_RESULT_SUCCESS :
      let {data, query} = action.payload;

      let recentSearchList = state.recentSearchList;
      recentSearchList.push({
        name : 'Search at ' + moment().format("DD-MM-YYYY HH:mm:ss"),
        timeModified : new Date().getTime(),
        query : query,
        isRecent : true,
        desc: findApi.convertQuery2String(query),
      });
      recentSearchList.sort((a,b) => b.timeModified - a.timeModified);
      let LIMIT = gui.LIMIT_RECENT_SEARCH;
      recentSearchList = recentSearchList.slice(0, LIMIT);


      return state.setIn(['result', "listAds"], data.list)
        .setIn(['result', "viewport"], data.viewport)
        .set("state", SEARCH_STATE_SUCCESS)
        .setIn(['result', "errorMsg"], null)
        .set("loadingFromServer", false)
        .setIn(["map", "region"], ApiUtils.getRegionByViewport(data.viewport))
        .set("recentSearchList", recentSearchList)
        ;

    case CHANGE_LOADING_SEARCH_RESULT :
    {
      return state.set("loadingFromServer", action.payload)
    }

    case ON_MAP_CHANGE :
    {
      const {field, value} = action.payload;
      let nextState = state.setIn(['map', field], value);
      return nextState;
    }
    /*
     case SEARCH_LIST_LIKE_SUCCESS : {
     console.log("SEARCH_LIST_LIKE_SUCCESS reducer ", action.payload);
     let {rowData, rowID} = action.payload;
     let idx = Number(rowID);
     let listAds = state.result.listAds;

     rowData.isLiked = 1;

     let newListAds = [
     ...listAds.slice(0, idx),
     rowData,
     ...listAds.slice(idx+1)
     ];

     return state.setIn(['result',"listAds"], newListAds);
     }
     */

    case ON_DB_CHANGE:
    {
      var {e} = action.payload;
      var next = state;
      let user = e.results.find(one => one.doc.type == 'User');
      if (user) {
        const e = user.doc;
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
        .setIn(['form', 'fields', "soTangSelectedIdx"], cred.soTangSelectedIdx)
        .setIn(['form', 'fields', "soNhaTamSelectedIdx"], cred.soNhaTamSelectedIdx)
        .setIn(['form', 'fields', "dienTich"], cred.dienTich)
        .setIn(['form', 'fields', "gia"], cred.gia)
        .setIn(['form', 'fields', "orderBy"], cred.orderBy)
        .setIn(['form', 'fields', "geoBox"], cred.geoBox)
        .setIn(['form', 'fields', "place"], cred.place)
        .setIn(['form', 'fields', "radiusInKmSelectedIdx"], cred.radiusInKmSelectedIdx)
        .setIn(['form', 'fields', "huongNha"], cred.huongNha)
        .setIn(['form', 'fields', "ngayDaDang"], cred.ngayDaDang)
        .setIn(['form', 'fields', "polygon"], cred.polygon)
        ;
      return next;
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
  let {place, loaiTin, loaiNhaDat, soPhongNguGREATER, soTangGREATER, soPhongTamGREATER
    , dienTichBETWEEN, giaBETWEEN, orderBy, geoBox, huongNha, ngayDaDang, polygon} = query;

  let ret = {
    loaiTin: loaiTin == 0 ? 'ban' : 'thue',
    loaiNhaDat: loaiNhaDat || '',
    soPhongNguSelectedIdx: danhMuc.getIdx(danhMuc.SoPhongNgu, soPhongNguGREATER),
    soTangSelectedIdx: danhMuc.getIdx(danhMuc.SoTang, query.soTangGREATER),
    soNhaTamSelectedIdx : danhMuc.getIdx(danhMuc.SoPhongTam, soPhongTamGREATER),
    dienTich: RangeUtils.dienTichRange.rangeVal2Display(dienTichBETWEEN),
    gia: RangeUtils.sellPriceRange.rangeVal2Display(giaBETWEEN),
    orderBy: orderBy || '',
    geoBox: geoBox || [],
    place: place,
    radiusInKmSelectedIdx: danhMuc.getIdx(danhMuc.RadiusInKm, place.radiusInKm),
    huongNha: huongNha,
    ngayDaDang: ngayDaDang, //batky
    polygon: polygon,
    region : {}
  };

  return ret;
}

