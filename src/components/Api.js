// Api.js

import ApiUtils from './ApiUtils';

var rootUrl = 'http://localhost:5000/api/find';

const orderTypes = [
          'Mặc định',
          'Ngày nhập',
          'Giá (Giảm dần)',
          'Giá (Tăng dần)',
          'Số phòng ngủ',
          'Diện tích'
        ];

var Api = {
  getItems: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy) {
    var fullUrl = this.createFullUrl(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy);
    //console.log("Full URL: " + fullUrl);
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
  addOrder: function(fullUrl, orderBy) {
    if (orderTypes[2] === orderBy) {
      fullUrl = this.addFilter(fullUrl, "orderBy=giaDESC");
    }
    else if (orderTypes[3] === orderBy) {
      fullUrl = this.addFilter(fullUrl, "orderBy=giaASC");
    }
    else if (orderTypes[4] === orderBy) {
      fullUrl = this.addFilter(fullUrl, "orderBy=soPhongNguASC");
    }
    else if (orderTypes[5] === orderBy) {
      fullUrl = this.addFilter(fullUrl, "orderBy=dienTichDESC");
    }
    return fullUrl;
  },
  createFullUrl: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy) {
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
      if (loaiNhaDat) {
        fullUrl = this.addFilter(fullUrl, "loaiNhaDat="+loaiNhaDat);
      }
      if (gia) {
        fullUrl = this.addFilter(fullUrl, "giaBETWEEN="+gia);
      }
      if (soPhongNgu) {
        fullUrl = this.addFilter(fullUrl, "soPhongNguGREATER="+soPhongNgu);
      }
      if (soTang) {
        fullUrl = this.addFilter(fullUrl, "soTangGREATER="+soTang);
      }
      if (dienTich) {
        fullUrl = this.addFilter(fullUrl, "dienTichBETWEEN="+dienTich);
      }
      if (orderBy) {
        fullUrl = this.addOrder(fullUrl, orderBy);
      }
      if ('' === fullUrl) {
        fullUrl = rootUrl;
      }
      return fullUrl;
  }
};

export { Api as default };
