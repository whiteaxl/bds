var _ = require('lodash');
var rootUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=4a52503a18f95f0c5dd3f3d8bb153830';

module.exports = function(latitude, longitude) {
  var url = `${rootUrl}&lat=${latitude}&lon=${longitude}`;

  return fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    return {
      city: json.name,
      description: _.capitalize(json.weather[0].description)
    }
  });
}
