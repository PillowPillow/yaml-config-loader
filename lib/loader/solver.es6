/*Services requiring*/

var path = require('path');

/*UTils requiring*/

var {storage} = require(`${__dirname}/../utils`);

var constants = {
	'APP_PATH': path.normalize(path.dirname(require.main.filename))
};

const VAR_REGEXP = /\$\{((const|local|config|env)(?::([\w\_\-\.\$\@]+))?(?::([\w\_\-\.\$\@]+)))\}/g;
const LOCAL_VAR_REGEXP = /\$\{((local)(?::([\w\_\-\.\$\@]+))?(?::([\w\_\-\.\$\@]+)))\}/g;

export default class Solver {

	static _getValueFromSource(variable = '', source = {}) {

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

	static _resolveEnvParts(parts = {}) {
		var nbSolved = 0,
			isThereSomethingToResolve = false,
			partsName = Object.keys(parts || {});

		for(let name of partsName) {
			let value = process.env[name] || undefined;
			if(!parts[name].solved) {
				isThereSomethingToResolve = true;
				for(let occurrence of parts[name]) {
					occurrence.node[occurrence['property']] = value;
					parts[name].solved = true;
					nbSolved++;
				}
			}
		}
		return {nbSolved, isThereSomethingToResolve};
	}

	static _resolveConfigParts(parts = {}) {
		var nbSolved = 0,
			isThereSomethingToResolve = false,
			partsName = Object.keys(parts || {});

		for(let name of partsName) {
			let {label, part} = parts[name][0];
			let config = storage.get(label);
			let value = this._getValueFromSource(part, config) || undefined;
			if(!parts[name].solved) {
				isThereSomethingToResolve = true;
				for(let occurrence of parts[name]) {
					occurrence.node[occurrence['property']] = value;
					parts[name].solved = true;
					nbSolved++;
				}
			}
		}
		return {nbSolved, isThereSomethingToResolve};
	}

	static _resolveConstantParts(parts = {}) {
		var nbSolved = 0,
			isThereSomethingToResolve = false,
			partsName = Object.keys(parts || {});

		for(let name of partsName) {
			let value = constants[name] || undefined;
			if(!parts[name].solved) {
				isThereSomethingToResolve = true;
				for(let occurrence of parts[name]) {
					occurrence.node[occurrence['property']] = value;
					parts[name].solved = true;
					nbSolved++;
				}
			}
		}
		return {nbSolved, isThereSomethingToResolve};
	}

	static _resolveLocalParts(parts = {}, source = {}) {
		var nbSolved = 0,
			isThereSomethingToResolve = false,
			partsName = Object.keys(parts || {});

		for(let name of partsName) {
			let value = this._getValueFromSource(name, source) || undefined;
			if(!parts[name].solved) {
				isThereSomethingToResolve = true;
				if(!String(value).match(LOCAL_VAR_REGEXP)) {
					for(let occurrence of parts[name]) {
						occurrence.node[occurrence['property']] = value;
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
				let resume = {};
				switch(type) {
					case 'const':
						resume = this._resolveConstantParts(parts[type]);
						break;
					case 'local':
						resume = this._resolveLocalParts(parts[type], source);
						break;
					case 'config':
						resume = this._resolveConfigParts(parts[type]);
						break;
					case 'env':
						resume = this._resolveEnvParts(parts[type]);
						break;
				}
				let {nbSolved, isThereSomethingToResolve} = resume;
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
		if(name !== 'APP_PATH' && name in constants)
			throw Error('constant already defined');
		constants[name] = value;
	}

	static getConstant(name) {
		return constants[name];
	}

	static clearConstants() {
		constants = {
			'APP_PATH': path.normalize(path.dirname(require.main.filename))
		};
	}

	static execCondition(conditions = {}) {
		var result = true;
		for(var key in conditions) {
			let keyValue = process.env[key] || undefined;
			if(keyValue === undefined
			|| (conditions[key] instanceof Array && !~conditions[key].indexOf(keyValue))
			|| (!(conditions[key] instanceof Array) && keyValue !== conditions[key])) {
				result = false;
				break;
			}
		}
		return result;
	}

}