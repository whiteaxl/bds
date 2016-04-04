// ApiUtils.js

var ApiUtils = {
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  },
  getBbox: function(region){
  	var latMax = region.latitude + region.latitudeDelta/2;
    var lonMax = region.longitude + region.longitudeDelta/2;
    var latMin = latMax - region.latitudeDelta;
    var lonMin = lonMax - region.longitudeDelta;
    return [lonMin, latMin, lonMax, latMax];
  }
};

export { ApiUtils as default };
