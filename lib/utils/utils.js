'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var fs = require('fs');

var Utils = (function () {
	function Utils() {
		_classCallCheck(this, Utils);
	}

	_createClass(Utils, null, [{
		key: 'fileExists',
		value: function fileExists(filePath) {
			return new Promise(function (resolve, reject) {
				fs.exists(filePath, function (exists) {
					if (!!exists) resolve();else reject('FileNotFound');
				});
			});
		}
	}, {
		key: 'loadFile',
		value: function loadFile(filePath) {
			return new Promise(function (resolve, reject) {
				return fs.readFile(filePath, 'utf8', function (error, content) {
					return error ? reject(error) : resolve(content);
				});
			});
		}
	}, {
		key: 'isObject',
		value: function isObject(value) {
			return value !== null && typeof value === 'object';
		}
	}, {
		key: 'isFunction',
		value: function isFunction(value) {
			return typeof value === 'function';
		}
	}, {
		key: 'isArray',
		value: function isArray(value) {
			return value instanceof Array;
		}
	}, {
		key: 'isRegExp',
		value: function isRegExp(value) {
			return value instanceof RegExp;
		}
	}, {
		key: 'extends',
		value: function _extends() {
			var destination = arguments[0] === undefined ? {} : arguments[0];
			var sources = arguments[1] === undefined ? [] : arguments[1];
			var deep = arguments[2] === undefined ? false : arguments[2];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {

				for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var source = _step.value;

					if (!this.isObject(source) && !this.isFunction(source)) continue;

					var keys = Object.keys(source);

					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var key = _step2.value;

							var value = source[key];

							if (deep && this.isObject(value) && !this.isRegExp(value)) {
								if (!this.isObject(destination[key])) destination[key] = this.isArray(value) ? [] : {};
								this['extends'](destination[key], [value], true);
							} else destination[key] = value;
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2['return']) {
								_iterator2['return']();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return destination;
		}
	}]);

	return Utils;
})();

module.exports = Utils;
