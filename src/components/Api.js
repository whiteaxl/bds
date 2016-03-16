// Api.js

import ApiUtils from './ApiUtils'

var rootUrl = 'http://localhost:5000/api/find';

var Api = {
  getItems: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soPhongTam, dienTich) {
    var fullUrl = this.createFullUrl(loaiTin, loaiNhaDat, gia, soPhongNgu, soPhongTam, dienTich);
    // console.log("Full URL: " + fullUrl);
    return fetch(`${fullUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json())
    .catch(e => e);
  },
  addFilter: function(fullUrl, aFilter) {
    if ('' === fullUrl) {
      fullUrl = rootUrl + "?" + aFilter;
    } else {
      fullUrl = fullUrl + "&" + aFilter;
    }
    return fullUrl;
  },
  createFullUrl: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soPhongTam, dienTich) {
      var fullUrl = '';
      if (null !== loaiTin) {
        fullUrl = this.addFilter(fullUrl, "loaiTin="+loaiTin);
      }
      if (null !== loaiNhaDat) {
        fullUrl = this.addFilter(fullUrl, "loaiNhaDat="+loaiNhaDat);
      }
      if (null !== gia) {
        fullUrl = this.addFilter(fullUrl, "giaBETWEEN="+gia);
      }
      if (null !== soPhongNgu) {
        fullUrl = this.addFilter(fullUrl, "soPhongNguGREATER="+soPhongNgu);
      }
      if (null !== soPhongTam) {
        fullUrl = this.addFilter(fullUrl, "soPhongTamGREATER="+soPhongTam);
      }
      if (null !== dienTich) {
        fullUrl = this.addFilter(fullUrl, "dienTichBETWEEN="+dienTich);
      }
      if ('' === fullUrl) {
        fullUrl = rootUrl;
      }
      return fullUrl;
  }
};

export { Api as default };
