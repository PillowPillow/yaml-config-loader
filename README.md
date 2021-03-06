# YAML configuration loader
###Yaml configuration loader for node js
=======================

### Installation
------------

`npm install yaml-configuration-loader`  

````javascript
var loader = require('yaml-configuration-loader');
````

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

### Yaml Api Reference
------------

### *Syntaxes*

###`${env:ENVIRONMENT_VARIABLE}`
> retrieves the value of an environment variable

#### Usage:
````javascript
process.env.foobar = 'foobar_value';
````
**file.yml**
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
var loader = require('yaml-configuration-loader');
loader.define('foobar','foobar_value');
````
**file.yml**
````yaml
foobar: ${const:APP_PATH}
foo:
	bar: '${const:foobar}'
````
**loaded configuration (json)**
````json
{
	"foobar": "foo/bar/app.js",
	"foo": {
		"bar": "foobar_value"
	}
}
````

###`${local:LOCAL_VARIABLE}`
> retrieves the value of a property from the current configuration

#### Usage
**file.yml**
````yaml
foo:
	foobar : 'foobar_value'
	bar: '${local:foo.foobar}'
````
**loaded configuration (json)**
````json
{
	"foo": {
		"foobar": "foobar_value",
		"bar": "foobar_value"
	}
}
````

###`${config:CONFIGURATION_NAME:CONFIGURATION_VARIABLE}`
> retrieves the value of a defined configuration  

#### Usage:
````javascript
var loader = require('yaml-configuration-loader');
loader.load('foobar_conf', 'xxx/xxx.yml')
````
**xxx.yml**
````yaml
foo:
	bar: 'bar'
````
**file.yml**
````yaml
foo:
	bar: '${config:foobar_conf:foo.bar}'
````
**loaded configuration (json)**
````json
{
	"foo": {
		"bar": "bar"
	}
}
````

-------------------

> you can also add a default value to your dynamic fields with the `pipe syntax`  
> by default the library will transform the given value into the most relevant type `${const:foo|12} => "foo": 12`, `${const:foo|bar} => "foo": "bar"`
> you can override this behaviour by adding quotes around the value, the parser will consider the value as a string. `${const:foo|'12'} => "foo": "12"`  

**source.yml**
````yaml
foo: '${const:foobar|\'hello\'}'
bar: '${const:foobar|"world"}'
foobar: '${env:foobar|"some \"string\""}'
barfoo: '${const:foobar|1337}'
barfoobar: '${config:foobar|"1024"}'
````
**loaded configuration (json)**
````json
{
	"foo": "hello",
	"bar": "world",
	"foobar": "some \"string\"",
	"barfoo": 1337,
	"barfoobar": "1024"
}
````
-------------------

### *Configuration imports*
> `Yaml-config-loader` provides an importing system  
> You simply need to add an *import* statement and add some files to import  
> each files are described by two properties  
> - source: String. file path
> - if: *(Optional)* Object. conditions **{ 'field (dynamic of not)' : 'value to check' }**  
> you can use all syntaxes above presented except the **${local:...}**


````yaml
imports:
    - { source: 'dev/config.yml', if: { '${env:envname}': 'dev' } }
````

#### Usage:
````yaml
imports:
    - { source: 'dev/config.yml', if: { '${env:envname}': 'dev' } }

foo: 'bar'
````

All syntaxes of [js-yaml](https://github.com/nodeca/js-yaml) are available

---

### Modify and build
--------------------

`npm install`

Build command: `grunt es6`
It will create js files from the es6 sources.

Unit tests: `grunt unit`

###Credits
-------------------

This library is based on the awesome [js-yaml](https://github.com/nodeca/js-yaml) parser.