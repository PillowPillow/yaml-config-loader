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
			var content = this.loadYaml(filePath),
			    contents = [content];

			if (!!content.imports) {
				var directory = path.dirname(filePath);

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = content.imports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var imp = _step.value;

						if (!imp['if'] || env.test(imp['if'])) contents = contents.concat(this.load(path.join(directory, imp.source)));
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
			}

			return contents;
		}
	}, {
		key: 'loadYaml',
		value: function loadYaml(filePath) {
			var exists = utils.fileExists(filePath),
			    content;

			if (exists) content = yaml.load(utils.loadFile(filePath));else throw Error('fileNotFound');

			return content;
		}
	}]);

	return Loader;
})();

module.exports = Loader;
