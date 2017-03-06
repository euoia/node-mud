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
const world = require("../world");
function match(command) {
    return command.split(' ')[0] === 'tell';
}
exports.match = match;
function handle(args, player, fail) {
    return __awaiter(this, void 0, void 0, function* () {
        const words = args.split(' ');
        if (words.length < 3) {
            player.tell(`Usage: alias <player> <message>`);
            return true;
        }
        const targetName = words[1];
        const message = words.splice(2).join(' ');
        const target = world.getPlayerByName(targetName);
        if (target === undefined) {
            player.tell(`Can't find ${targetName}.`);
            return true;
        }
        if (target === player) {
            player.tell(`You mumble awkwardly to yourself.`);
            return true;
        }
        target.replyName = player.name;
        target.tell(`${player.getProperName()} tells you: ${message}`);
        player.tell(`You tell ${target.getProperName()}: ${message}`);
        return true;
    });
}
exports.handle = handle;
//# sourceMappingURL=tell.js.map