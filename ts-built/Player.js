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
const crypto = require("crypto");
const config = require("./config");
const commands = require("./commands");
const alias_1 = require("./alias");
const _ = require("lodash");
const db = require("./db");
class Player {
    constructor(name, client) {
        this.name = name;
        this.client = client;
        this.collection = 'players';
        this.keys = 'name';
        this.props = ['name', 'salt', 'password', 'alignment', 'roomID', 'aliases'];
        this.salt = crypto.randomBytes(64).toString('hex');
        this.aliases = [];
        this.hasQuit = false;
    }
    // Load from a mongodb document.
    load(doc) {
        this.props.forEach(prop => {
            // Filter out properties that weren't saved. This allows us to add new
            // properties.
            if (doc[prop] !== undefined) {
                this[prop] = doc[prop];
            }
        });
    }
    setPassword(password) {
        this.password = crypto
            .createHmac('sha1', this.salt + config.app.secret)
            .update(password)
            .digest('hex');
    }
    /**
     * @returns {bool}
     */
    checkPassword(password) {
        const hashed = crypto
            .createHmac('sha1', this.salt + config.app.secret)
            .update(password)
            .digest('hex');
        return hashed === this.password;
    }
    tell(text) {
        this.client.write(`${text}\n`);
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.write(`Saving...\n`);
            yield this.save();
            yield this.client.write(`Saved. Goodbye!\n`);
            this.hasQuit = true;
        });
    }
    prompt(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.prompt(input);
        });
    }
    promptPassword(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let junk;
            yield this.client.write(input);
            yield this.client.disableLocalEcho();
            // For some reason enabling and disabling local echo puts junk in the pipe.
            junk = (yield this.client.getInput());
            const password = yield this.client.getInput();
            yield this.client.enableLocalEcho();
            junk = (yield this.client.getInput());
            return password;
        });
    }
    setInteractive() {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield this.prompt(`$ `);
            console.log(`got input ${input}`);
            const substitutedInput = this.substituteAlias(input);
            yield commands.handle(substitutedInput, this);
        });
    }
    disconnect() {
        return this.client.disconnect();
    }
    addAlias(alias, command) {
        this.aliases.push(new alias_1.default(alias, command));
        this.tell(`Added alias: ${alias} => ${command} $*`);
    }
    listAliases() {
        this.aliases.forEach(a => {
            this.tell(`${a.alias} => ${a.command} $*`);
        });
    }
    substituteAlias(input) {
        const words = input.split(' ');
        const alias = words[0];
        const aliasMatch = _.find(this.aliases, { alias });
        if (aliasMatch === undefined) {
            return input;
        }
        if (words.length > 1) {
            const rest = words.splice(1).join(' ');
            return `${aliasMatch.command} ${rest}`;
        }
        return aliasMatch.command;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.save(this);
        });
    }
}
exports.default = Player;
;
//# sourceMappingURL=player.js.map