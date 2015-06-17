/*Loader requiring*/

var {FileLoader, Solver} = require(`${__dirname}/loader`);

/*Utils requiring*/

var {storage} = require(`${__dirname}/../utils`);

/*Class definition*/

class Loader {

	static get(name) {
		return registry.get(name);
	}

	static load(...params) {
		let storage = params.length >= 2,
			path, name, content;

		if(storage) [name, path] = params;
		else [path] = params;
		content = Loader.load(path);

		registry.set(this.name, content);

		return content;
	}

	static define(name, value) {
		Solver.defineConstant(name, value);
	}

}

export default Loader;