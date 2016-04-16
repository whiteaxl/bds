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
  },

  getRegion: function(geoBox){
    var latitudeDelta = geoBox[3] - geoBox[1];
    var longitudeDelta = geoBox[2] - geoBox[0];
    var latitude = geoBox[3] - latitudeDelta/2;
    var longitude = geoBox[2] - longitudeDelta/2;
    return {latitude: latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta};
  }
};

export { ApiUtils as default };
