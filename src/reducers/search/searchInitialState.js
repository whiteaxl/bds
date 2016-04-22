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
        soPhongNguSelectedIdx: 0,
        soTangSelectedIdx: 0,
        soNhaTamSelectedIdx : 0,
        dienTich: RangeUtils.BAT_KY_RANGE,
        gia: RangeUtils.BAT_KY_RANGE,
        giaPicker: RangeUtils.sellPriceRange.getPickerData(),
        orderBy: '',
        listData: [],
        marker: {},
        geoBox: [],
        place: {
            placeId: "ChIJKQqAE44ANTERDbkQYkF-mAI",
            relandTypeName : "Tinh",
            fullName: "Hanoi",
            currentLocation : ''
        },
        radiusInKmSelectedIdx: 0,
        huongNha: '',
        ngayDaDang: 30
    }))

});

/**
 * ## InitialState
 * The form is set
 */
var InitialState = Record({
    state: SEARCH_STATE_INPUT,

    form: new SearchForm,
    loadingFromServer : false,

    result: new (Record({
        listAds: [],
        errorMsg: "",
        viewport : {
            center: {lat:0, lon:0},
            northeast : {lat:0, lon:0},
            southwest : {lat:0, lon:0}
        }

    }))
});
export default InitialState;
