'use strict';

const {Record, List} = require('immutable');
const {
    SEARCH_STATE_INPUT
} = require('../../lib/constants').default;

import RangeUtils from "../../lib/RangeUtils";
import danhMuc from "../../assets/DanhMuc";


const defaultItemInCollection = {
    adsID : "",
    giaFmt : "",
    khuVuc : "",
    soPhongNguFmt : "",
    soPhongTamFmt : "",
    dienTichFmt : "",
    cover : "http://203.162.13.177:5000/web/asset/img/no_cover.jpg"
};


/**
 * This Record contains the state of the seach form
 */
const SearchForm = Record({
    fields: new (Record({
        loaiTin: 'ban',
        ban: {
            loaiNhaDat: '',
            gia: RangeUtils.BAT_KY_RANGE
        },
        thue: {
            loaiNhaDat: '',
            gia: RangeUtils.BAT_KY_RANGE
        },
        giaPicker : RangeUtils.sellPriceRange.getPickerData(),
        dienTich: RangeUtils.BAT_KY_RANGE,
        ngayDaDang: '', //batky
        soPhongNguSelectedIdx: 0,
        soNhaTamSelectedIdx: 0,
        huongNha: 0,
        viewport: {
            northeast: {
                lat: 21.0594115,
                lon: 105.8134889
            },
            southwest: {
                lat: 21.0009685,
                lon: 105.7680415
            }
        },
        polygon: [], //[{lat, lon}]

        radiusInKmSelectedIdx: 0,
        center : null , //{lat, lon}
        diaChinh : {
            tinhKhongDau : "HN",
            huyenKhongDau : "7",
            xaKhongDau : undefined,
            duAnKhongDau : undefined,
            fullName : 'Quận Cầu Giấy, Hà Nội'
        },
        diaChinhViewport: {
            northeast: {
                lat: 21.0594115,
                lon: 105.8134889
            },
            southwest: {
                lat: 21.0009685,
                lon: 105.7680415
            }
        },
        orderBy: '',
        limit: 25,
        pageNo: 1,
        isIncludeCountInResponse: true,
        updateLastSearch: false,
        userID: null,

        marker: {}

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
    map : new (Record({
        type: "Standard",
        polygons: []
    })),

    result: new (Record({
        listAds: [],
        errorMsg: "",
        totalCount : 0

    })),

    /*
     searchObj : {
       name : 'Search at ' + moment().format("DD-MM-YYYY HH:mm:ss"),
       timeModified : new Date().getTime(),
       query : query,
       isRecent : true,
       desc: findApi.convertQuery2String(query),
     }
     */
    saveSearchList : [],
    recentSearchList : [],
    //home screen
    loadingHomeData : false,
    homeRefreshing : false, // for scroll down
    collections : [{
        title1 : "",
        title2 : "",
        //data must have 5 elements
        data : [defaultItemInCollection, defaultItemInCollection,
            defaultItemInCollection,
            defaultItemInCollection, defaultItemInCollection],
        query : {loaiTin: 0} //search conditions
    }],
    homeDataErrorMsg : "",
    //shared
    searchCalledFrom : "Search",
    drawMode: false,
    alertUs: '',
    listScrollPos: 0,
    mapPageNo: 1
});
export default InitialState;
