import Player = require('../player');

export function match(command: string) {
  return command.split(' ')[0] === 'aliases';
}

export function handle(args: string, player: Player, fail: Function) {
  player.listAliases();
  return true;
}

