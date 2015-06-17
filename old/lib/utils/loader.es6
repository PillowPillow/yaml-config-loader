var utils = require(`${__dirname}/utils`),
	env = require(`${__dirname}/environment`),
	path = require('path'),
	yaml = require('js-yaml'),
	debug = require('debug')('chikorita:config-loader:loader');

class Loader {

	static load(rawPath) {

		var filePath = env.resolveValue(rawPath),
			content = this.loadYaml(filePath) || {},
			contents = [content];

		if(Object.keys(content).length === 0)
			debug(`file ${filePath} loaded but empty`);
		else
			debug(`file ${filePath} loaded`);

		if(!!content.imports) {
			let directory = path.dirname(filePath);

			for(let imp of content.imports)
				if(!imp.if || env.test(imp.if))
					contents = contents.concat(this.load(path.join(directory, imp.source)));

			delete content.imports;
		}

		return contents;
	}

	static loadYaml(filePath) {
		var exists = utils.fileExists(filePath),
			content;

		if(exists)
			content = yaml.load(utils.loadFile(filePath));
		else
			throw Error(`fileNotFound: ${filePath}`);

		return content;
	}

}

module.exports = Loader;