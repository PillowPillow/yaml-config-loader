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

	static extend(destination = {}, sources = [], deep = false) {

		for(let source of sources) {

			if(!this.isObject(source) && !this.isFunction(source))
				continue;

			let keys = Object.keys(source);

			for(let key of keys) {

				let value = source[key];

				if(deep && this.isObject(value) && !this.isRegExp(value)) {
					if(!this.isObject(destination[key]))
						destination[key] = this.isArray(value) ? [] : {};
					this.extend(destination[key], [value], true);
				}
				else
					destination[key] = value;
			}
		}

		return destination;
	}
}
