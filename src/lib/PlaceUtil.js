import _ from "lodash";

var placeUtil = {};

placeUtil.type = {
    TINH : "administrative_area_level_1",
    HUYEN : "administrative_area_level_2",
    XA : "administrative_area_level_3",
    XA2 : "sublocality_level_1"
};

placeUtil.typeName = {
    TINH : "Tinh",
    HUYEN : "Huyen",
    XA : "Xa",
    DIA_DIEM: "Dia diem"
};

placeUtil.isHuyen = function(place) {
    let placeTypes=place.types;

    if (_.indexOf(placeTypes, placeUtil.type.HUYEN) > -1) {
        return true;
    }

    if (_.indexOf(placeTypes, 'locality') > -1
        && _.indexOf(placeTypes, 'political') > -1
        && place.description.indexOf("tp.") > -1
       ) {
        return true;
    }


};

placeUtil.getTypeName = function(place) {
    let placeTypes = place.types;

    if (_.indexOf(placeTypes, placeUtil.type.TINH) > -1) {
        return placeUtil.typeName.TINH;
    }
    if (placeUtil.isHuyen(place)) {
        return placeUtil.typeName.HUYEN;
    }

    if (_.indexOf(placeTypes, placeUtil.type.XA) > -1) {
        return placeUtil.typeName.XA;
    }

    if (_.indexOf(placeTypes, placeUtil.type.XA2) > -1) {
        return placeUtil.typeName.XA;
    }

    return placeUtil.typeName.DIA_DIEM;
};

export default placeUtil;