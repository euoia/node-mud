"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function match(command) {
    return command.split(' ')[0] === 'alias';
}
exports.match = match;
function handle(args, player, fail) {
    const words = args.split(' ');
    if (words.length < 3) {
        player.tell(`Usage: alias <alias> <command>`);
        return true;
    }
    const alias = words[1];
    const command = words.splice(2).join(' ');
    player.addAlias(alias, command);
    return true;
}
exports.handle = handle;
//# sourceMappingURL=alias.js.map