var fs = require('fs');

class Utils {

	static fileExists(filePath) {
		return fs.existsSync(filePath);
	}

	static loadFile(filePath) {
		return fs.readFileSync(filePath, 'utf8');
	}

	static isObject(value) {
		return value !== null && typeof value === 'object';
	}

	static isFunction(value) {
		return typeof value === 'function';
	}

	static isArray(value) {
		return value instanceof Array;
	}

	static isRegExp(value) {
		return value instanceof RegExp;
	}

	static extends(destination = {}, sources = [], deep = false) {

		for(let source of sources) {

			if(!this.isObject(source) && !this.isFunction(source))
				continue;

			let keys = Object.keys(source);

			for(let key of keys) {

				let value = source[key];

				if(deep && this.isObject(value) && !this.isRegExp(value)) {
					if(!this.isObject(destination[key]))
						destination[key] = this.isArray(value) ? [] : {};
					this.extends(destination[key], [value], true);
				}
				else
					destination[key] = value;
			}
		}

		return destination;
	}

}

module.exports = Utils;