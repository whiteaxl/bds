'use strict';

const {Record, List} = require('immutable');

var InitialState = Record({
  likedList :[],
  sellList :List([]),
  rentList :List([]),
  activeTab : 0,
  errorMsg:'',
  refreshing : false //refresh when scroll down
});

export default InitialState;

