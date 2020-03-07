(function (moduleFactory) {
    const environmentIsNode = Boolean(module) && Boolean(module.exports);
    const stateModule = moduleFactory();

    if (environmentIsNode) {
        module.exports = stateModule;
    } else {
        window.Immutastate = stateModule;
    }
})(function () {

    function Immutastate() {
        if (Immutastate.prototype === Object.getPrototypeOf(this)) {
            throw new Error('Cannot instantiate Immutastate directly.');
        }
    }

    Immutastate.prototype = {
        addStateProperty: function (key) {
            Object.defineProperty(this, key, {
                get() {
                    return this.__state[key];
                }
            });
        },

        initializeState: function (stateObject) {
            Object.keys(stateObject)
                .forEach(key =>
                    this.addStateProperty(key));

            Object.defineProperty(this, '__state', {
                value: Object.create(stateObject)
            });

            return this;
        },

        updateProperty: function(key, value) {
            this.__state[key] = value;

            return this;
        },

        update: function(mutator) {
            const newProperties = mutator(Object.create(this.__state));

            Object.keys(newProperties)
                .forEach(key =>{
                    this.addStateProperty(key);
                    this.__state[key] = newProperties[key];
                });
            
            return this;
        }
    };

    Immutastate.extendedBy = function (constructor) {
        constructor.prototype = Object.create(Immutastate.prototype);

        return {
            withPrototype: function (prototype) {
                return setPrototype(constructor, prototype);
            }
        };
    }

    function setPrototype(constructor, prototype) {
        Object
            .keys(prototype)
            .forEach(key =>
                constructor.prototype[key] = prototype[key]);

        return constructor;
    }

    return Immutastate;
});