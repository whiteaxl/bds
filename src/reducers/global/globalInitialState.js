'use strict';

import {Record} from 'immutable';

/**
 * ## InitialState
 *  
 * * currentUser - object returned from Backend when validated
 * * showState - toggle for Header to display state
 * * currentState - object in Json format of the entire state
 * * store - the Redux store which is an object w/ 4 initial states
 *   * device
 *   * auth
 *   * global
 *   * profile
 *
 */
var InitialState = Record({
  currentUser: new (Record({
  	userID : '',
  	name : 'unknown',
  	isDevice : true
  })),
  
  showState: false,
  currentState: null,
  store: null

});
export default InitialState;
