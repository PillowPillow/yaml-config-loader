/*Services requiring*/

var sregistry = require('symbol-registry');

/*Class definition*/

export default new class Storage {

	constructor() {
		Object.defineProperty(this, '_storage', {
			value: {},
			writable: true,
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

	clear() {
		sregistry.erase();
		this._storage = {};
	}

}