/**
 * # authInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict';
/**
 * ## Import
 */
const {Record} = require('immutable');
const {
    SEARCH_STATE_INPUT
} = require('../../lib/constants').default;

import RangeUtils from "../../lib/RangeUtils"

/**
 * This Record contains the state of the seach form
 */
const SearchForm = Record({
    fields: new (Record({
        loaiTin: 'ban',
        loaiNhaDat: '',
        soPhongNgu: 0,
        soTangSeletedIdx: 0,
        //soNhaTam: 0,
        soNhaTamSelectedIdx : 0,
        dienTich: RangeUtils.BAT_KY_RANGE,
        gia: RangeUtils.BAT_KY_RANGE,
        giaPicker: RangeUtils.sellPriceRange.getPickerData(),
        orderBy: '',
        listData: [],
        marker: {},
        geoBox: [],
        place: {
            "address_components": [{
                "long_name": "Hanoi",
                "short_name": "Hanoi",
                "types": ["administrative_area_level_1", "political"]
            }, {"long_name": "Vietnam", "short_name": "VN", "types": ["country", "political"]}],
            "adr_address": "<span class=\"region\">Hanoi</span>, <span class=\"country-name\">Vietnam</span>",
            "formatted_address": "Hanoi",
            "geometry": {
                "location": {"lat": 21.0031177, "lng": 105.8201408},
                "viewport": {
                    "northeast": {"lat": 21.3846139, "lng": 106.019997},
                    "southwest": {"lat": 20.564778, "lng": 105.290621}
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
            "id": "80ec0160a2175da645aac12f8124b816e405b074",
            "name": "Hanoi",
            "place_id": "ChIJKQqAE44ANTERDbkQYkF-mAI",
            "reference": "CnRrAAAAlRKfhDZSWSBixxUrzYuNCWRxOFrgSVUFDMrDTAUDYVAjAppZN4dVymOKbeAdrW5mXVn-ReTPWZceJTxFfQyXQZmbHw1ThnCnoDgadSaG8qdso9zsHb5DxdRnV-2bBTZMRZNrjpLu6clayY2sqmYYcRIQBkM3xOg3XmLIKayazHdesRoUzHNCzoMn2lcSEEhgAZvefhKe7fA",
            "scope": "GOOGLE",
            "types": ["administrative_area_level_1", "political"],
            "url": "https://maps.google.com/?q=Hanoi,+Vietnam&ftid=0x3135008e13800a29:0x2987e416210b90d",
            "fullName": "Hanoi"
        },
        radiusInKm: 0.5
    })),

});

/**
 * ## InitialState
 * The form is set
 */
var InitialState = Record({
    state: SEARCH_STATE_INPUT,

    form: new SearchForm,

    result: new (Record({
        listAds: [],
        errorMsg: ""
    }))
});
export default InitialState;
