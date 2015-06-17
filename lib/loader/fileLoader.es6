/*Services requiring*/

var yaml = require('js-yaml'),
	path = require('path'),
	{utils} = require(`${__dirname}/../utils`);

export default class FileLoader {

	static load(path) {

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