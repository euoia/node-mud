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
function match(command) {
    return command.split(' ')[0] === 'reply';
}
exports.match = match;
function handle(args, player, fail) {
    return __awaiter(this, void 0, void 0, function* () {
        const words = args.split(' ');
        if (words.length < 2) {
            player.tell(`Usage: reply <message>`);
            return true;
        }
        if (player.replyName === null) {
            player.tell(`You have nobody to reply to.`);
            return true;
        }
        player.command(args.replace(/reply/, `tell ${player.replyName}`));
        return true;
    });
}
exports.handle = handle;
//# sourceMappingURL=reply.js.map