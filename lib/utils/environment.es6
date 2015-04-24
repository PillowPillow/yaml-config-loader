const RG_PARAM = /\$\{([a-zA-Z0-1\_\-\.\$\@]+)\}/g

class Environment {

	static resolve(variable = '') {
		return process.env[variable];
	}

	static resolveAll(node = {}) {
		for(var prop in node)
			if(node[prop] instanceof Object)
				node[prop] = this.resolveAll(node[prop]);
			else {
				let matched;
				while(matched = RG_PARAM.exec(node[prop])) {
					let [,envVar] = matched,
						value = this.resolve(envVar);

					if(value !== undefined)
						node[prop] = node[prop].replace(`\${${envVar}}`, value);
				}
			}

		return node;
	}

	static test(conditions = {}) {

		var result = true;
		for(var key in conditions) {
			let value = this.resolve(key);
			if(value === undefined
			|| (conditions[key] instanceof Array && !~conditions[key].indexOf(value))
			|| (!(conditions[key] instanceof Array) && value !== conditions[key])) {
				result = false;
				break;
			}
		}
		return result;
	}

}

module.exports = Environment;