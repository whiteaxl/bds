'use strict';

const {
  ON_ADSMGMT_FIELD_CHANGE,
  ON_SELECTED_PACKAGE_FIELD_CHANGE,
  CHANGE_SELECTED_PACKAGE,
  CHANGE_PACKAGE_FIELD
} = require('../../lib/constants').default;

import log from "../../lib/logUtil";

import userApi from '../../lib/userApi';

import localDB from '../../lib/localDB';

import util from '../../lib/utils';

import danhMuc from '../../assets/DanhMuc';



export function onAdsMgmtFieldChange(field, value) {
  return {
    type: ON_ADSMGMT_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function onSelectedPackageFieldChange(field, value) {
  return {
    type: ON_SELECTED_PACKAGE_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function changeSelectedPackage(value) {
  return {
    type: CHANGE_SELECTED_PACKAGE,
    payload: value
  };
}

export function changePackageField(field, value) {
  return {
    type: CHANGE_PACKAGE_FIELD,
    payload: {field, value}
  };
}



function convertAds(e) {
  var diaChiFullName = e.place.diaChiFullName;
  e.diaChi = diaChiFullName;
  e.dienTichFmt = util.getDienTichDisplay(e.dienTich);
  e.soPhongNguFmt = e.soPhongNgu ? e.soPhongNgu + "p.ngủ" : null;
  e.soTangFmt = e.soTang ? e.soTang + "tầng" : null;
  e.giaFmt = util.getPriceDisplay(e.gia, e.loaiTin);
  return e;
}

export function loadMySellRentList(userID) {
  return dispatch => {
    userApi.getMyAds(userID).then((res) => {
      if (res.status == 0) {
        var adsList = res.data;
        var sellList = adsList.filter((e) => e.loaiTin == 0);
        //sellList = sellList.map(e => convertAds(e));

        var rentList = adsList.filter((e) => e.loaiTin == 1);
        //rentList = rentList.map(e => convertAds(e));

        dispatch(onAdsMgmtFieldChange('sellList', sellList));
        dispatch(onAdsMgmtFieldChange('rentList', rentList));
      }
    });
  };
}

// likedList get from Server
export function loadLikedList(userID) {
  return dispatch => {
    dispatch(onAdsMgmtFieldChange('refreshing', true));

    userApi.getAdsLikes(userID)
      .then(res => {
        if (res.status == 0) {
          dispatch(onAdsMgmtFieldChange('likedList', res.data));

        } else {
          log.error("loadAdsMgmtData error", res);
        }
        dispatch(onAdsMgmtFieldChange('refreshing', false));
      })
  }
}

export function buyCurrentPackage(pack, userID) {
  return dispatch => {
    let p = pack.packageSelected;
    log.info("buyCurrentPackage, adsID", pack);
    let newPack = {
      level : danhMuc.package.getLevel(pack[p].levelName),
      length : danhMuc.package.getLength(pack[p].lengthName),
      startDateTime : new Date().getTime()
    };


    return localDB.updateAdsPack(pack.adsID, p, newPack).then((res) => {
      dispatch(changePackageField('current_'+ p, pack[p].levelName));

      dispatch(loadMySellRentList(userID));

      return {
        status: 0
      }
    });

    //update Ads
    //update UI

  }
}


