'use strict';

import danhMuc from "../../assets/DanhMuc";

const {Record, List} = require('immutable');

var Condition = Record({
  loaiTin: 0,
  loaiNhaDat: null,
  codeDuAn : null,
  position: {},
  gia: null
});

var InitialState = Record({
  condition : new Condition,
  isLoading: false
});

export default InitialState;

