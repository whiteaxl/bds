'use strict';

const {
  ON_SEARCH_FIELD_CHANGE,
} = require('../../lib/constants').default;


/**
 * ## onSearchFieldChange
 * Set the payload so the reducer can work on it
 */
export function onSearchFieldChange(field,value) {
  return {
    type: ON_SEARCH_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}


