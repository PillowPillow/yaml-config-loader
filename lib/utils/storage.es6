/*Services requiring*/

var sregistry = require('symbol-registry');

/*Class definition*/

export default new class Storage {

	constructor() {
		Object.defineProperty(this, '_storage', {
			value: {},
			writable: false,
			enumerable: false
		});
	}

	set(type, content) {
		let KEY = sregistry(type);
		this._storage[KEY] = content;
	}

	get(type) {
		let KEY = sregistry(type);
		return this._storage[KEY];
	}

}