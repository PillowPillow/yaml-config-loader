/*Services requiring*/

var yaml = require('js-yaml'),
	path = require('path'),
	{utils} = require(`../utils`),
	Solver = require(`./solver`);

class FileLoader {

	static load(filepath) {
		var content = this.loadYaml(filepath) || {},
			contents = [content];

		if(content.imports !== undefined) {

			let directory = path.dirname(filepath);
			Solver._formatImport(content.imports);
			let parts = Solver.extractDynamicParts(content.imports);
			Solver.resolve(parts, content.imports);

			for(let imp of content.imports)
				if(!imp.parsedIf || Solver.execCondition(imp.parsedIf))
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
			throw Error(`file not found: ${filePath}`);

		return content;
	}
}

module.exports = FileLoader;