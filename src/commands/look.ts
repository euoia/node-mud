import Player = require('../player');
import world = require('../world');

export function match(command: string) {
  return command === 'look';
}

export function handle(args: string, player: Player, fail: Function) {
  world.look(player);
  return true;
}
