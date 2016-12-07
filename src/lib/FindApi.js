// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"

import DanhMuc from "../assets/DanhMuc"
import cfg from "../cfg";
import cancelablFetch from 'react-native-cancelable-fetch'

import moment from 'moment';

var rootUrl = `${cfg.rootUrl}`;
var findUrl = rootUrl + "/v2/find";
var placeUrl = rootUrl + "/findPlace";
var mplaceUrl = rootUrl + "/place";
var detailUrl = rootUrl + "/detail";
var homeData4AppUrl = rootUrl + "/v2/homeData4App";



var maxRows = 25;

var Api = {
  _requests : [],
  _requestCnt : 0,

  convertFieldsToQueryParams : function(fields){
    console.log("============== print search fields");
    console.log(fields);
    console.log("============== print search fields end");

    var {loaiTin, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
        radiusInKmSelectedIdx, dienTich, orderBy, diaChinh, center, viewport, 
        huongNha, ngayDaDang, polygon, pageNo, limit, isIncludeCountInResponse,
        userID, updateLastSearch, circle
    } = fields;

    let loaiNhaDat = fields[loaiTin].loaiNhaDat;
    let gia = fields[loaiTin].gia;

    let mcircle = {};
    if (center && center.length > 0) {
        mcircle.radius = DanhMuc.getRadiusInKmByIndex(radiusInKmSelectedIdx) || undefined;
        mcircle.center = center;
    }

    if (circle)
        mcircle = circle;
    console.log("======================= print 1111111111111");
    console.log(mcircle);
    console.log("======================= print 1111111111111");
    if (!mcircle.radius || !mcircle.center) {
        mcircle = undefined;
    }

      console.log("======================= print 22222222222222");
      console.log(mcircle);
      console.log("======================= print 22222222222222");

    if (viewport && viewport.length == 0 ) {
      viewport = undefined;
    }
    if (polygon && polygon.length == 0 ) {
      polygon = undefined;
    }

    let giaRange = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange ;

    let giaLabel = 'giaBETWEEN';
    let giaVal = undefined;
    if (gia) {
        if (gia[0] === DanhMuc.THOA_THUAN && gia[1] === DanhMuc.THOA_THUAN) {
            giaLabel = 'gia';
            giaVal = -1;
        } else {
            giaVal = giaRange.toValRange(gia);
        }
    }

    let dienTichLabel = 'dienTichBETWEEN';
    let dienTichVal = undefined;
    if (dienTich) {
        if (dienTich[0] === DanhMuc.CHUA_XAC_DINH && dienTich[1] === DanhMuc.CHUA_XAC_DINH) {
            dienTichLabel = 'dienTich';
            dienTichVal = -1;
        } else {
            dienTichVal = RangeUtils.dienTichRange.toValRange(dienTich);
        }
    }

    var params = {
      'loaiTin' : 'ban' === loaiTin ? 0 : 1,
      'loaiNhaDat' : loaiNhaDat ? [loaiNhaDat] : undefined,
      'soPhongNguGREATER' : Number(DanhMuc.getSoPhongByIndex(soPhongNguSelectedIdx)) || undefined,
      'soPhongTamGREATER' : Number(DanhMuc.getSoPhongTamByIndex(soNhaTamSelectedIdx)) || undefined,
      'orderBy' : orderBy ? {name: DanhMuc.getOrderKey(orderBy), type: DanhMuc.getOrderType(orderBy)} : undefined,
      'diaChinh': diaChinh && Object.keys(diaChinh).length > 0 ? diaChinh : undefined,
      'circle' : mcircle,
      'viewport' : viewport ,
      'limit' : limit || maxRows, //default is 250 limit
      'huongNha' : [huongNha] || undefined,
      'ngayDangTinGREATER' : DanhMuc.getDateFromNow(ngayDaDang) || undefined,
      'polygon' : polygon ? polygon : undefined,
      'pageNo' : pageNo || 1, //default is page 1
      'isIncludeCountInResponse' : isIncludeCountInResponse || false, //default is false
      'userID' : userID || undefined,
      'updateLastSearch' : updateLastSearch || undefined
    };

    params[giaLabel] = giaVal;
    params[dienTichLabel] = dienTichVal;

    return params
  },

  //query json that sent to server
  convertQuery2String(query) {
    let toStrRange = (range) => {
      if (range && range[0] == 0 && range[1] == DanhMuc.BIG) {
        return undefined;
      }
      return range;
    };

    let {loaiTin, loaiNhaDat, giaBETWEEN, soPhongNguGREATER, dienTichBETWEEN,
      orderBy, limit, huongNha, ngayDangTinGREATER, polygon, pageNo, soPhongTamGREATER,
      diaChinh, circle, viewport, isIncludeCountInResponse
    } = query;

    let loaiNhaDatVal = DanhMuc.loaiTin[loaiTin];
    if (loaiNhaDat) {
        loaiNhaDatVal = loaiTin == 0 ? DanhMuc.LoaiNhaDatBan[loaiNhaDat] : DanhMuc.LoaiNhaDatThue[loaiNhaDat];
    }

    // let tmp = {
    //     'tin' : loaiNhaDatVal,
    //     'giá' : toStrRange(giaBETWEEN),
    //     'p.ngủ' : soPhongNguGREATER == 0 ? undefined : soPhongNguGREATER,
    //     'p.tắm' : soPhongTamGREATER == 0 ? undefined : soPhongTamGREATER,
    //     'diện tích' : toStrRange(dienTichBETWEEN),
    //     'orderBy' : orderBy || undefined,
    //     'diaChinh': diaChinh || undefined,
    //     'viewport' : viewport || undefined,
    //     'circle' : circle || undefined,
    //     'limit' : limit || maxRows || undefined,
    //     'hướng' : huongNha || undefined,
    //     'ngày đăng' : ngayDangTinGREATER || undefined,
    //     'polygon' : polygon || undefined,
    //     'pageNo' : pageNo || undefined,
    //     'isIncludeCountInResponse' : isIncludeCountInResponse || undefined
    // };
    //
    // return JSON.stringify(tmp);

    let strQuery = '';
    strQuery = strQuery + loaiNhaDatVal;
    if (giaBETWEEN && (giaBETWEEN[0] != -1 || giaBETWEEN[1] != DanhMuc.BIG)) {
        let giaStepValues = loaiTin == 0 ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
        let newGia = giaStepValues.rangeVal2Display(giaBETWEEN);
        strQuery = strQuery + ', ' + RangeUtils.getFromToDisplay(newGia, giaStepValues.getUnitText());
    }
    if (dienTichBETWEEN && (dienTichBETWEEN[0] != -1 || dienTichBETWEEN[1] != DanhMuc.BIG)) {
        let dienTichStepValues = RangeUtils.dienTichRange;
        let newDienTich = dienTichStepValues.rangeVal2Display(dienTichBETWEEN);
        strQuery = strQuery + ', ' + RangeUtils.getFromToDisplay(newDienTich, dienTichStepValues.getUnitText());
    }
    if (soPhongNguGREATER) {
        strQuery = strQuery + ', ' + soPhongNguGREATER + ' p.ngủ';
    }
    if (soPhongTamGREATER) {
        strQuery = strQuery + ', ' + soPhongTamGREATER + ' p.tắm';
    }
    if (huongNha && huongNha.length > 0 && huongNha[0]) {
        strQuery = strQuery + ', ' + DanhMuc.HuongNha[huongNha[0]];
    }
    if (ngayDangTinGREATER) {
        let now = moment();
        let ngayDangTin = moment(ngayDangTinGREATER, 'YYYYMMDD');
        let ngayDaDang = now.diff(ngayDangTin, 'days');
        strQuery = strQuery + ', ' + ngayDaDang + ' ngày';
    }
    // if (orderBy) {
    //     strQuery = strQuery + ', ' + orderBy.name + ' ' + orderBy.type;
    // }
    // if (diaChinh && diaChinh.fullName) {
    //     strQuery = strQuery + ', ' + diaChinh.fullName;
    // }
    // if (viewport && Object.keys(viewport).length > 0) {
    //     strQuery = strQuery + ', {ĐôngBắc:' + this._replaceAll(JSON.stringify(viewport.northeast), "\"", "");
    //     strQuery = strQuery + ',TâyNam:' + this._replaceAll(JSON.stringify(viewport.southwest), "\"", "") + "}";
    // }
    // if (circle && Object.keys(circle).length > 0) {
    //     strQuery = strQuery + ', ' + this._replaceAll(JSON.stringify(circle), "\"", "");
    // }
    // if (limit) {
    //     strQuery = strQuery + ', giới hạn ' + limit;
    // }
    // if (polygon) {
    //     strQuery = strQuery + ', ' + this._replaceAll(JSON.stringify(polygon), "\"", "");
    // }
    // if (pageNo) {
    //     strQuery = strQuery + ', trang ' + pageNo;
    // }
    // if (isIncludeCountInResponse) {
    //     strQuery = strQuery + ', includeCountInResponse';
    // }

    return strQuery;
  },
    _replaceAll(str, searchStr, replaceStr) {
      let newStr = str;
      while (newStr.indexOf(searchStr) != -1) {
          newStr = newStr.replace(searchStr, replaceStr);
      }
      return newStr;
    },

    _abortRequest: function() {
        for (let i = 0; i < this._requests.length; i++) {
            cancelablFetch.abort(this._requests[i]);
        }
        this._requests = [];
    },

  getItems: function(params) {
    console.log(findUrl + "?" + JSON.stringify(params));

    this._abortRequest();
    this._requests.push(++this._requestCnt);

    return cancelablFetch(findUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 0,
      body: JSON.stringify(params)
    }, this._requestCnt)
    .then(ApiUtils.checkStatus)
    .then(response => response.json())
    .catch(e => {
      console.log("Error when find: " + findUrl,e);
      return e;
    });
  },

