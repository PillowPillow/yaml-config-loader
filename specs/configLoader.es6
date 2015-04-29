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
		function() {
			expect(() => ConfigLoader.load(BAD_FILE_PATH)).toThrow();
		})

	it(`should loads the ${PARAMETER_FILE_PATH} file`,
		function() {
			var configContent = ConfigLoader.load(PARAMETER_FILE_PATH);
			expect(configContent).toBeNonEmptyObject();
		})

	it(`should load the ${CONFIG_FILE_PATH} file with its dependencies`,
		function() {

			var configContent = ConfigLoader.load(CONFIG_FILE_PATH),
				parameterContent = ConfigLoader.load(PARAMETER_FILE_PATH);

			console.log(configContent);

			expect(configContent).toBeNonEmptyObject();
			expect(configContent).toImplement(parameterContent);
			expect(configContent).toEqual(jasmine.objectContaining(parameterContent));

		})

	it(`should load the ${CONFIG_FILE_PATH} file without its dev dependencies`,
		function() {
			process.env[ENV.env] = 'prod';

			var configContent = ConfigLoader.load(CONFIG_FILE_PATH),
				devParameterContent = ConfigLoader.load(DEV_PARAMETER_FILE_PATH),
				parameterContent = ConfigLoader.load(PARAMETER_FILE_PATH);

			expect(configContent).toBeNonEmptyObject();
			expect(configContent).toImplement(parameterContent);

			expect(configContent).not.toEqual(jasmine.objectContaining(devParameterContent));
			expect(configContent).toEqual(jasmine.objectContaining(parameterContent));

			process.env[ENV.env] = '';

		})

	it(`should load the ${CONFIG_FILE_PATH} file with its dev dependencies`,
		function() {
			process.env[ENV.env] = 'dev';
			var	configContent = ConfigLoader.load(CONFIG_FILE_PATH),
				devParameterContent = ConfigLoader.load(DEV_PARAMETER_FILE_PATH),
				parameterContent = ConfigLoader.load(PARAMETER_FILE_PATH);

			expect(configContent).toBeNonEmptyObject();
			expect(configContent).toImplement(parameterContent);
			expect(configContent).toImplement(devParameterContent);
			expect(configContent).toEqual(jasmine.objectContaining(devParameterContent));

			process.env[ENV.env] = '';

		})

	it('should resolve environment variable',
		function() {
			process.env[ENV.password] = 'AwesomePassword';

			var configContent = ConfigLoader.load(PARAMETER_FILE_PATH)

			expect(configContent).toBeNonEmptyObject();
			expect(configContent).toHaveMember('credentials');
			expect(configContent.credentials).toEqual(jasmine.objectContaining({password:process.env[ENV.password]}));

			process.env[ENV.env] = '';

		})
})