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
    var fullParams = this.createFullParams(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy);
    var params = {};
    fullParams.map(function(oneParam) {
      params[oneParam.key] = oneParam.value;
    })
    console.log(JSON.stringify(params));
    return fetch(`${rootUrl}`, {
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
  createOrderParam: function(orderBy) {
    var orderParams = [];
    if (orderTypes[2] === orderBy) {
      orderParams.push({key: 'orderBy', value: 'giaDESC'});
    }
    else if (orderTypes[3] === orderBy) {
      orderParams.push({key: 'orderBy', value: 'giaASC'});
    }
    else if (orderTypes[4] === orderBy) {
      orderParams.push({key: 'orderBy', value: 'soPhongNguASC'});
    }
    else if (orderTypes[5] === orderBy) {
      orderParams.push({key: 'orderBy', value: 'dienTichDESC'});
    }
    return orderParams;
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
  createFullParams: function(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy) {
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
        params.push({key: 'giaBETWEEN', value: this.arrayToString(gia)});
      }
      if (soPhongNgu) {
        params.push({key: 'soPhongNguGREATER', value: soPhongNgu});
      }
      if (soTang) {
        params.push({key: 'soTangGREATER', value: soTang});
      }
      if (dienTich) {
        params.push({key: 'dienTichBETWEEN', value: this.arrayToString(dienTich)});
      }
      var orderParams = this.createOrderParam(orderBy);
      orderParams.map(function(oneParam) {
        params.push(oneParam);
      });
      return params;
  }
};

export { Api as default };
