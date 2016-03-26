//

var CommonUtils = {
  getKeyOfMap: function(hash, value) {
    for(var key in hash){
    	if(hash[key]==value)
    		return key;
    }
    return null;
  }
};

export { CommonUtils as default };
