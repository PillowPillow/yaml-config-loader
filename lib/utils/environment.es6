var path = require('path');

const RG_PARAM = /\$\{([a-zA-Z0-0\_\-\.\$\@]+)\}/g;
const APP_PATH = path.normalize(path.dirname(require.main.filename));

class Environment {

	static resolve(variable = '') {
		var resolved = variable;

		switch(variable) {
			case '__appPath':
				resolved = APP_PATH;
				break;
			default:

				var value;
				if(!!variable.match(/global\..*/)) {
					var parts = variable.split('.');

					value = global;
					for(var i = 1; i<parts.length; i++)
						if(value instanceof Object)
							value = value[parts[i]];
						else {
							value = undefined;
							break;
						}
				}

				if(value === undefined)
					value = process.env[variable] || variable;

				resolved = value;
		}

		return resolved;
	}

	static resolveAll(node = {}) {
		for(var prop in node)
			if(node[prop] instanceof Object)
				node[prop] = this.resolveAll(node[prop]);
			else
				node[prop] = this.resolveValue(node[prop]);

		return node;
	}

	static resolveValue(values = []) {

		if(!(values instanceof Array))
			values = [values];

		for(var value of values) {

			let matched;
			while(matched = RG_PARAM.exec(value)) {
				let [,envVar] = matched,
					resolved = this.resolve(envVar);

				if(value !== undefined)
					value = value.replace(`\${${envVar}}`, resolved);
			}

		}

		return value;
	}

	static test(conditions = {}) {

		var result = true;
		for(var key in conditions) {
			let resolvedKey = this.resolve(key),
				resolvedValue = this.resolveValue(conditions[key]);

			if(resolvedKey === undefined
			|| (resolvedValue instanceof Array && !~resolvedValue.indexOf(resolvedKey))
			|| (!(resolvedValue instanceof Array) && resolvedKey !== resolvedValue)) {
				result = false;
				break;
			}
		}
		return result;
	}

}

module.exports = Environment;