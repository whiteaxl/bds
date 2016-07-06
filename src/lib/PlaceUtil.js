import _ from "lodash";

var placeUtil = {};

placeUtil.fullName = function (place) {
  //todo: other types
  if (place.placeType === "Quan" || place.placeType === "Huyen") {
    return place.placeName + ", " + place.parentName;
  }

  return place.placeName;
};
// return Quoc Gia form Place.Place is type of Google api
placeUtil.getQuocGia = function (place) {

  var getCountry = "";

  for (var i = 0; i < place.address_components.length; i++) {
    var addr = place.address_components[i];

    for (var j = 0; j < addr.types.length; j++) {
      if (addr.types[j] == 'country') {
        getCountry = addr.long_name;
        return getCountry;
      }
    }
  }
  return getCountry;
};

// return Tinh form Place.Place is type of Google api
placeUtil.getTinh = function (place) {

  var Tinh = "";

  for (var i = 0; i < place.address_components.length; i++) {
    var addr = place.address_components[i];

    for (var j = 0; j < addr.types.length; j++) {
      if (addr.types[j] == placeUtil.type.TINH) {
        Tinh = addr.long_name;
        return Tinh;
      }
    }
  }
  return Tinh;
};

// return Huyen form Place.Place is type of Google api
placeUtil.getHuyen = function (place) {

  var Huyen = "";

  for (var i = 0; i < place.address_components.length; i++) {
    var addr = place.address_components[i];

    for (var j = 0; j < addr.types.length; j++) {
      if (addr.types[j] == placeUtil.type.HUYEN) {
        Huyen = addr.long_name;
        return Huyen;
      }
    }
  }
  return Huyen;
};

// return Xa form Place.Place is type of Google api
placeUtil.getXa = function (place) {

  var Xa = "";

  for (var i = 0; i < place.address_components.length; i++) {
    var addr = place.address_components[i];

    for (var j = 0; j < addr.types.length; j++) {
      if ((addr.types[j] == placeUtil.type.XA) || (addr.types[j] == placeUtil.type.XA2)) {
        Xa = addr.long_name;
        return Xa;
      }
    }
  }
  return Xa;
};

placeUtil.type = {
  TINH: "administrative_area_level_1",
  HUYEN: "administrative_area_level_2",
  XA: "administrative_area_level_3",
  XA2: "sublocality_level_1",
  DUONG: "route"
};

placeUtil.typeName = {
  TINH: "Tỉnh",
  HUYEN: "Huyện",
  XA: "Xã",
  DUONG: "Đường",
  DIA_DIEM: "Địa điểm"
};

placeUtil.isHuyen = function (place) {
  let placeTypes = place.types;

  if (_.indexOf(placeTypes, placeUtil.type.HUYEN) > -1) {
    return true;
  }

  if (_.indexOf(placeTypes, 'locality') > -1
    && _.indexOf(placeTypes, 'political') > -1
    && place.description
    && ( place.description.indexOf("tp.") > -1 || place.description.indexOf("tx.") > -1)
  ) {
    return true;
  }
};

placeUtil.getTypeName = function (place) {
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

  if (_.indexOf(placeTypes, placeUtil.type.DUONG) > -1) {
    return placeUtil.typeName.DUONG;
  }

  return placeUtil.typeName.DIA_DIEM;
};

//Not Xa, Huyen, Tinh is DiaDiem
placeUtil.isDiaDiem = function (place) {
  let name = place.relandTypeName || placeUtil.getTypeName(place);

  return name === placeUtil.typeName.DIA_DIEM || name === placeUtil.typeName.DUONG;
};

placeUtil.getDiaChinhFullName = function (place) {
  let {xa, huyen, tinh} = place.diaChinh;
  if (xa != '') {
    return xa + ', ' + huyen + ', ' + tinh;
  } else {
    return huyen + ', ' + tinh;
  }
};

export default placeUtil;