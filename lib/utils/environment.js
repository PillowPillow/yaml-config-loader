'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var RG_PARAM = /\$\{([a-zA-Z0-1\_\-\.\$\@]+)\}/g;

var Environment = (function () {
	function Environment() {
		_classCallCheck(this, Environment);
	}

	_createClass(Environment, null, [{
		key: 'resolve',
		value: function resolve() {
			var variable = arguments[0] === undefined ? '' : arguments[0];

			return process.env[variable];
		}
	}, {
		key: 'resolveAll',
		value: function resolveAll() {
			var node = arguments[0] === undefined ? {} : arguments[0];

			for (var prop in node) if (node[prop] instanceof Object) node[prop] = this.resolveAll(node[prop]);else {
				var matched = undefined;
				while (matched = RG_PARAM.exec(node[prop])) {
					var _matched = _slicedToArray(matched, 2);

					var envVar = _matched[1];
					var value = this.resolve(envVar);

					if (value !== undefined) node[prop] = node[prop].replace('${' + envVar + '}', value);
				}
			}

			return node;
		}
	}, {
		key: 'test',
		value: function test() {
			var conditions = arguments[0] === undefined ? {} : arguments[0];

			var result = true;
			for (var key in conditions) {
				var value = this.resolve(key);
				if (value === undefined || conditions[key] instanceof Array && ! ~conditions[key].indexOf(value) || !(conditions[key] instanceof Array) && value !== conditions[key]) {
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
