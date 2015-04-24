'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var utils = require('' + __dirname + '/utils'),
    env = require('' + __dirname + '/environment'),
    path = require('path'),
    yaml = require('js-yaml');

var Loader = (function () {
	function Loader() {
		_classCallCheck(this, Loader);
	}

	_createClass(Loader, null, [{
		key: 'load',
		value: function load(filePath) {
			var _this = this;

			return this.loadYaml(filePath).then(function (content) {
				var promise = Promise.resolve([]);

				if (!!content.imports) {
					var directory = path.dirname(filePath),
					    promises = [];
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = content.imports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var imp = _step.value;

							if (!imp['if'] || env.test(imp['if'])) promises.push(_this.load(path.join(directory, imp.source)));
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

					delete content.imports;
					promise = Promise.all(promises);
				}

				return promise.then(function (results) {
					var contents = [content];
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var result = _step2.value;

							contents = contents.concat(result);
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

					return contents;
				});
			});
		}
	}, {
		key: 'loadYaml',
		value: function loadYaml(filePath) {
			return utils.fileExists(filePath).then(function () {
				return utils.loadFile(filePath);
			}).then(function (content) {
				return yaml.load(content);
			});
		}
	}]);

	return Loader;
})();

module.exports = Loader;
