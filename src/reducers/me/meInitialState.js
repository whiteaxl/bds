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
  topup : new Topup
});

export default InitialState;

