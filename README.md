# YAML config loader
Yaml config loader for node js
=======================

### Installation
------------

`npm install yaml-config-loader`  

````javascript
var loader = require('yaml-config-loader');
````

### Yaml Api Reference
------------

### *Syntaxes*

###`${env:ENVIRONMENT_VARIABLE}`
> retrieves the value of an environment variable

#### Usage:
````javascript
process.env.foobar = 'foobar_value';
````
**file.yaml**
````yaml
foo:
	bar: '${env:foobar}'
````
**loaded configuration (json)**
````json
{
	"foo": {
		"bar": "foobar_value"
	}
}
````

###`${const:CONSTANT_VARIABLE}`
> retrieves the value of a defined constant  
> by default only one constant is available: APP_PATH  
> it corresponds to the entry point of your application  
> it's the only constant which you can override  

#### Usage:
````javascript
var loader = require('yaml-config-loader');
loader.define('foobar','foobar_value');
````
**file.yaml**
````yaml
foobar: ${const:APP_PATH}
foo:
	bar: '${const:foobar}'
````
**loaded configuration (json)**
````json
{
	"foobar": "foo/bar/app.js"
	"foo": {
		"bar": "foobar_value"
	}
}
````

###`${local:LOCAL_VARIABLE}`
> retrieves the value of a property in the current configuration

#### Usage
**file.yaml**
````yaml
foo:
	foobar : 'foobar_value'
	bar: '${local:foo.foobar}'
````
**loaded configuration (json)**
````json
{
	"foo": {
		"foobar": ": "foobar_value"
		"bar": "foobar_value"
	}
}
````

###`${config:CONFIGURATION_VARIABLE}`
> retrieves the value of a defined configuration  

#### Usage:
````javascript
var loader = require('yaml-config-loader');
loader.load('foobar_conf', 'xxx/xxx.yaml')
````
**xxx.yaml**
````yaml
foo:
	bar: 'bar'
````
**file.yaml**
````yaml
foo:
	bar: '${config:foo.bar}'
````
**loaded configuration (json)**
````json
{
	"foo": {
		"bar": 'bar'
	}
}
````

### *Configuration imports*
> `Yaml-config-loader` provides an importing system  
> You simply need to add an *import* statement and add some files to import  
> each files are described by two properties  
> - source: String. file path
> - if: *(Optional)* Object. conditions **{ environement_variable : 'value to check' }**

````yaml
imports:
    - { source: 'dev/config.yml', if: { envname: 'dev' } }
````

#### Usage:
````yaml
imports:
    - { source: 'dev/config.yml', if: { envname: 'dev' } }

foo: 'bar'
````


All syntaxes of [js-yaml](https://github.com/nodeca/js-yaml) are available

### API Reference
------------

Here is the full list of accessible methods:

## Methods

###`load( [name,] path )`
> load and parse a yaml file

#### Params:
 - **name**: *(Optional)* String. configuration name.
 if set, the configuration will be saved.
 - **path**: String. file path

#### Returns:
 - Object. Configuration content

###`get( name )`
> retrieve a loaded configuration

#### Params:
 - **name**: String. configuration name.

#### Returns:
 - Object. Configuration content

###`define( name, value )`
> define a new constant, it will be used during the configuration parsing

#### Params:
 - **name**: String. constant name.
 - **value**: Mixed. value.

###`clear( )`
> clear the loaded configuration and the defined constants

---

### Modify and build
--------------------

`npm install`

Build command: `grunt es6`
It will create js files from the es6 sources.

Unit tests: `grunt unit`

