/*Loader requiring*/

var {FileLoader, Solver} = require(`${__dirname}/loader`);

/*Utils requiring*/

var {storage, utils} = require(`${__dirname}/utils`);

/*Class definition*/

class Loader {

	static get(name) {
		return storage.get(name);
	}

	static load(...params) {
		let saveContent = params.length >= 2,
			path, name, contents, content;

		if(saveContent) [name, path] = params;
		else [path] = params;

		contents = FileLoader.load(path);

		content = utils.merge({}, ...contents);

		let parts = Solver.extractDynamicParts(content);
		Solver.resolve(parts, content);

		if(saveContent)
			storage.set(name, content);

		return content;
	}

	static define(name, value) {
		Solver.defineConstant(name, value);
	}

	static clear() {
		Solver.clearConstants();
		storage.clear();
	}

}

export default Loader;