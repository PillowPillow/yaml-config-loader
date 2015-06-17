const LIB_PATH = `${__dirname}/../../`;
var chai = require('chai'),
	{expect} = chai;

describe('Solver', function() {
	var {Solver} = require(`${LIB_PATH}/lib/loader`),
		{storage} = require(`${LIB_PATH}/lib/utils`);

	it('should define and return a constant', function() {
		Solver.defineConstant('foo', 1);
		expect(Solver.getConstant('foo')).to.equal(1);
	})

	it('should throw an error if the constant is already defined', function() {
		expect(() => Solver.defineConstant('foo', 2)).to.throw(Error)
	})

	it('should extract the dynamic variable from the given json object', function() {
		var model = {'foo': {'foo': '${local:test}'}},
			parts = Solver.extractDynamicParts(model);
		expect(parts).to.deep.equal({
			'local': {
				'test': [{
					'node': model.foo,
					'property': 'foo',
					'fullname': 'local:test',
					'namespace': 'local',
					'label': undefined,
					'part': 'test'
				}]
			}
		})
	})

	it('should extract the dynamic parts from the given json object', function() {
		var model = {
				'foo': {'foo': '${local:test}${local:test}'},
				'barbar': 'bar${config:name:bar}',
				'foobar': 'bar${local:bar}'
			},
			parts = Solver.extractDynamicParts(model);
		expect(parts).to.deep.equal({
			'local':  {
				'test': [
					{'node': model.foo, 'property': 'foo', 'namespace': 'local', 'fullname': 'local:test', 'label': undefined, 'part': 'test'},
					{'node': model.foo, 'property': 'foo', 'namespace': 'local', 'fullname': 'local:test', 'label': undefined, 'part': 'test'}
				],
				'bar': [
					{'node': model, 'property': 'foobar', 'namespace': 'local', 'fullname': 'local:bar', 'label': undefined, 'part': 'bar'}
				]
			},
			'config': {
				'name:bar': [
					{'node': model, 'property': 'barbar', 'namespace': 'config', 'fullname': 'config:name:bar', 'label': 'name', 'part': 'bar'}
				]
			}
		})
	})

	it('should extract the value from the given source', function() {
		var source = {
			'foo': {
				'bar': 3
			}
		},
		value = Solver._getValueFromSource('foo.bar', source);
		expect(value).to.equal(3);
	})

	it('should resolve local parts', function() {
		var model = {'foo': 3,'bar': '${local:foo}'},
			parts = Solver.extractDynamicParts(model);
		Solver.resolve(parts, model);

		expect(model).to.deep.equal({'foo': 3,'bar': 3})
	})

	it('should resolve more complicated local parts', function() {
		var model = {
				'foo': 3,
				'foobar': '${local:barfoo.foo.bar}',
				'bar': '${local:foo}',
				'barfoo': {
					'foo': {
						'bar': '${local:bar}'
					}
				}
			},
			parts = Solver.extractDynamicParts(model);
		Solver.resolve(parts, model);

		expect(model).to.deep.equal({
			'foo': 3,
			'foobar': 3,
			'bar': 3,
			'barfoo': {'foo': {'bar': 3}}
		})
	})

	it('should resolve const part', function() {
		Solver.defineConstant('FOO','foo')
		var model = {'bar': '${const:FOO}'},
			parts = Solver.extractDynamicParts(model);
		Solver.resolve(parts, model);

		expect(model).to.deep.equal({'bar': 'foo'})
	})

	it('should resolve config part', function() {
		storage.set('FooBar', {'foo': 3});
		var model = {'bar': '${config:FooBar:foo}'},
			parts = Solver.extractDynamicParts(model);
		Solver.resolve(parts, model);

		expect(model).to.deep.equal({'bar': 3})
	})

	it('should avoid circular dependencies', function() {
		var model = {
				'foo': '${local:bar}',
				'foobar': '${local:barfoo.foo.bar}',
				'bar': '${local:foo}',
				'barfoo': {
					'foo': {
						'bar': '${local:bar}'
					}
				}
			},
			parts = Solver.extractDynamicParts(model);
		expect(() => Solver.resolve(parts, model)).to.throw(Error);
	})

});