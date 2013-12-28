# Nozzle

A dependency injector for JavaScript.

# API

## Constructor

The constructor takes 1 optional argument - resolver. The argument is a function that resolves a dependency.

``` js
Nozzle( resolver? );
```

+ `resolver` <br />
Type: _Function_ <br />
The function is invoked each time when the injector requires a dependency. The first argument is a name of the requiered dependency. The function must return the instance of thr requierd dependency.

## Initialization

If you are using the asynchronous module definition (AMD), Nozzle automatically defines a new AMD module, otherwise defines a global variable.

### Usage with AMD

``` js
define( ['Nozzle'], function( Nozzle ) {
	var injector = new Nozzle();
} );
```

### Simple Usage

``` js
(function () {
	var injector = new Nozzle();
}());
```

## Types

### Factory

There are two types of factories: just a function and an array with dependency names and with a function that must be a latest item in the array.

```js
var simpleFactory = function() {
	return { ... }
};

var dependentFactory = [ 'dep1', 'dep2', 'depN', function( dep1, dep2, depN ) { ... } ];
```

## Methods

### bind( name )

The chaining method that defines a new binding with the specified name.

```js
injector.bind( 'name' );
```

+ `name` <br />
Type: _String_ <br />
The name of the binding.
+ `result` <br />
Type: _Function_ <br />
The next method `to` from the chain.

#### to( instance )

Associates the specified instance with the binding. Any type will be treated as singleton except Function type.

```js
injector.bind( 'name' ).to( instance );
```
+ `instance` <br />
Type: _Any Type except Function_ <br />
The instance of the object for the binding.
+ `result` <br />
Type: _Function_ <br />
The next part of the chain.

#### to( factory )

Associates the specified factory with the binding.

```js
injector.bind( 'name' ).to( function() { return { ... }; } );
injector.bind( 'name' ).to( [ 'dep1', 'depN', function( dep1, dep2, depN ) { return { ... }; } ] );
```

+ `factory` <br />
Type: _[Factory](#factory)_ <br />
The function of the factory which will be invoked on each request.
+ `result` <br />
Type: _Function_ <br />
The next part of the chain.

#### to( [ dependency1 [, dependencyN], factory ] )

Associates the specified factory with the binding.

```js
injector.bind( 'name' ).to( [ 'dep1', 'depN', function( dep1, dep2, depN ) { return { ... }; } ] );
```

+ `dependency1, dependencyN ...` <br />
Type: _String_ <br />
The name of the dependency that will be injected to the `factory`. The dependency should be defined in the current injector instance.
+ `factory` <br />
Type: _Function_ <br />
The function of the factory which will be invoked on each request.
+ `result` <br />
Type: _Function_ <br />
The next part of the chain.

#### singleton()

Associates the specified factory with the binding as singleton. That kind of binding is instantiated only once when it will be requested for first time. This is the latest part of the chain.

**Example:** _Define a new binding to the existing object as sigleton._

```js
injector.bind( 'name' ).to( { ... } ).singleton();
```

**Example:** _Define a new binding to the factory with dependencies as sigleton._

```js
// define a new binding to a factory with dependencies.
injector.bind( 'name' ).to( [ 'dep1', 'depN', function( dep1, depN ) { return { ... }; } ] ).singleton();
```

### get( name )

Returns the required binding by the specified name.

```js
injector.get( 'name' );
```

+ `name` <br />
Type: _String_ <br />
The binding name.
+ `result` <br />
An instance of the required binding.

**Example:**

```js
injector.bind( 'appInfo' ).to( function() {
	return {
		appName: 'MyApp',
		version: '1.0.3'
	};
} );

var appInfo = injector.get( 'appInfo' );
```

### get( names )

Returns the required bindings by the specified array of names.

```js
injector.get( [ 'name1', 'name2', 'nameN' ] );
```

+ `names` <br />
Type: _Array_ <br />
The array of the binding names.
+ `result` <br />
Type: _Array_ <br />
An array of the instances.

**Example:**

```js
injector.bind( 'cat' ).to( function() { ... } );
injector.bind( 'dog' ).to( function() { ... } );

var animals = injector.get( [ 'cat', 'dog' ] );
```

### invoke( factory )

Invokes the specified factory with required dependencies.

```js
injector.invoke( factory );
```

+ `factory` <br />
Type: _Factory_ <br />
The factory object.
+ `result` <br />
Returns the result of the factory function.

**Example:** 

```js
injector.invoke( [ 'dep1', 'depN', function( dep1, depN ) { return { ... }; } ] );
```

### invoke( factory, resolver )

Invokes the specified factory with required dependencies and custom resolver.

```js
injector.invoke( factory, function( name ) { ... } );
```

+ `factory` <br />
Type: _Factory_ <br />
The factory object.
+ `resolver` <br />
Type: _Function_ <br />
The function that takes one argument - the name of the required dependency. The result must be an instance of the required dependency.
+ `result` <br />
Returns the result of the factory function.

**Example:**

```js
// container of the internal dependencies
var animals = {
	// ...
};

// the resolve function
var getAnimal = function( name ) {
	return animals[ name ];
};

// invokes the factory with the custom resolver
injector.invoke( [ 'cat', 'dog', function( cat, dog ) { return { ... }; } ], resolve );
```

### instantiate

Defines a new binding and immediately instantiates it by the specified name and factory.

```js
injector.instantiate( 'name', factory );
```

+ `name` <br />
Type: String_ <br />
The binding name.
+ `factory` <br />
Type: _Factory_ <br />
The factory object.
+ `result` <br />
An instance of the specified binding.

**Example:**

```js
var appInfo = injector.instantiate( 'appInfo', function() {
	return {
		appName: 'MyApp',
		version: '1.0.3'
	};
} );
```

### remove( name )

Removes a binding by the specified name.

```js
injector.remove( 'name' );
```

+ `name` <br />
Type: _String_ <br />
The name of the removed binding.

### remove( names )

Removes bindings by the specified array of names.

```js
injector.remove( [ 'name1', 'name2', 'nameN' ] );
```

+ `names` <br />
Type: _Array_ <br />
The array of names of the removed bindings.

### clear

Removes all defined bindings.

```js
injector.clear();
```