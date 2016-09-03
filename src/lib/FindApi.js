// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"

import DanhMuc from "../assets/DanhMuc"
import cfg from "../cfg";

var rootUrl = `http://${cfg.server}:5000/api`;
var findUrl = rootUrl + "/find";
var placeUrl = rootUrl + "/findPlace";
var detailUrl = rootUrl + "/detail";
var homeData4AppUrl = rootUrl + "/homeData4App";
var countUrl = rootUrl + "/count";


var maxRows = 200;

var Api = {

  convertFieldsToQueryParams : function(fields){
    var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soTangSelectedIdx, soNhaTamSelectedIdx,
      radiusInKmSelectedIdx, dienTich, orderBy, place, geoBox, huongNha, ngayDaDang, polygon, pageNo, limit} = fields;

    if (place) {
      place.radiusInKm = DanhMuc.getRadiusInKmByIndex(radiusInKmSelectedIdx) || undefined;
      if (place.currentLocation==="") {
        place.currentLocation = undefined;
      }
    }

    let giaRange = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange ;

    var params = {
      'loaiTin' : 'ban' === loaiTin ? 0 : 1,
      'loaiNhaDat' : loaiNhaDat || undefined,
      'giaBETWEEN' : gia ? giaRange.toValRange(gia) : gia,
      'soPhongNguGREATER' : DanhMuc.getSoPhongByIndex(soPhongNguSelectedIdx) || undefined,
      'soTangGREATER' : DanhMuc.getSoTangByIndex(soTangSelectedIdx) || undefined,
      'soPhongTamGREATER' : DanhMuc.getSoPhongTamByIndex(soNhaTamSelectedIdx) || undefined,
      'dienTichBETWEEN' : dienTich ? RangeUtils.dienTichRange.toValRange(dienTich) : undefined,
      'orderBy' : orderBy || undefined,
      'place':place || undefined,
      'geoBox' : geoBox.length===4 ? geoBox : undefined,
      'limit' : limit || maxRows || undefined,
      'huongNha' : huongNha || undefined,
      'ngayDaDang' : ngayDaDang || undefined,
      'polygon' : polygon || undefined,
      'pageNo' : pageNo || undefined
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

    let {loaiTin, loaiNhaDat, giaBETWEEN, soPhongNguGREATER, soTangGREATER, dienTichBETWEEN,
      orderBy, place, geoBox, limit, huongNha, ngayDaDang, polygon, pageNo, soPhongTamGREATER
    } = query;

    let tmp = {
      'tin' : loaiTin,
      'nhàDat' : loaiNhaDat == 0 ? undefined : loaiNhaDat,
      'giá' : toStrRange(giaBETWEEN),
      'ngủ' : soPhongNguGREATER == 0 ? undefined : soPhongNguGREATER,
      'tắm' : soPhongTamGREATER == 0 ? undefined : soPhongTamGREATER,
      'tầng' : soTangGREATER == 0 ? undefined : soTangGREATER,
      'dt' : toStrRange(dienTichBETWEEN),
      'orderBy' : orderBy ,
      'place':place ? place.fullName + "-" + place.radiusInKm : undefined ,
      'geoBox' : geoBox,
      'limit' : limit || maxRows || undefined,
      'hướng' : huongNha || undefined,
      'ngày' : ngayDaDang == 0 ? undefined : ngayDaDang,
      'polygon' : polygon || undefined,
      'pageNo' : pageNo || undefined
    };

    return JSON.stringify(tmp);
  },

  getItems: function(params) {
    console.log(findUrl + "?" + JSON.stringify(params));
    return fetch(`${findUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json())
    .catch(e => {
      console.log("Error when find: " + findUrl,e);
      return e;
    });
  },

    countItems: function(params) {
        console.log(countUrl + "?" + JSON.stringify(params));
        return fetch(`${countUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        })
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .catch(e => {
                console.log("Error when count: " + countUrl,e);
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
