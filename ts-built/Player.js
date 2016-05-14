"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
///<reference path='Player.d.ts'/>
const crypto = require('crypto');
const config = require('./config');
const commands = require('./commands');
module.exports = class Player {
    constructor(name, client) {
        this.name = name;
        this.client = client;
        this.collection = 'players';
        this.keys = 'name';
        this.props = ['name', 'salt', 'password', 'alignment', 'roomID'];
        this.salt = crypto.randomBytes(64).toString('hex');
    }
    // Load from a mongodb document.
    load(doc) {
        this.props.forEach(prop => this[prop] = doc[prop]);
    }
    setPassword(password) {
        this.password = crypto
            .createHmac('sha1', this.salt + config.app.secret)
            .update(password)
            .digest('hex');
    }
    checkPassword(password) {
        const hashed = crypto
            .createHmac('sha1', this.salt + config.app.secret)
            .update(password)
            .digest('hex');
        return hashed === this.password;
    }
    tell(text) {
        this.client.write(text);
    }
    prompt(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.prompt(input);
        });
    }
    setInteractive() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = yield this.prompt(`$ `);
            commands.handle(command, this);
            this.setInteractive();
        });
    }
    disconnect() {
        return this.client.disconnect();
    }
}
;
//# sourceMappingURL=Player.js.map