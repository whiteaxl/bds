// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"

//var rootUrl = 'http://203.162.13.101:5000/api';
var rootUrl = 'http://localhost:5000/api';
var findUrl = rootUrl + "/find";
var placeUrl = rootUrl + "/findPlace";

var maxRows = 200;

var Api = {
  arrayToString: function(arr) {
    var val = "";
    arr.map(function(one) {
      if ("" === val) {
        val = one;
      } else {
        val = val + ',' + one;
      }
    });
    return val;
  },
  createFullParams: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy, placeName, bbox) {
      var params = [];
      var loaiTinVal = null;
      if ('ban' === loaiTin) {
        loaiTinVal = 0;
      }
      if ('thue' === loaiTin) {
        loaiTinVal = 1;
      }
      if (null !== loaiTinVal) {
        params.push({key: 'loaiTin', value: loaiTinVal});
      }
      if (loaiNhaDat) {
        params.push({key: 'loaiNhaDat', value: loaiNhaDat});
      }
      if (gia) {
        let giaVal = RangeUtils.sellPriceRange.toValRange(gia);

        params.push({key: 'giaBETWEEN', value: this.arrayToString(giaVal)});
      }
      if (soPhongNgu) {
        params.push({key: 'soPhongNguGREATER', value: soPhongNgu});
      }
      if (soTang) {
        params.push({key: 'soTangGREATER', value: soTang});
      }
      if (dienTich) {
        let dienTichVal = RangeUtils.dienTichRange.toValRange(dienTich);

        params.push({key: 'dienTichBETWEEN', value: this.arrayToString(dienTichVal)});
      }
      if (orderBy) {
        params.push({key: 'orderBy', value: orderBy});
      }

      if (placeName) {
          params.push({key: 'placeName', value: placeName});
      }

      if (bbox && bbox.length==4){
          params.push({key:'geoBox', value: bbox});
      }
      
      return params;
  },

  getItems: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy, placeName, bbox) {
    var fullParams = this.createFullParams(loaiTin, loaiNhaDat, gia, soPhongNgu,
                                            soTang, dienTich, orderBy, placeName, bbox);

    var params = {};
    fullParams.map(function(oneParam) {
      params[oneParam.key] = oneParam.value;
    })
    params['limit'] = maxRows;
    console.log(rootUrl + "?" + JSON.stringify(params));
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
    .catch(e => e);
  },
  arrayToString: function(arr) {
    var val = "";
    arr.map(function(one) {
      if ("" === val) {
        val = one;
      } else {
        val = val + ',' + one;
      }
    });
    return val;
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
    }

};

export { Api as default };
