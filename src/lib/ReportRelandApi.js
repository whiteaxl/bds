import ApiUtils from './ApiUtils';

import cfg from "../cfg";
var rootUrl = `${cfg.rootUrl}`;
var reportUrl = rootUrl + "/reportReland";

var Api = {
    reportReland: function(params) {
        console.log(reportUrl + "?" + JSON.stringify(params));

        return fetch(reportUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                timeout: 0,
                body: JSON.stringify(params)
            })
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .catch(e => {
                console.log("Error when report: " + reportUrl,e);
                return e;
            });
    }
};

export { Api as default };