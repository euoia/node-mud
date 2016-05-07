"use strict";
const Promise = require('bluebird');
module.exports = class Client {
    constructor(connection) {
        this.connection = connection;
    }
    write(text) {
        this.connection.write(text + '\n');
    }
    prompt(input) {
        return new Promise(resolve => {
            this.connection.write(input);
            this.connection.once('data', function (response) {
                resolve(response.replace(/[\n\r]/g, ''));
            });
        });
    }
}
;
//# sourceMappingURL=client.js.map