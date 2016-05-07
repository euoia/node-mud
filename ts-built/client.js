"use strict";
var Promise = require('bluebird');
module.exports = (function () {
    function Client(connection) {
        this.connection = connection;
    }
    Client.prototype.write = function (text) {
        this.connection.write(text + '\n');
    };
    Client.prototype.prompt = function (input) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.connection.write(input);
            _this.connection.once('data', function (response) {
                resolve(response.replace(/[\n\r]/g, ''));
            });
        });
    };
    return Client;
}());
//# sourceMappingURL=client.js.map