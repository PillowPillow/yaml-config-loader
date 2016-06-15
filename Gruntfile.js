var paths = {},
	Path = require('path');

paths.base = Path.normalize(__dirname);

module.exports = gruntConfig;

function gruntConfig(grunt) {

	var Configuration = {};
	Configuration.package = grunt.file.readJSON('package.json');

	require('jit-grunt')(grunt, {
		'mocha': 'grunt-mocha-test'
	});
	require('time-grunt')(grunt);

	var pathOption = getPathOption();

	function getPathOption() {
		var pathOption = false;

		if(grunt.option('path')) {

			pathOption = {};
			pathOption.name = Path.normalize(grunt.option('path')).replace(paths.base, '').slice(1);
			pathOption.extension = Path.extname(grunt.option('path'));
		}

		return pathOption;
	}


	Configuration.mochaTest = {
		unit: {
			options: {
				reporter: 'spec',
				timeout: 5000
			},
			src: ['tests/index.js']
		}
	};

	grunt.initConfig(Configuration);
	grunt.registerTask('unit', ['mochaTest:unit']);
}