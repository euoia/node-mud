import Player = require('../player');
import world = require('../world');

export function match (command: string) {
  return command === 'look';
}

export function handle(args: string, player: Player) {
  world.look(player);
}
