// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"

import DanhMuc from "../assets/DanhMuc"
import cfg from "../cfg";
import cancelablFetch from 'react-native-cancelable-fetch'

var rootUrl = `http://${cfg.server}:5000/api`;
var findUrl = rootUrl + "/v2/find";
var placeUrl = rootUrl + "/findPlace";
var detailUrl = rootUrl + "/detail";
var homeData4AppUrl = rootUrl + "/v2/homeData4App";



var maxRows = 250;

var Api = {
  _requests : [],
  _requestCnt : 0,

  convertFieldsToQueryParams : function(fields){
    var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
      radiusInKmSelectedIdx, dienTich, orderBy, diaChinh, center, viewport, huongNha, ngayDaDang, polygon, pageNo, limit, isIncludeCountInResponse} = fields;

    let circle = {};
    if (center) {
      circle.radius = DanhMuc.getRadiusInKmByIndex(radiusInKmSelectedIdx) || undefined;
      circle.center = center;
    }
    if (!circle.radius || !circle.center) {
      circle = undefined;
    }

    if (viewport && viewport.length == 0 ) {
      viewport = undefined;
    }
    if (polygon && polygon.length == 0 ) {
      polygon = undefined;
    }


    let giaRange = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange ;

    var params = {
      'loaiTin' : 'ban' === loaiTin ? 0 : 1,
      'loaiNhaDat' : loaiNhaDat ? [loaiNhaDat] : undefined,
      'giaBETWEEN' : gia ? giaRange.toValRange(gia) : gia,
      'soPhongNguGREATER' : Number(DanhMuc.getSoPhongByIndex(soPhongNguSelectedIdx)) || undefined,
      'soPhongTamGREATER' : Number(DanhMuc.getSoPhongTamByIndex(soNhaTamSelectedIdx)) || undefined,
      'dienTichBETWEEN' : dienTich ? RangeUtils.dienTichRange.toValRange(dienTich) : undefined,
      'orderBy' : orderBy ? {name: DanhMuc.getOrderKey(orderBy), type: DanhMuc.getOrderType(orderBy)} : undefined,
      'diaChinh': diaChinh,
      'circle' : circle,
      'viewport' : viewport ,
      'limit' : limit || maxRows, //default is 250 limit
      'huongNha' : [huongNha] || undefined,
      'ngayDangTinGREATER' : DanhMuc.getDateFromNow(ngayDaDang) || undefined,
      'polygon' : polygon ? polygon : undefined,
      'pageNo' : pageNo || 1, //default is page 1
      'isIncludeCountInResponse' : isIncludeCountInResponse || false //default is false
    };

    return params
  },

  //query json that sent to server
  convertQuery2String(query) {
    let toStrRange = (range) => {
      if (range[0] == 0 && range[1] == DanhMuc.BIG) {
        return undefined;
      }
      return range;
    };

    let {loaiTin, loaiNhaDat, giaBETWEEN, soPhongNguGREATER, dienTichBETWEEN,
      orderBy, limit, huongNha, ngayDangTinGREATER, polygon, pageNo, soPhongTamGREATER,
      diaChinh, circle, viewport, isIncludeCountInResponse
    } = query;

    let tmp = {
      'tin' : loaiTin,
      'nhà đất' : loaiNhaDat == 0 ? undefined : loaiNhaDat,
      'giá' : toStrRange(giaBETWEEN),
      'ngủ' : soPhongNguGREATER == 0 ? undefined : soPhongNguGREATER,
      'tắm' : soPhongTamGREATER == 0 ? undefined : soPhongTamGREATER,
      'dt' : toStrRange(dienTichBETWEEN),
      'orderBy' : orderBy ,
      'diaChinh': diaChinh ,
      'viewport' : viewport,
      'circle' : circle,
      'limit' : limit || maxRows || undefined,
      'hướng' : huongNha || undefined,
      'ngày' : ngayDangTinGREATER || undefined,
      'polygon' : polygon || undefined,
      'pageNo' : pageNo || undefined,
      'isIncludeCountInResponse' : isIncludeCountInResponse || undefined
    };

    return JSON.stringify(tmp);
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
        return fetch(`${detailUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        })
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .catch(e => e);
    },

    getGeocoding(lat, lon, callback) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
            "&latlng=" + lat + ',' + lon;

        return fetch(url)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(function (data) {
                callback(data);
            })
            .catch(e => e);
    },

  getAppHomeData(lastSearchObj) {
    return fetch(`${homeData4AppUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
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
