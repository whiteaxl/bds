'use strict';

const {
  ON_INBOX_FIELD_CHANGE,
} = require('../../lib/constants').default;

const _ = require('lodash');

import log from "../../lib/logUtil";

export function onInboxFieldChange(field, value) {
  return {
    type: ON_INBOX_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}






