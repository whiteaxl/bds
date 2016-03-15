// Api.js

import ApiUtils from './ApiUtils'

var rootUrl = 'http://localhost:5000/api/find';

var Api = {
  getItems: function() {
    return fetch(`${rootUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

      })
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json())
    .catch(e => e);
  }
};

export { Api as default };
