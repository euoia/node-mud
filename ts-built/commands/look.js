"use strict";
const world = require('../world');
function match(command) {
    return command === 'look';
}
exports.match = match;
function handle(args, player) {
    world.look(player);
}
exports.handle = handle;
//# sourceMappingURL=look.js.map