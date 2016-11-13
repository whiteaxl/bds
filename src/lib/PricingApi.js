import cfg from "../cfg";

import ApiUtils from './ApiUtils';

var pricingUrl = cfg.rootUrl + "/v2/getProductPricing";

import log from './logUtil';
import gui from './gui';

var PricingApi = {
    calculatePricing(dto) {
        const url  = pricingUrl;

        log.info("Call fetch ", url, JSON.stringify(dto));

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        })
            .then(ApiUtils.checkStatus)
            .then(response => {
                return response.json()
            })
            .catch(e => {
                log.info("Error in getInboxMsg", e);
                return {
                    status : 101,
                    msg: gui.ERR_LoiKetNoiMayChu
                }
            });
    }
};

export { PricingApi as default };

