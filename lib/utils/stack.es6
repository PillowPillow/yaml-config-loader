module.exports = function stack(...args) {
	var orig = Error.prepareStackTrace;
	Error.prepareStackTrace = function(_, stack){ return stack; };
	var err = new Error;
	Error.captureStackTrace(err, args.callee);
	var stack = err.stack;
	Error.prepareStackTrace = orig;
	return stack;
}