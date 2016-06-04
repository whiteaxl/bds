'use strict';

const {Record} = require('immutable');

const ReactNative = require('react-native');
const {ListView} = ReactNative;

var InitialState = Record({
  allInboxDS : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
});

export default InitialState;

