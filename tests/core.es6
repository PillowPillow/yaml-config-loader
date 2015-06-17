const LIB_PATH = `${__dirname}/../`,
	SANDBOX_PATH = `${__dirname}/sandbox/`;
var chai = require('chai'),
	{expect} = chai;

describe('Core', function() {
	var Loader = require(`${LIB_PATH}/lib`),
		{storage} = require(`${LIB_PATH}/lib/utils`);

	it('should load the yaml file', function() {
		var config = Loader.load(`${SANDBOX_PATH}/config.yml`);
		expect(config).to.deep.equal({
			'foo': {'bar': 3, 'foobar': 3},
			'barfoo': {
				'foo': {
					'bar': undefined,
					'fooo': undefined,
					'barbar': undefined
				}
			}
		})
	})

	it('should load the yaml file and resolve the constants', function() {
		Loader.define('foobarconst','foo')
		var config = Loader.load(`${SANDBOX_PATH}/config.yml`);
		expect(config).to.deep.equal({
			'foo': {'bar': 3, 'foobar': 3},
			'barfoo': {
				'foo': {
					'bar': undefined,
					'fooo': undefined,
					'barbar': 'foo'
				}
			}
		})
	})

	it('should load the yaml file and resolve the config variables', function() {
		storage.set('name', {'bar':{'foo': 6}});
		var config = Loader.load(`${SANDBOX_PATH}/config.yml`);
		expect(config).to.deep.equal({
			'foo': {'bar': 3, 'foobar': 3},
			'barfoo': {
				'foo': {
					'bar': 6,
					'fooo': undefined,
					'barbar': 'foo'
				}
			}
		})
	})

	it('should load the yaml file and resolve the env variables', function() {
		process.env.envname = 'foobar';
		var config = Loader.load(`${SANDBOX_PATH}/config.yml`);
		expect(config).to.deep.equal({
			'foo': {'bar': 3, 'foobar': 3},
			'barfoo': {
				'foo': {
					'bar': 6,
					'fooo': 'foobar',
					'barbar': 'foo'
				}
			}
		})
	})

	it('should load the yaml file and its dependencies', function() {
		process.env.envname = 'dev';
		var config = Loader.load(`${SANDBOX_PATH}/config.yml`);
		expect(config).to.deep.equal({
			'foo': {'bar': 5, 'foobar': 5},
			'barfoo': {
				'foo': {
					'bar': 6,
					'fooo': 'dev',
					'barbar': 'foo'
				}
			}
		})
	})

	it('should store the configuration', function() {
		process.env.envname = 'dev';
		Loader.load('configuration', `${SANDBOX_PATH}/config.yml`);
		var config = Loader.get('configuration');
		expect(config).to.deep.equal({
			'foo': {'bar': 5, 'foobar': 5},
			'barfoo': {
				'foo': {
					'bar': 6,
					'fooo': 'dev',
					'barbar': 'foo'
				}
			}
		})
	})

	after(function() {
		delete process.env.envname;
		Loader.clear();
	})
});