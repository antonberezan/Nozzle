# Nozzle

A dependency injector for JavaScript.

# API

## Constructor

The constructor takes 1 optional argument - resolver. The argument is a function that resolves a dependency.

``` js
Nozzle( resolver? );
```

+ `resolver` - **Type:** _Function_, **Optional** - the function is invoked each time when the injector requires a dependency. The first argument is a name of the requiered dependency. The function must return the instance of thr requierd dependency.

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

## Methods

### bind( name )

The chaining method that defines a new binding with the specified name.

```js
injector.bind( name );
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
injector.bind( name ).to( instance );
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
```
+ `factory` <br />
Type: _Function_ <br />
The function of the factory which will be invoked on each request.
+ `result` <br />
Type: _Function_ <br />
The next part of the chain.

#### to( [ dependency1 [, dependency2] [, dependencyN], factory ] )

Associates the specified factory with the binding.

```js
injector.bind( 'name' ).to( [ 'dep1', 'dep2', 'depN', function( dep1, dep2, depN ) { return { ... }; } ] );
```

+ `dependency1` <br />
Type: _String_ <br />
The name of the dependency that will be injected to the `factory`. The each dependency should be defined in the current injector instance.
+ `factory` <br />
Type: _Function_ <br />
The function of the factory which will be invoked on each request.
+ `result` <br />
Type: _Function_ <br />
The next part of the chain.

#### singleton()

Associates the specified factory with the binding as singleton. That kind of the binding will be instantiated only once after the first request to it. This is the latest part of the chain.

```js
// define a new binding to a simple factory as singleton.
injector.bind( 'name' ).to( function() { return { ... }; } ).singleton();

// define a new binding to a factory with dependencies as singleton.
injector.bind( 'name' ).to( [ 'dep1', 'dep2', 'depN', function( dep1, dep2, depN ) { return { ... }; } ] );
```

### invoke( name )

Invokes the specified factory with required dependencies.

```js
injector.invoke( factory [, resolver] );
```

+ `name` <br />
Type: _String_ <br />
The name of the binding.
+ `result` <br />
Type: _Function_ <br />
The next method `to` from the chain.