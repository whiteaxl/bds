'use strict';

const {Record, List} = require('immutable');

var Scratch = Record({
  type : "Mobifone",
  pin: "",
  serial: ""
});

var Topup = Record({
  scratch: new Scratch
});

var InitialState = Record({
  topup : new Topup
});

export default InitialState;

