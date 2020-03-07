const { assert } = require('chai');
const gwt = require('fluent-gwt').configure({});

const Immutastate = require('../index');

describe('Immutastate Instances', function () {

    describe('Instantiation and Inheritance', function () {

        it('throws an error during instantiation if not inherited from', function () {
            return gwt
                .given(
                    'Immutatstate is not inherited from',
                    () => Immutastate
                )
                .when(
                    'Immutatstate is instantiated',
                    (StateObject) => () => new StateObject()
                )
                .then(
                    'An error is thrown',
                    (instantiateState) => assert.throws(instantiateState)
                );
        });

        it('does not throw an error during instantiation if inherited from', function () {
            return gwt
                .given(
                    'Immutatstate is inherited from',
                    () => {
                        return Immutastate
                            .extendedBy(function InheritingState() { })
                            .withPrototype({});
                    }
                )
                .when(
                    'Inerited object is instantiated',
                    (StateObject) => () => new StateObject()
                )
                .then(
                    'An error is not thrown',
                    (instantiateState) => assert.doesNotThrow(instantiateState)
                );
        });

        it('does not throw error during instantiation if extended', function () {
            return gwt
                .given(
                    'a class extends Immutastate',
                    function () {
                        class ExtendedState extends Immutastate {
                            constructor() {
                                super();
                            }
                        }

                        return ExtendedState;
                    }
                )
                .when(
                    'instantiating extended object',
                    (ExtendedState) => () => new ExtendedState()
                )
                .then(
                    'No error should be thrown',
                    (instantiation) => assert.doesNotThrow(instantiation)
                );
        });

    });

    describe('Extension and use', function () {

        let TestState;

        beforeEach(function () {
            TestState = Immutastate
                .extendedBy(function () { })
                .withPrototype({});
        });

        it('creates an instantiable Immutatstate object when using extendedBy', function () {
            return gwt
                .given(
                    'an instantiable state object set up with extendedBy',
                    function () {
                        return Immutastate
                            .extendedBy(function () { })
                            .withPrototype({});
                    }
                )
                .when(
                    'new state object is created',
                    (stateInstantiableObject) => new stateInstantiableObject()
                )
                .then(
                    'new state object is an instance of Immutastate',
                    (stateInstance) => assert.isTrue(stateInstance instanceof Immutastate)
                );
        });

        it('adds prototype methods to instantiable state object prototype when extending Immutastate', function () {
            return gwt
                .given(
                    'an extending state object is created',
                    function () {
                        return Immutastate
                            .extendedBy(function () { })
                            .withPrototype({
                                foo: () => 'bar'
                            });
                    }
                )
                .when(
                    'extending object is instantiated',
                    (StateObject) => new StateObject()
                )
                .then(
                    'prototype method exists on instantiated object',
                    (stateObject) => assert.equal(stateObject.foo(), 'bar')
                );
        });

        it('adds properties to state object when initializeState is called on a new state object', function () {
            return gwt
                .given(
                    'a state object is created',
                    () => new TestState()
                )
                .when(
                    'state is initialized into state object',
                    (testState) => testState.initializeState({
                        myValue: 'yay!'
                    })
                )
                .then(
                    'state property exists on state object',
                    (testState) => assert.equal(testState.myValue, 'yay!')
                );
        });

        it('makes state properties immutable on state initialization', function () {
            return gwt
                .given(
                    'state is initialized into state object',
                    () => {
                        const testState = new TestState();
                        return testState.initializeState({
                            myValue: 'yay!'
                        });
                    }
                )
                .when(
                    'non-writeable (immutable) property is written to',
                    (testState) => {
                        testState.myValue = 'oh no!';
                        return testState;
                    }
                )
                .then(
                    'state value has not changed',
                    (testState) => assert.equal(testState.myValue, 'yay!')
                );
        });

        it('updates state properties when state is updated by property key', function () {
            return gwt
                .given(
                    'state is initialized',
                    function() {
                        const testState = new TestState();
                        return testState.initializeState({
                            test: 'value'
                        });
                    }
                )
                .when(
                    'a single state property is updated by key',
                    (testState) => testState.updateProperty('test', 'a new value')
                )
                .then(
                    'state property was updated correctly',
                    (testState) => assert.equal(testState.test, 'a new value')
                );
        });

        it('updates state with a mutator function', function () {
            return gwt
                .given(
                    'state is initialized',
                    function() {
                        const testState = new TestState();
                        return testState.initializeState({
                            testing: 'this is a test'
                        })
                    }
                )
                .when(
                    'state is updated with a mutator function',
                    (testState) => testState.update(function(currentState) {
                        return {
                            moreTesting: 'this is an update: ' + currentState.testing
                        }
                    })
                )
                .then(
                    'state values were updated',
                    function(testState) {
                        assert.equal(testState.testing, 'this is a test');
                        assert.equal(testState.moreTesting, 'this is an update: this is a test');
                    }
                );
        });

        // Momentarily on hold
        it.skip('updates state through a direct trigger', function () {
            return gwt
                .given(
                    'mutation trigger is attached to state'
                )
                .when(
                    'state mutation behavior is triggered'
                )
                .then(
                    'state property was updated as expected'
                );
        });
    });

});