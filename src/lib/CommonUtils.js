// ApiUtils.js

import LoaiNhaDat from "./DanhMuc.js" 

var CommonUtils = {
  getKeyOfMap: function(hash, value) {
    for(var key in hash){
    	if(hash[key]==value)
    		return key;
    }
    return null;
  },

  getLoaiNhaDatForDisplay: function(loaiTin, loaiNhaDatKey){
  	if (loaiTin == 'ban')
  		return LoaiNhaDat.ban[loaiNhaDatKey];

  	if (loaiTin == 'thue')
  		return LoaiNhaDat.thue[loaiNhaDatKey];

  	return null;
  }
};

export { CommonUtils as default };
