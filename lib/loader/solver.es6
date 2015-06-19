/*Services requiring*/

var path = require('path');

/*UTils requiring*/

var {storage} = require(`${__dirname}/../utils`);

var constants = {
	'APP_PATH': path.normalize(path.dirname(require.main.filename))
};

const VAR_REGEXP = /\$\{((const|local|config|env)(?::([\w\_\-\.\$\@]+))?(?::([\w\_\-\.\$\@]+)(?:\|([\'\"\w\_\-\.\$\@]+))?))\}/g;
const LOCAL_VAR_REGEXP = /\$\{((local)(?::([\w\_\-\.\$\@]+))?(?::(.+)))\}/g;

export default class Solver {

	static _formatImport(imports = {}) {
		imports.forEach((imp) => {
			if('if' in imp) {
				imp['parsedIf'] = [];
				let keys = Object.keys(imp.if);
				for(let key of keys) {
					imp['parsedIf'].push({
						'key': key,
						'value': imp.if[key]
					});
				}
			}
		})
	}

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

	static _getConstValue(name) {
		return constants[name];
	}
	static _getLocalValue(name, source) {
		return this._getValueFromSource(name, source)
	}
	static _getConfigValue(name, parts) {
		let {label, part} = parts[name][0];
		let config = storage.get(label);
		return this._getValueFromSource(part, config);
	}
	static _getEnvValue(name) {
		return process.env[name];
	}

	static _resolveParts(partType, parts, ...params) {
		var nbSolved = 0,
			isThereSomethingToResolve = false,
			partsName = Object.keys(parts || {});

		for(let name of partsName) {
			let value;
			switch(partType) {
				case 'const': value = this._getConstValue(name); break;
				case 'local': value = this._getLocalValue(name, ...params); break;
				case 'config': value = this._getConfigValue(name, parts); break;
				case 'env': value = this._getEnvValue(name); break;
			}
			let type = typeof value;

			if(!parts[name].solved) {
				isThereSomethingToResolve = true;
				if(partType !== 'local' ||  !String(value).match(LOCAL_VAR_REGEXP)) {
					for(let occurrence of parts[name]) {
						if(!value) type = typeof occurrence['defaultval'];
						let newVal =  occurrence.node[occurrence['property']].replace(`\${${occurrence['fullname']}}`, value || occurrence['defaultval']);
						occurrence.node[occurrence['property']] = type == 'number' ? Number(newVal) : newVal;
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
				let resume = this._resolveParts(type, parts[type], source);
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
						let [,fullname,namespace, label, part, defaultval] = matched;
						let key = label !== undefined ? `${label}:${part}` : part;
						defaultval = defaultval || '';
						if(defaultval !== '') {
							if(!!defaultval.match(/^(['"])(.*)(\1)$/))
								defaultval = defaultval.replace(/^(['"])(.*)(\1)$/, '$2');
							else if(!isNaN(defaultval))
								defaultval = Number(defaultval);
						}

						if(parts[namespace] === undefined)
							parts[namespace] = {};

						if(parts[namespace][key] === undefined)
							parts[namespace][key] = [];

						parts[namespace][key].push({node,property,fullname,namespace,label,part,defaultval});
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
		for(var condition of conditions)
			if((!(condition['value'] instanceof Array) && condition['key'] !== condition['value'])
			|| (!!(condition['value'] instanceof Array) && !~condition['value'].indexOf(condition['key']))){
				result = false;
				break;
			}
		return result;
	}



}