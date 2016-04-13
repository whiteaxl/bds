// Api.js

import ApiUtils from './ApiUtils';
import RangeUtils from "../lib/RangeUtils"
import _ from "lodash"

//var rootUrl = 'http://203.162.13.101:5000/api';
var rootUrl = 'http://localhost:5000/api';
var findUrl = rootUrl + "/find";
var placeUrl = rootUrl + "/findPlace";


var maxRows = 200;

var Api = {


  getItems: function(fields) {
      var {loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy, place, bbox} = fields;

      var params = {
          'loaiTin' : 'ban' === loaiTin ? 0 : 1,
          'loaiNhaDat' : loaiNhaDat || undefined,
          'giaBETWEEN' : gia ? RangeUtils.sellPriceRange.toValRange(gia).join() : gia,
          'soPhongNguGREATER' : soPhongNgu || undefined,
          'soTangGREATER' : soTang || undefined,
          'dienTichBETWEEN' : dienTich ? RangeUtils.dienTichRange.toValRange(dienTich).join() : undefined,
          'orderBy' : orderBy || undefined,
          'place':place || undefined,
          'geoBox' : bbox.length===4 ? bbox : undefined,
          'limit' : maxRows || undefined
      };

      //go by political first
      if (_.indexOf(place.types, "political") !== -1 || _.indexOf(place.types, "route")!==-1) {

      } else {

      }


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
