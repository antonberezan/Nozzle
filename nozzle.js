(function (window) {

    'use strict';

    // -------------------------- helpers -------------------------- //

    // checks whether the specified value is a function
    var isFunction = function (value) {
        return Object.prototype.toString.apply(value) === '[object Function]';
    };

    // checks whether the specified value is an array
    var isArray = function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    };

    // checks whether the specified value is a factory
    var isFactory = function (value) {
        if (isFunction(value)) {
            return true;
        }
        if (isArray(value)) {
            if (isFunction(value[value.length - 1]) && (value.length == 1 || (value.length > 1 && typeof value[0] === 'string'))) {
                return true;
            }
        }
        return false;
    };

    // invokes the specified factory
    var invokeFactory = function (factory, useNew, injector) {
        var ctor = factory,
            dependencies = [];

        if (isArray(ctor) && ctor.length >= 1) {
            dependencies = ctor.slice(0, ctor.length - 1);
            ctor = ctor[ctor.length - 1];
        }

        if (isFunction(ctor)) {
            var invoke = function () {
                if (useNew) {
                    console.log('Invoke the factory use new.');
                    return new ctor(arguments);
                } else {
                    return ctor.apply(undefined, arguments);
                }
            };
            return invoke.apply(undefined, injector.get(dependencies));
        }
    };

    // -------------------------- InjectorBinding -------------------------- //

    // represents the injector binding
    var InjectorBinding = function(injector, bindingName) {
        var binding = this;

        binding._injector = injector;
        binding.name = bindingName;

        return this;
    };

    // associates the binding with the specifed provider factory
    InjectorBinding.prototype.provider = function (factory) {
        var binding = this;

        if (!isFactory(factory)) {
            throw new Error('The binding factory is not a factory type.');
        }

        binding._provider = isFunction(factory) ? [factory] : factory;

        return this;
    };

    // associates the binding with the specifed value
    InjectorBinding.prototype.value = function (value) {
        var binding = this;

        if (value === undefined) {
            throw new Error('The binding value is required.');
        }

        binding._value = value;

        return this;
    };

    // associates the binding with the specifed type
    InjectorBinding.prototype.type = function (type) {
        if (type === undefined) {
            throw new Error('The binding type is required.');
        }
        if (this.hasOwnProperty('_instance')) {
            throw new Error('The binding \'' + this.name + '\' cannot be used as type.');
        }
        this._type = type;
        return this;
    };

    // sets indication that the binding is a singleton
    InjectorBinding.prototype.singleton = function () {
        this._isSngleton = true;
        return this;
    };

    // adds new dependencies to the binding
    InjectorBinding.prototype.inject = function (dependencies) {
        if (!this._provider) {
            throw new Error('The binding \'' + this.name + '\' is not a provoder.');
        }
        if (dependencies && dependencies.length && this.hasOwnProperty('_instance')) {
            throw new Error('The binding \'' + this.name + '\' is already initialized.');
        }
        var binding = this;

        dependencies = isArray(dependencies) ? dependencies : arguments;

        if (binding._provider && dependencies.length) {
            for (var i = 0; i < dependencies.length; i += 1) {
                binding._provider.splice(binding._provider.length - 1, 0, dependencies[i]);
            }
        }

        return this;
    };

    // returns an instance of the binding
    InjectorBinding.prototype.resolve = function () {
        var binding = this,
            instance = null;

        if (binding._instance) {
            return binding._instance;
        } else {
            if (binding._type) {
                instance = invokeFactory(binding._type, true, binding._injector);
            } else if (binding._provider) {
                instance = invokeFactory(binding._provider, false, binding._injector);
            } else if (binding._value) {
                instance = binding._value;
            }
            if (!instance) {
                throw new Error('The binding is not associated with any value.');
            }
            if (binding._isSngleton) {
                binding._instance = instance;
            }
            return instance;
        }
    };

    // -------------------------- Injector -------------------------- //

    // represents the injector
    var Nozzle = function (resolver) {
        var nozzle = this;

        nozzle._bindings = {};
        if (isFunction(resolver)) {
            nozzle._resolver = resolver;
        }
    };

    // resolves a dependency by the specified name
    Nozzle.prototype._resolve = function(name) {
        var nozzle = this,
            binding,
            instance;

        console.log('resolve binding:', name);

        if (isFunction(nozzle._resolver)) {
            instance = nozzle._resolver.call(nozzle, name);
            if (instance === undefined) {
                throw new Error('The binding with the specified name \'' + name + '\' was not resolved by custom resolver.');
            }
        } else {
            binding = nozzle._bindings[name];
            if (binding) {
                instance = binding.resolve();
            } else {
                throw new Error('The binding with the specified name \'' + name + '\' was not defined.');
            }
        }
        return instance;
    };

    // registers a new binding
    Nozzle.prototype.bind = function (name) {
        if (!name || !name.length) {
            throw new Error('The binding name is required.');
        }
        if (this._bindings[name]) {
            throw new Error('The binding with the specified name \'' + name + '\' is already defined.');
        }
        var binding = new InjectorBinding(this, name);

        this._bindings[name] = binding;

        return binding;
    };

    // invokes a function
    Nozzle.prototype.invoke = function (func, resolver) {
        var nozzle = this,
            ctor = func,
            dependencies = [];

        if (isArray(ctor) && ctor.length >= 1) {
            dependencies = ctor.slice(0, ctor.length - 1);
            ctor = ctor[ctor.length - 1];
        }

        resolver = resolver || nozzle._resolve;

        if (isFunction(ctor)) {
            return ctor.apply(undefined, dependencies.map(resolver, nozzle));
        }
    };

    // binds and instantiates a new binding
    Nozzle.prototype.instantiate = function (name, factory) {
        var nozzle = this;

        if (typeof name === 'string' && isFunction(factory)) {
            return nozzle.bind(name).to(factory).resolve();
        }
    };

    // initializes the specified modules
    Nozzle.prototype.module = function () {
        var nozzle = this,
            args = Array.prototype.slice.call(arguments, 0);

        var initModules = function (modules) {
            modules.forEach(function (module) {
                if (isFunction(module)) {
                    module.call(undefined, nozzle);
                } else if (isArray(module)) {
                    initModules(module);
                }
            });
        };

        initModules(args);
    };

    // gets bindings by the specified collection of names
    Nozzle.prototype.get = function (names) {
        var nozzle = this,
            result;  

        names = names || [];

        if (!isArray(names)) {
            return nozzle._resolve(names);
        }

        result = names.map(nozzle._resolve, nozzle);

        return result;
    };

    if (typeof define === 'function' && define.amd) {
        // use define function by amdjs
        define('Nozzle', [], Nozzle);
    } else {
        // or define a global variable
        window.Nozzle = Nozzle;
    }

}(window));
