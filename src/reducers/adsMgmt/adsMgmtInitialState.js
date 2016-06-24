'use strict';

const {Record, List} = require('immutable');

var InitialState = Record({
  likedList :[],
  sellList :List([]),
  rentList :List([]),
  activeTab : 0,
  loadingFromServer : false,
  errorMsg:''
});

export default InitialState;

