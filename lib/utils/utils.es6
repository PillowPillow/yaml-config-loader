/*Services requiring*/

var fs = require('fs');

export default class Utils {

	static fileExists(filePath) {
		let witness = true;
		try{fs.statSync(filePath);}
		catch(error) {witness = false;}
		return witness;
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

	static merge(destination = {}, ...sources) {
		return Utils.extend(desination, sources, true);
	}

	static extend(destination = {}, sources = [], deep = false) {

		for(let source of sources) {

			if(!Utils.isObject(source) && !Utils.isFunction(source))
				continue;

			let keys = Object.keys(source);

			for(let key of keys) {

				let value = source[key];

				if(deep && Utils.isObject(value) && !Utils.isRegExp(value)) {
					if(!Utils.isObject(destination[key]))
						destination[key] = Utils.isArray(value) ? [] : {};
					Utils.extend(destination[key], [value], true);
				}
				else
					destination[key] = value;
			}
		}

		return destination;
	}
}
