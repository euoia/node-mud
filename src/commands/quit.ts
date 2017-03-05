import Player from '../player';

export function match(command: string) {
  return command === 'quit';
}

export async function handle(args: string, player: Player, fail: Function) {
  await player.quit();
  return true;
}

