'use strict';

import danhMuc from '../assets/DanhMuc';
import log from './logUtil';
import placeUtil from './PlaceUtil';

var util = {};

util.normalizeNumeric = function (str) {
  let val = str.replace(/([a-zA-Z ])/g, '');
  val = val.replace(/,/g, '.');
  while (val.indexOf('..') != -1) {
    val = val.replace('..', '.');
  }
  return val;
}

util.locDau = function (str) {
  var a1 = locDauInt(str);
  var a2 = locDauInt(a1);

  return a2;
};

var locDauInt = function (str) {
  if (!str) {
    return str
  }
  //var str = (document.getElementById("title").value);
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|à/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ộ|ớ|ợ|ở|ỡ|ọ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
  str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
  str = str.replace(/^\-+|\-+$/g, "");//cắt bỏ ký tự - ở đầu và cuối chuỗi
  return str;
};

util.roundToTwo = function(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}

util.getPriceDisplay = function (val, loaiTin) {
  try {
    if (!val) {
      return "Thỏa thuận";
    }

    val = Number(val);

    if (loaiTin===0) { //ban
      if (val < 1000) {
        return util.roundToTwo(val) + " Triệu";
      }

      return util.roundToTwo(val/1000) + " Tỷ";
    } else {
      return util.roundToTwo(val) +  " Triệu";
    }
  } catch(ex) {
    console.log("Error when getPriceDisplay of " + val, ex)
  }
};

util.getPriceM2Display = function(val, loaiTin) {
  try {
    if (!val || val == -1) {
      return "Thỏa thuận";
    }
    val = Number(val);
    if (loaiTin===0) { //ban
      if (val >= 1000) {
        return (Math.round(val * 100000) / 100) + " tỷ/m²";
      }else if(val< 1000 && val >= 1 ){
        return (Math.round(val * 10) / 10) + " triệu/m²";
      }else{
        return (Math.round(val*1000)) + " nghìn/m²";
      }
    } else {
      if(val >=1){
        return (Math.round(val * 10) / 10) + " triệu/m²";
      }else{
        return (Math.round(val*1000)) + " nghìn/m²";
      }
    }
  } catch(ex) {
    console.log("Error when getPriceDisplay of " + val, ex)
  }

};

util.getDienTichDisplay = function (val) {
  if (!val) {
    return "Không rõ";
  }

  return val + "m²";
};

util.getLoaiNhaDatFmt = function(ads) {
  let loaiNhaDatFmt = "";
  if (ads.loaiNhaDat) {
    loaiNhaDatFmt = ads.loaiTin ? danhMuc.LoaiNhaDatThue[ads.loaiNhaDat] : danhMuc.LoaiNhaDatBan[ads.loaiNhaDat];
    loaiNhaDatFmt = loaiNhaDatFmt.replace("Bán ", "").replace("Cho Thuê ", "");
    loaiNhaDatFmt = loaiNhaDatFmt[0].toUpperCase() + loaiNhaDatFmt.slice(1);
  }

  return loaiNhaDatFmt;
};

util.getAdsTitle4Inbox = function (ads) {
  log.info("getAdsTitle4Inbox", ads);

  let giaFmt = util.getPriceDisplay(ads.gia, ads.loaiTin);
  let loaiNhaDatFmt = "";
  if (ads.loaiNhaDat) {
    loaiNhaDatFmt = ads.loaiTin ? danhMuc.LoaiNhaDatThue[ads.loaiNhaDat] : danhMuc.LoaiNhaDatBan[ads.loaiNhaDat];
    loaiNhaDatFmt = loaiNhaDatFmt.replace("Bán ", "").replace("Cho Thuê ", "");
    loaiNhaDatFmt = loaiNhaDatFmt[0].toUpperCase() + loaiNhaDatFmt.slice(1);
  }

  let title = `${giaFmt} - ${loaiNhaDatFmt} - ${placeUtil.getDiaChinhFullName(ads.place)}`;

  return title;
};

util.hexToRgb = function (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
};

util.random = function (min, max){
  return Math.floor(Math.random() * (max - min +1)) + min;
}

util.formatAMPM  = function(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

module.exports = util;