const RG_PARAM = /\$\{([a-zA-Z0-0\_\-\.\$\@]+)\}/g

class Environment {

	static resolve(variable = '') {
		return process.env[variable];
	}

	static resolveAll(node = {}) {
		for(var prop in node)
			if(node[prop] instanceof Object)
				node[prop] = this.resolveAll(node[prop]);
			else
				node[prop] = this.formatsValue(node[prop]);

		return node;
	}

	static formatsValue(values = []) {

		if(!(values instanceof Array))
			values = [values];

		for(var value of values) {

			let matched;
			while(matched = RG_PARAM.exec(value)) {
				let [,envVar] = matched;
				value = this.resolve(envVar);

				if(value !== undefined)
					value = value.replace(`\${${envVar}}`, value);
			}

		}

		return value;
	}

	static test(conditions = {}) {

		var result = true;
		for(var key in conditions) {
			let resolvedKey = this.resolve(key),
				resolvedValue = this.formatsValue(conditions[key]);

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