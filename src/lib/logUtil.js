'use strict';

var internals = {};

internals.warn = function(msg) {
	console.log("[WARN] ", msg);
};

internals.error = function(msg) {
	console.log("[ERROR] ", msg);
};

internals.info = function(msg) {
	console.log("[INFO] ", msg);
};

internals.enter = function(msg) {
	console.log("[ENTER] ", msg);
};

module.exports = internals;