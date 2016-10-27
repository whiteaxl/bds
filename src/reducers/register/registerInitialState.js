'use strict';

const {Record} = require('immutable');

var InitialState = Record({
  username: "", //phone or email
  error: "",
  matKhau: "",
  fullName: "",
  image: null,
  clientVerifyCode: "",
  serverVerifyCode: ""
});

export default InitialState;

