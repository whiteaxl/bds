// Api.js

import ApiUtils from './ApiUtils'

var rootUrl = 'http://localhost:5000/api/find';

var Api = {
  getItems: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich) {
    var fullUrl = this.createFullUrl(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich);
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
  createFullUrl: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich) {
      var fullUrl = '';
      var loaiTinVal = null;
      if ('ban' === loaiTin) {
        loaiTinVal = 0;
      }
      if ('thue' === loaiTin) {
        loaiTinVal = 1;
      }
      if (null !== loaiTinVal) {
        fullUrl = this.addFilter(fullUrl, "loaiTin="+loaiTinVal);
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
      if (null !== soTang) {
        fullUrl = this.addFilter(fullUrl, "soTangGREATER="+soTang);
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
