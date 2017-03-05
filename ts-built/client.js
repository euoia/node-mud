"use strict";
const Bluebird = require("bluebird");
module.exports = class Client {
    constructor(connection) {
        this.connection = connection;
    }
    write(text) {
        this.connection.write(text + '\n');
    }
    prompt(input) {
        return new Bluebird(resolve => {
            this.connection.write(input);
            this.connection.once('data', function (response) {
                resolve(response.replace(/[\n\r]/g, ''));
            });
        });
    }
    disconnect() {
        return this.connection.destroy();
    }
};
//# sourceMappingURL=client.js.map