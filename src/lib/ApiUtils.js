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
  	var latMax = region.latitude + region.latitudeDelta/2.0;
    var lonMax = region.longitude + region.longitudeDelta/2.0;
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
    });
    // return [0.96*latMin, 0.96*lonMin, 1.04*latMax, 1.04*lonMax];
    return [latMin, lonMin, latMax, lonMax];
  },

  convertPolygon(polygon){
    var convertedPolygon = [];

    polygon.coordinates.map(function (coordinate) {
      var lat = coordinate.latitude;
      var lon = coordinate.longitude;
      convertedPolygon.push({lat, lon});
    });

    return convertedPolygon;
  },

  convertPolygonForGUI(polygon){
    var convertedPolygon = [];

    polygon.map(function (one) {
      var lat = one.lat;
      var lon = one.lon;
      convertedPolygon.push({latitude: lat, longitude: lon});
    });

    return [{id: 0, coordinates: convertedPolygon}];
  },

  //lat1, lon1, lat2, lon2
  getRegion: function(geoBox){
    var latitudeDelta = geoBox[2] - geoBox[0];
    var longitudeDelta = geoBox[3] - geoBox[1];
    var latitude = geoBox[2] - latitudeDelta/2.0;
    var longitude = geoBox[3] - longitudeDelta/2.0;
    return {latitude: latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta};
  },

  getRegionByViewport: function(viewport){
    var geoBox = [viewport.southwest.lat, viewport.southwest.lon,
                  viewport.northeast.lat, viewport.northeast.lon];

    return ApiUtils.getRegion(geoBox);
  },

  getViewport: function(region) {
    var geoBox = this.getBbox(region);
    return this.getViewportByBox(geoBox);
  },

  getViewportByBox: function(geoBox) {
    var viewport = {};
    viewport.southwest = {lat: geoBox[0], lon: geoBox[1]};
    viewport.northeast = {lat: geoBox[2], lon: geoBox[3]};
    return viewport;
  }
};

export { ApiUtils as default };