//return result = {length:1, list=[{name:'', geo:{lon, lat}]}
    getPlaces(queryText) {
        return fetch(`${placeUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 0,
            body: JSON.stringify(
                {
                    text: queryText
                }
            )
        })
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .catch(e => e);
    },

    getDetail(fields) {
        var {adsID} = fields;
        var params = {
            'adsID' : adsID
        };

        this._abortRequest();
        this._requests.push(++this._requestCnt);

        return cancelablFetch(detailUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 0,
            body: JSON.stringify(params)
        }, this._requestCnt)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .catch(e => {
                console.log("Error when getDetail: " + findUrl, e);
                return e;
            });
    },

    getGeocoding(lat, lon, callback) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
            //"key=AIzaSyDhk9mOXjM79P7ceOceYSCxQO-o9YXCR3A" +
            "&latlng=" + lat + ',' + lon;

        return fetch(url)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(function (data) {
                callback(data);
            })
            .catch(e => {
                console.log("Error: getGeocoding");
                console.log(e)
            });
    },

  getDiaChinhFromGoogleData(dto) {
      console.log('fetch' + `${mplaceUrl}/getPlaceByDiaChinhKhongDau` + JSON.stringify(dto));
      
      return fetch(`${mplaceUrl}/getPlaceByDiaChinhKhongDau`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          timeout: 0,
          body: JSON.stringify(dto)
      })
          .then(ApiUtils.checkStatus)
          .then(response => response.json())
          .catch(e => {
              return {
                  status: 99,
                  msg: e.toString()
              }
          });
  },

  getAppHomeData(lastSearchObj) {
    console.log('fetch' + `${homeData4AppUrl}` + JSON.stringify(lastSearchObj));

    return fetch(`${homeData4AppUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 0,
      body: JSON.stringify(lastSearchObj)
    })
      .then(ApiUtils.checkStatus)
      .then(response => response.json())
      .catch(e => {
        return {
          status: 99,
          msg: e.toString()
        }
      });
  },
};

export { Api as default };
