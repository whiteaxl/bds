'use strict';

const {Record, List} = require('immutable');

const ReactNative = require('react-native');
const {ListView} = ReactNative;

var InitialState = Record({
  inboxList: List ([]),
  allInboxDS : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
  loaiTin : 'all', //all,buy,sell
  currentUserID : null
});

export default InitialState;

