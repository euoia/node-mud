"use strict";
///<reference path='Player.d.ts'/>
const crypto = require('crypto');
const config = require('./config');
module.exports = class Player {
    constructor(name, client) {
        this.name = name;
        this.client = client;
        this.collection = 'players';
        this.keys = 'name';
        this.props = ['name', 'salt', 'password', 'alignment'];
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
        return this.client.prompt(input);
    }
    disconnect() {
        return this.client.disconnect();
    }
}
;
//# sourceMappingURL=Player.js.map