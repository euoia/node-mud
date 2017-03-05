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
const fs = require("fs");
const path = require("path");
const Bluebird = require("bluebird");
const world = require("./world");
const commandsPath = path.join(__dirname, 'commands');
const commands = [];
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        const readdirAsync = Bluebird.promisify(fs.readdir);
        const files = yield readdirAsync(commandsPath).map(f => path.join(commandsPath, f));
        yield Bluebird.map(files, function (f) {
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
    let failMessage = `What?`;
    const fail = function (failString) {
        failMessage = failString;
    };
    // Try all commands.
    for (let i = 0; i < commands.length; i += 1) {
        if (commands[i].match(command)) {
            if (commands[i].handle(command, player, fail)) {
                return;
            }
        }
    }
    // Try the world.
    if (world.handleCommand(command, player, fail)) {
        return;
    }
    player.tell(failMessage);
}
exports.handle = handle;
//# sourceMappingURL=commands.js.map