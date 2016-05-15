'use strict';

var internals = {};

internals.warn = function(...msg) {
	internals.doLog("[WARN] ", ...msg);
};

internals.error = function(...msg) {
	internals.doLog("[ERROR] ", ...msg);
};

internals.info = function(...msg) {
	internals.doLog("[INFO] ", ...msg);
};

internals.enter = function(...msg) {
	internals.doLog("[ENTER] ", ...msg);
};

internals.doLog = function(type, ...msg) {
	console.log(type, ...msg);
};

module.exports = internals;