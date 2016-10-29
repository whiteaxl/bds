'use strict';

import danhMuc from "../../assets/DanhMuc";

const {Record, List} = require('immutable');

var Scratch = Record({
  type : danhMuc.telco.mobifone,
  pin: "",
  serial: "",
  submitting : false,
});

var Topup = Record({
  scratch: new Scratch
});

var Profile = Record({
  userID: null,
  fullName : null,
  email : null,
  phone : null,
  diaChi : null,
  gioiThieu: null,
  avatar : null,
  sex: null, // F, M, U
  birthDate: null, // date type
  website: null,
  broker: null, // U: khong xac dinh, M: Moi gioi, C: Chinh chu
});

var InitialState = Record({
  topup : new Topup,
  profile: new Profile,
  isUpdatingProfile: false
});

export default InitialState;

