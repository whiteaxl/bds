// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"

import DanhMuc from "../assets/DanhMuc"
import cfg from "../cfg";

var rootUrl = `http://${cfg.server}:5000/api`;
var findUrl = rootUrl + "/find";
var placeUrl = rootUrl + "/findPlace";
var detailUrl = rootUrl + "/detail";


var maxRows = 200;

var Api = {


  getItems: function(fields) {
      var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soTangSelectedIdx, radiusInKmSelectedIdx, dienTich, orderBy, place, geoBox, huongNha, ngayDaDang} = fields;

      if (place) {
          place.radiusInKm = DanhMuc.getRadiusInKmByIndex(radiusInKmSelectedIdx) || undefined;
      }

      var params = {
          'loaiTin' : 'ban' === loaiTin ? 0 : 1,
          'loaiNhaDat' : loaiNhaDat || undefined,
          'giaBETWEEN' : gia ? RangeUtils.sellPriceRange.toValRange(gia) : gia,
          'soPhongNguGREATER' : DanhMuc.getSoPhongByIndex(soPhongNguSelectedIdx) || undefined,
          'soTangGREATER' : DanhMuc.getSoTangByIndex(soTangSelectedIdx) || undefined,
          'dienTichBETWEEN' : dienTich ? RangeUtils.dienTichRange.toValRange(dienTich) : undefined,
          'orderBy' : orderBy || undefined,
          'place':place || undefined,
          'geoBox' : geoBox.length===4 ? geoBox : undefined,
          'limit' : maxRows || undefined,
          'huongNha' : huongNha || undefined,
          'ngayDaDang' : ngayDaDang || undefined
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
    }
};

export { Api as default };
