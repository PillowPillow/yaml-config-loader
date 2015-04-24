require('jasmine-expect');
var ConfigLoader = require(`${__dirname}/../core`);

const CONFIG_FILE_PATH = `${__dirname}/files/config.yml`;
const DEV_PARAMETER_FILE_PATH = `${__dirname}/files/dev/parameters.yml`;
const PARAMETER_FILE_PATH = `${__dirname}/files/parameters.yml`;
const BAD_FILE_PATH = `${__dirname}/files/undefined.yml`;
const ENV = {
	password: 'ChikoritaTestPassword',
	env: 'TestEnv'
};

describe('ConfigLoader', function() {

	it(`should'nt loads the ${BAD_FILE_PATH} file`,
		function(done) {

			ConfigLoader.load(BAD_FILE_PATH)
				.then(resolve)
				.catch(() => {})
				.then(() => done());

			function resolve(object) {
				expect(object).toBeUndefined();
			}
		})

	it(`should loads the ${PARAMETER_FILE_PATH} file`,
		function(done) {

			ConfigLoader.load(PARAMETER_FILE_PATH)
				.then(resolve)
				.catch(reject)
				.then(() => done());

			function resolve(object) {
				expect(object).toBeNonEmptyObject();
			}

			function reject(error) {
				expect(error).toBeUndefined();
			}

		})

	it(`should load the ${CONFIG_FILE_PATH} file with its dependencies`,
		function(done) {

			Promise.all([
				ConfigLoader.load(CONFIG_FILE_PATH),
				ConfigLoader.load(PARAMETER_FILE_PATH)
			])
				.then(resolve)
				.catch(reject)
				.then(() => done());

			function resolve(objects) {
				expect(objects).toBeArrayOfSize(2);
				var [configContent, parameterContent] = objects;
				expect(configContent).toBeNonEmptyObject();
				expect(configContent).toImplement(parameterContent);
				expect(configContent).toEqual(jasmine.objectContaining(parameterContent));
			}

			function reject(error) {
				expect(error).toBeUndefined();
			}

		})

	it(`should load the ${CONFIG_FILE_PATH} file without its dev dependencies`,
		function(done) {
			process.env[ENV.env] = 'prod';
			Promise.all([
				ConfigLoader.load(CONFIG_FILE_PATH),
				ConfigLoader.load(DEV_PARAMETER_FILE_PATH),
				ConfigLoader.load(PARAMETER_FILE_PATH)
			])
				.then(resolve)
				.catch(reject)
				.then(() => {
					process.env[ENV.env] = '';
					done();
				});

			function resolve(objects) {
				expect(objects).toBeArrayOfSize(3);

				var [configContent, devParameterContent,parameterContent] = objects;
				expect(configContent).toBeNonEmptyObject();
				expect(configContent).toImplement(parameterContent);

				expect(configContent).not.toEqual(jasmine.objectContaining(devParameterContent));
				expect(configContent).toEqual(jasmine.objectContaining(parameterContent));
			}

			function reject(error) {
				expect(error).toBeUndefined();
			}

		})

	it(`should load the ${CONFIG_FILE_PATH} file with its dev dependencies`,
		function(done) {
			process.env[ENV.env] = 'dev';
			Promise.all([
				ConfigLoader.load(CONFIG_FILE_PATH),
				ConfigLoader.load(DEV_PARAMETER_FILE_PATH),
				ConfigLoader.load(PARAMETER_FILE_PATH)
			])
				.then(resolve)
				.catch(reject)
				.then(() => {
					process.env[ENV.env] = '';
					done();
				});

			function resolve(objects) {
				expect(objects).toBeArrayOfSize(3);

				var [configContent, devParameterContent,parameterContent] = objects;
				expect(configContent).toBeNonEmptyObject();
				expect(configContent).toImplement(parameterContent);
				expect(configContent).toImplement(devParameterContent);

				expect(configContent).toEqual(jasmine.objectContaining(devParameterContent));
			}

			function reject(error) {
				expect(error).toBeUndefined();
			}

		})

	it('should resolve environment variable',
		function(done) {
			process.env[ENV.password] = 'AwesomePassword';

			ConfigLoader.load(PARAMETER_FILE_PATH)
				.then(resolve)
				.catch(reject)
				.then(() => {
					process.env[ENV.env] = '';
					done();
				});

			function resolve(object) {
				expect(object).toBeNonEmptyObject();
				expect(object).toHaveMember('credentials');
				expect(object.credentials).toEqual(jasmine.objectContaining({password:process.env[ENV.password]}));
			}

			function reject(error) {
				expect(error).toBeUndefined();
			}

		})
})