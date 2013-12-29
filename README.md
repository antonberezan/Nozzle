# Nozzle

A dependency injector for JavaScript.

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

## Factory

There are two notations of factories: just a function and array. The array is a collection of the required bindings where the latest item in the array is a factory function. See the examples below.

```js
// a simple factory function without any dependency
var simpleFactory = function() {
	return { ... }
};
// a factory that require dependencies
var dependentFactory = [ 'dep1', 'dep2', 'depN', function( dep1, dep2, depN ) { ... } ];
```

## Methods

### bind( name )

Defines a new binding with the specified name.

```js
injector.bind( 'name' );
```

+ `name` <br />
Type: _String_ <br />
The name of the binding.
+ `result` <br />
Type: _[InjectorBinding](#injectorbinding)_ <br />
A new instance of the binding. See [InjectorBinding](#injectorbinding).

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
injector.bind( 'appInfo' ).provider( function() {
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
injector.bind( 'cat' ).type( Cat );
injector.bind( 'dog' ).type( Dog );

var animals = injector.get( [ 'cat', 'dog' ] );
```

### invoke( factory )

Invokes the specified factory with required dependencies.

```js
injector.invoke( factory );
```

+ `factory` <br />
Type: _[Factory](#factory)_ <br />
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
Type: _[Factory](#factory)_ <br />
The factory.
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

### instantiate( name, factory )

Defines a new binding and immediately instantiates it by the specified name and factory.

```js
injector.instantiate( 'name', factory );
```

+ `name` <br />
Type: _String_ <br />
The binding name.
+ `factory` <br />
Type: _[Factory](#factory)_ <br />
The factory.
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

### clear()

Removes all defined bindings.

```js
injector.clear();
```

# InjectorBinding

## Methods

### value( value )

Associates the specified value with the binding.

```js
injector.bind( 'foo' ).value( { bar: 'bar' } );
```
+ `value` <br />
Type: _Any Type_ <br />
The binding value.
+ `result` <br />
Type: _[InjectorBinding](#injectorbinding)_ <br />
The current binding.

### type( type )

Associates the specified type with the binding. The type is a function that will be instantiated by the 'new' keyword.

```js
injector.bind( 'MyType' ).value( MyType );
```

+ `type` <br />
Type: _Type_ <br />
The factory.
+ `result` <br />
Type: _[InjectorBinding](#injectorbinding)_ <br />
The current binding.

**Example:**

```js
var Camaro = function() {
	this.Make = 'Chevrolet';
	this.Model = 'Camaro';
};

injector.bind( 'car' ).type( Camaro );

var car  = injector.get( 'car' );
console.log( car.Make, car.Model ); // Chevrolet Camaro
```

### provider( factory )

Associates the specified provider with the binding.

```js
injector.bind( 'provider' ).value( myProvider );
```

+ `factory` <br />
Type: _[Factory](#factory)_ <br />
The factory.
+ `result` <br />
Type: _[InjectorBinding](#injectorbinding)_ <br />
The current binding.
**Example:**

```js
// define a new binding to a simple factory function.
injector.bind( 'foo' ).provider( function() { return { ... }; } );
// define a new binding to a factory function with dependencies.
injector.bind( 'bar' ).provider( [ 'foo', function( foo ) { return { ... }; } ] );
```

### singleton()

Set the current binding as sigleton. The kind of binding is instantiated only once when the binding will be required.

**Example:** _Define a new binding to the type as sigleton._

```js
injector.bind( 'car' ).type( Camaro ).singleton();
```

**Example:** _Define a new binding to the factory with dependencies as sigleton._

```js
// define a new binding to a factory with dependencies.
injector.bind( 'bar' ).provider( [ 'foo', function( foo ) { return { ... }; } ] ).singleton();
```

### resolve()

Instantiates and returns the associated value of the binding.

```js
binding.resolve();
```

+ `result` <br />
Type: _Object_ <br />
The value of the binding.

**Example:**

```js
var car = injector.bind( 'car' ).type( Camaro ).resolve();
```