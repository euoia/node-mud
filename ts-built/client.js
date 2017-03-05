"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
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
    disconnect() {
        return this.connection.destroy();
    }
}
exports.Client = Client;
;
//# sourceMappingURL=client.js.map