// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"

import DanhMuc from "../assets/DanhMuc"

var rootUrl = 'http://203.162.13.101:5000/api';
//var rootUrl = 'http://localhost:5000/api';
var findUrl = rootUrl + "/find";
var placeUrl = rootUrl + "/findPlace";


var maxRows = 200;

var Api = {


  getItems: function(fields) {
      var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soTangSelectedIdx, radiusInKmSelectedIdx, dienTich, orderBy, place, geoBox} = fields;

      var params = {
          'loaiTin' : 'ban' === loaiTin ? 0 : 1,
          'loaiNhaDat' : loaiNhaDat || undefined,
          'giaBETWEEN' : gia ? RangeUtils.sellPriceRange.toValRange(gia).join() : gia,
          'soPhongNguGREATER' : DanhMuc.getSoPhongByIndex(soPhongNguSelectedIdx) || undefined,
          'soTangGREATER' : DanhMuc.getSoTangByIndex(soTangSelectedIdx) || undefined,
          'dienTichBETWEEN' : dienTich ? RangeUtils.dienTichRange.toValRange(dienTich).join() : undefined,
          'orderBy' : orderBy || undefined,
          'place':place || undefined,
          'geoBox' : geoBox.length===4 ? geoBox : undefined,
          'limit' : maxRows || undefined,
          'radiusInKm' : DanhMuc.getRadiusInKmByIndex(radiusInKmSelectedIdx) || undefined
      };

 
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

};

export { Api as default };
