"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const world = require("../world");
function match(command) {
    return command === 'look';
}
exports.match = match;
function handle(args, player, fail) {
    world.look(player);
    return true;
}
exports.handle = handle;
//# sourceMappingURL=look.js.map