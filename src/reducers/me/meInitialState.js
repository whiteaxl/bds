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

var InitialState = Record({
  topup : new Topup,
  profile: {
    userID: null,
    fullName : null,
    email : null,
    phone : null,
    diaChi : null,
    gioiThieu: null,
    avatar : null,
    sex: null, // F, M, U
    birthDate: null,
    website: null,
    broker: null, // Y, N, U
    newPass : null
  }
});

export default InitialState;

