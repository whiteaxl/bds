'use strict';

const {Record} = require('immutable');

var InitialState = Record({
  username: "0987654301", //phone or email
  error: "",
  password: "",
  fullName: "",
  image: null,
  clientVerifyCode: "",
  serverVerifyCode: ""
});

export default InitialState;

