/*UTils requiring*/

var {storage} = require(`${__dirname}/../utils`);

var constants = {
	'APP_PATH': __dirname
};

const VAR_REGEXP = /\$\{((const|local|config)(?::([\w\_\-\.\$\@]+))?(?::([\w\_\-\.\$\@]+)))\}/g;

export default class Solver {

	static getValueFromSource(variable = '', source = {}) {

		var value = source,
			parts = variable.split('.');

		for(var i = 0; i<parts.length; i++)
			if(value instanceof Object)
				value = value[parts[i]];
			else {
				value = undefined;
				break;
			}

		return value;
	}

	static _resolveLocalParts(parts = {}, source = {}) {
		var nbSolved = 0,
			isThereSomethingToResolve = false,
			partsName = Object.keys(parts || {});

		for(let name of partsName) {
			let value = this.getValueFromSource(name, source);
			if(!parts[name].solved) {
				isThereSomethingToResolve = true;
				if(!String(value).match(VAR_REGEXP)) {
					for(let occurence of parts[name]) {
						occurence.node[occurence['property']] = value;
						parts[name].solved = true;
						nbSolved++;
					}
				}
			}
		}
		return {nbSolved, isThereSomethingToResolve};
	}

	static resolve(parts = {}, source = {}) {

		for(let type of ['const','config','env','local'])
		if(type in parts && parts[type] instanceof Object) {
			let turnWithZeroResolve = 0;
			while(turnWithZeroResolve < 2) {

				switch(type) {
					case 'const':break;
					case 'local':
						let {nbSolved, isThereSomethingToResolve} = this._resolveLocalParts(parts[type], source);
						break;
					case 'config':break;
					case 'env':break;
				}

				if(nbSolved <= 0)
					turnWithZeroResolve++;
				if(turnWithZeroResolve >= 2 && isThereSomethingToResolve === true)
					throw Error('unable to load the given config, possible circular dependencies');

				nbSolved = 0;
			}

		}

	}

	static extractDynamicParts(node = {}, parts = {}) {

		for(var property in node)
			if(node.hasOwnProperty(property)) {
				if(node[property] instanceof Object) this.extractDynamicParts(node[property], parts);
				else {
					let matched;
					while(matched = VAR_REGEXP.exec(node[property])) {
						let [,fullname,namespace, label, part] = matched;
						let key = label !== undefined ? `${label}:${part}` : part;

						if(parts[namespace] === undefined)
							parts[namespace] = {};

						if(parts[namespace][key] === undefined)
							parts[namespace][key] = [];

						parts[namespace][key].push({node,property,fullname,namespace,label,part});
					}
				}
			}

		return parts;
	}

	static defineConstant(name, value) {
		if(name in constants)
			throw Error('constant already defined');
		constants[name] = value;
	}

	static getConstant(name) {
		return constants[name];
	}

}