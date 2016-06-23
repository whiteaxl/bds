'use strict';

import moment from 'moment';

var internals = {};

internals.warn = function(...msg) {
	internals.doLog("[WARN]", ...msg);
};

internals.error = function(...msg) {
	internals.doLog("[ERROR]", ...msg);
};

internals.info = function(...msg) {
	internals.doLog("[INFO]", ...msg);
};

internals.enter = function(...msg) {
	internals.doLog("[ENTER]", ...msg);
};

internals.doLog = function(type, ...msg) {
	//let dt = moment().format('HH:mm:ss.SSS');
  let dt = moment().format('mm:ss.SSS');

	console.log(`[${dt}]`, type, ...msg);
};

module.exports = internals;