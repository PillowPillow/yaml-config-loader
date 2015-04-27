'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var path = require('path');

var RG_PARAM = /\$\{([a-zA-Z0-0\_\-\.\$\@]+)\}/g;
var APP_PATH = path.normalize(path.dirname(require.main.filename));

var Environment = (function () {
	function Environment() {
		_classCallCheck(this, Environment);
	}

	_createClass(Environment, null, [{
		key: 'resolve',
		value: function resolve() {
			var variable = arguments[0] === undefined ? '' : arguments[0];

			var resolved = variable;

			switch (variable) {
				case '__appPath':
					resolved = APP_PATH;
					break;
				default:

					var value;
					if (!!variable.match(/global\..*/)) {
						var parts = variable.split('.');

						value = global;
						for (var i = 1; i < parts.length; i++) if (value instanceof Object) value = value[parts[i]];else {
							value = undefined;
							break;
						}
					}

					if (value === undefined) value = process.env[variable] || variable;

					resolved = value;
			}

			return resolved;
		}
	}, {
		key: 'resolveAll',
		value: function resolveAll() {
			var node = arguments[0] === undefined ? {} : arguments[0];

			for (var prop in node) if (node[prop] instanceof Object) node[prop] = this.resolveAll(node[prop]);else node[prop] = this.resolveValue(node[prop]);

			return node;
		}
	}, {
		key: 'resolveValue',
		value: function resolveValue() {
			var values = arguments[0] === undefined ? [] : arguments[0];

			if (!(values instanceof Array)) values = [values];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var value = _step.value;

					var matched = undefined;
					while (matched = RG_PARAM.exec(value)) {
						var _matched = _slicedToArray(matched, 2);

						var envVar = _matched[1];
						var resolved = this.resolve(envVar);

						if (value !== undefined) value = value.replace('${' + envVar + '}', resolved);
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

			return value;
		}
	}, {
		key: 'test',
		value: function test() {
			var conditions = arguments[0] === undefined ? {} : arguments[0];

			var result = true;
			for (var key in conditions) {
				var resolvedKey = this.resolve(key),
				    resolvedValue = this.resolveValue(conditions[key]);

				if (resolvedKey === undefined || resolvedValue instanceof Array && ! ~resolvedValue.indexOf(resolvedKey) || !(resolvedValue instanceof Array) && resolvedKey !== resolvedValue) {
					result = false;
					break;
				}
			}
			return result;
		}
	}]);

	return Environment;
})();

module.exports = Environment;
