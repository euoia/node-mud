"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function match(command) {
    return command.split(' ')[0] === 'aliases';
}
exports.match = match;
function handle(args, player, fail) {
    player.listAliases();
    return true;
}
exports.handle = handle;
//# sourceMappingURL=aliases.js.map