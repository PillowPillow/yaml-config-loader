/*Loader requiring*/

var {FileLoader, Solver} = require(`./loader`);
var path = require('path');

/*Utils requiring*/

var {storage, utils, stack} = require(`./utils`);

/*Class definition*/

class Loader {

	static get(name) {
		return storage.get(name);
	}

	static load(...params) {
		let saveContent = params.length >= 2,
			filepath, name, contents, content;

		if(saveContent) [name, filepath] = params;
		else [filepath] = params;

		try {
			if(filepath[0] == '.') {
				let site = stack()[2];
				if(site) filepath = path.join(path.dirname(site.getFileName()), filepath);
			}
		}
		catch(err) {
		}

		contents = FileLoader.load(filepath);

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

module.exports = Loader;