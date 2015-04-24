var loader = require(`${__dirname}/utils/loader`),
	utils = require(`${__dirname}/utils/utils`),
	env = require(`${__dirname}/utils/environment`);

class configLoader {

	static load(path) {
		var contents = loader.load(path),
			merged = utils.extends({}, contents, true);

		return env.resolveAll(merged)
	}

}

module.exports = configLoader;