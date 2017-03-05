"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(connection) {
        this.connection = connection;
    }
    write(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection.write(text + '\n');
        });
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
        return this.connection.end();
    }
}
exports.default = Client;
;
//# sourceMappingURL=client.js.map