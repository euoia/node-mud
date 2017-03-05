import Player from '../player';

export function match(command: string) {
  return command.split(' ')[0] === 'aliases';
}

export async function handle(args: string, player: Player, fail: Function) {
  player.listAliases();
  return true;
}

