// ApiUtils.js

var ApiUtils = {
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      console.log("response fail:", response);

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
    return [latMin, lonMin, latMax, lonMax];
  },
  
  getPolygonBox: function (polygon) {
    var {coordinates} = polygon;
    var firstLat = coordinates[0].latitude;
    var firstLon = coordinates[0].longitude;
    var latMax = firstLat;
    var lonMax = firstLon;
    var latMin = firstLat;
    var lonMin = firstLon;
    polygon.coordinates.map(function (coordinate) {
      var lat = coordinate.latitude;
      var lon = coordinate.longitude;
      if (latMax < lat) {
        latMax = lat;
      }
      if (lonMax < lon) {
        lonMax = lon;
      }
      if (latMin > lat) {
        latMin = lat;
      }
      if (lonMin > lon) {
        lonMin = lon;
      }
    })
    return [latMin-0.025, lonMin-0.017, latMax+0.025, lonMax+0.017];
  },

  //lat1, lon1, lat2, lon2
  getRegion: function(geoBox){
    var latitudeDelta = geoBox[2] - geoBox[0];
    var longitudeDelta = geoBox[3] - geoBox[1];
    var latitude = geoBox[2] - latitudeDelta/2;
    var longitude = geoBox[3] - longitudeDelta/2;
    return {latitude: latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta};
  },

  getRegionByViewport: function(viewport){
    var geoBox = [viewport.southwest.lat, viewport.southwest.lon,
                  viewport.northeast.lat, viewport.northeast.lon];

    return ApiUtils.getRegion(geoBox);
  }
};

export { ApiUtils as default };
