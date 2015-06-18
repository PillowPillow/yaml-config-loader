const LIB_PATH = `${__dirname}/../../`,
	SANDBOX_PATH = `${__dirname}/../sandbox/`;
var chai = require('chai'),
	{expect} = chai;

describe('FileLoader', function() {
	var {FileLoader} = require(`${LIB_PATH}/lib/loader`),
		{storage} = require(`${LIB_PATH}/lib/utils`);

	it('should load a yaml file', function() {
		var content = FileLoader.loadYaml(`${SANDBOX_PATH}/config.yml`),
			expectedContent = {
				'port': '${env:server_port|12}',
				'address': '${env:server_address|"0.0.0.0"}',
				'imports': [{'source': 'dev/config.yml', 'if': { '${env:envname}': 'dev' }}],
				'foo': {'bar': 3, 'foobar': '${local:foo.bar}'},
				'barfoo': {
					'foo': {
						'bar': '${config:name:bar.foo}',
						'fooo': '${env:envname}',
						'barbar': '${const:foobarconst}'
					}
				}
			};
		expect(content).to.deep.equal(expectedContent);
	})

	it('should load the yaml file and its dependencies', function() {
		process.env.envname = 'dev';
		var contents = FileLoader.load(`${SANDBOX_PATH}/config.yml`),
			expectedContents = [{
				'port': '${env:server_port|12}',
				'address': '${env:server_address|"0.0.0.0"}',
				'foo': {'bar': 3, 'foobar': '${local:foo.bar}'},
				'barfoo': {
					'foo': {
						'bar': '${config:name:bar.foo}',
						'fooo': '${env:envname}',
						'barbar': '${const:foobarconst}'
					}
				}
			},
			{'foo':{'bar':5}}];
		expect(contents).to.be.an.instanceOf(Array);
		expect(contents).to.have.length(2);
		expect(contents).to.deep.equal(expectedContents);
	})

	after(function() {
		delete process.env.envname;
	})

});