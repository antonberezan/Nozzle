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

### bind

The chaining method that defines a new binding with a specified name.

##### Syntax

```js
injector.bind( name );
```

+ `name` - **Type:** _String_ - the name of the binding.
+ `Result` - **Type:** _Function_ - the result of the method is a next method `to` from the chain.

#### to

Associates the first argument of the method with the binding.

#### to( instance )

Takes an argument of the instance.

##### Syntax

```js
injector.bind( name ).to( instance );
```
