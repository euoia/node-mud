"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const _ = require('lodash');
const world = require('./world');
const commandsPath = path.join(__dirname, 'commands');
const commands = [];
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        const readdirAsync = Promise.promisify(fs.readdir);
        const files = yield readdirAsync(commandsPath).map(f => path.join(commandsPath, f));
        yield Promise.map(files, function (f) {
            return __awaiter(this, void 0, void 0, function* () {
                if (f.match(/.js$/) === null) {
                    // Do not require .map files.
                    return;
                }
                console.log(`requiring`, f);
                commands.push(require(f));
            });
        });
    });
}
exports.load = load;
function handle(command, player) {
    console.log(`received command`, command, `from`, player.name);
    // Try a command.
    let commandObj = _.find(commands, c => c.match(command));
    if (commandObj) {
        return commandObj.handle(command, player);
    }
    // Try the world.
    if (world.handleCommand(command, player)) {
        return;
    }
}
exports.handle = handle;
//# sourceMappingURL=commands.js.map