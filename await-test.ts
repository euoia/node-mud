'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

function bar() {
    return Promise.resolve('banana');
}

const foo = async (function foo() {
    return await(bar());
});

foo();
