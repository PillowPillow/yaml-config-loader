var utils = require(`${__dirname}/utils`),
	env = require(`${__dirname}/environment`),
	path = require('path'),
	yaml = require('js-yaml');

class Loader {

	static load(filePath) {
		return this.loadYaml(filePath)
			.then((content) => {
				var promise = Promise.resolve([]);

				if(!!content.imports) {
					let directory = path.dirname(filePath),
					promises = [];
					for(let imp of content.imports)
						if(!imp.if || env.test(imp.if))
							promises.push(this.load(path.join(directory, imp.source)));

					delete content.imports;
					promise = Promise.all(promises);
				}

				return promise
					.then((results) => {
						var contents = [content];
						for(var result of results)
							contents = contents.concat(result);
						return contents;
					});
			});

	}

	static loadYaml(filePath) {
		return utils.fileExists(filePath)
			.then(() => utils.loadFile(filePath))
			.then((content) => yaml.load(content));
	}

}

module.exports = Loader;