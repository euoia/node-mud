'use strict';
var await = require('asyncawait/await');
var async = require('asyncawait/async');
var fs = require('fs');
var Promise = require('bluebird');
var logoPath = './assets/logo.txt';
var readLogo = async(function () {
    return new Promise(function (resolve) { return fs.readFile(logoPath, function (err, file) { return resolve(file); }); });
});
module.exports = async(function (client) {
    var logo = await(readLogo());
    client.write(logo);
    var name = await(client.prompt('What is your name? '));
    client.write("Hello " + name + "!");
    var password = await(client.prompt('What is your password? '));
    client.write("Your password is " + password + ".");
});
//# sourceMappingURL=connect.js.map