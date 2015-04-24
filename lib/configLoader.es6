var loader = require(`${__dirname}/utils/loader`),
	utils = require(`${__dirname}/utils/utils`),
	env = require(`${__dirname}/utils/environment`);

class configLoader {

	static load(path) {
		return loader.load(path)
			.then((contents) => utils.extends({}, contents, true))
			.then((merged) => env.resolveAll(merged));
	}

}

module.exports = configLoader;