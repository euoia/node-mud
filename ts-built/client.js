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
            return new Promise(resolve => {
                this.connection.write(text, null, resolve);
            });
        });
    }
    getInput() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.connection.once('data', response => {
                    const responseStr = response.toString();
                    resolve(responseStr.replace(/[\n\r]/g, ''));
                });
            });
        });
    }
    prompt(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.write(input);
            return yield this.getInput();
        });
    }
    disableLocalEcho() {
        return __awaiter(this, void 0, void 0, function* () {
            const m = [0xFF, 0xFB, 0x01]; // IAC WILL ECHO
            const message = new Buffer(m);
            return new Promise(resolve => {
                this.connection.write(message, null, () => {
                    // For some reason enabling and disabling local echo puts junk in the pipe.
                    this.getInput().then(resolve);
                });
            });
        });
    }
    enableLocalEcho() {
        return __awaiter(this, void 0, void 0, function* () {
            const m = [0xFF, 0xFC, 0x01]; // IAC WONT ECHO
            const message = new Buffer(m);
            return new Promise(resolve => {
                this.connection.write(message, null, () => {
                    // For some reason enabling and disabling local echo puts junk in the pipe.
                    this.getInput().then(resolve);
                });
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