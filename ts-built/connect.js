'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('fs');
const Promise = require('bluebird');
const logoPath = './assets/logo.txt';
const readLogo = () => __awaiter(this, void 0, void 0, function* () {
    return new Promise(resolve => fs.readFile(logoPath, (err, file) => resolve(file)));
});
module.exports = (client) => __awaiter(this, void 0, void 0, function* () {
    client.write(yield readLogo());
    const name = yield (client.prompt('What is your name? '));
    client.write(`Hello ${name}!`);
    const password = yield (client.prompt('What is your password? '));
    client.write(`Your password is ${password}.`);
});
//# sourceMappingURL=connect.js.map