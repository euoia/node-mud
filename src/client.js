"use strict";
var Bluebird = require("bluebird");
module.exports = (function () {
    function Client(connection) {
        this.connection = connection;
    }
    Client.prototype.write = function (text) {
        this.connection.write(text + '\n');
    };
    Client.prototype.prompt = function (input) {
        var _this = this;
        return new Bluebird(function (resolve) {
            _this.connection.write(input);
            _this.connection.once('data', function (response) {
                resolve(response.replace(/[\n\r]/g, ''));
            });
        });
    };
    Client.prototype.disconnect = function () {
        return this.connection.destroy();
    };
    return Client;
}());
