'use strict';

const {
    ON_PRICING_FIELD_CHANGE,
    ON_PRICING_REQUEST,
    ON_PRICING_SUCCESS,
    ON_PRICING_FAILURE,
} = require('../../lib/constants').default;

import log from "../../lib/logUtil";

import pricingApi from '../../lib/PricingApi';

export function onPricingFieldChange(field, value) {
    return {
        type: ON_PRICING_FIELD_CHANGE,
        payload: {field: field, value: value}
    };
}


export function onPricingRequest() {
    return {
        type: ON_PRICING_REQUEST
    };
}

export function onPricingSuccess(payload) {
    return {
        type: ON_PRICING_SUCCESS,
        payload: payload
    };
}

export function onPricingFailure(error) {
    return {
        type: ON_PRICING_FAILURE,
        payload: error
    };
}

export function calculatePricing(dto) {
    log.info("pricingAction, calculate price");

    return dispatch => {
        dispatch(onPricingRequest());

        return pricingApi.calculatePricing(dto)
            .then(res => {
                if (res.success) {
                    dispatch(onPricingSuccess(res.user));
                } else {
                    log.error("get Profile error", res);
                    dispatch(onPricingFailure(res.msg));
                }
                console.log("================ calculatePricing result");
                console.log(res);
                console.log("================ calculatePricing result");
                return res;
            })
    }
}



