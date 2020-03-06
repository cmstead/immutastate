const testObject = {};
let testValue = {};

function copyData(dataObject) {
    return JSON.parse(JSON.stringify(dataObject));
}

Object.defineProperty(testObject, 'testProperty', {
    get() {
        return copyData(testValue);
    },
    set(newValue) {
        testValue = newValue;
    }
});

testObject.testProperty = { foo: 'bar' };

console.log(testObject.testProperty);

testObject.testProperty.foo = 'baz';

console.log(testObject.testProperty);