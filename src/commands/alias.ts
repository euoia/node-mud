import Player from '../player';

export function match(command: string): boolean {
  return command.split(' ')[0] === 'alias';
}

export async function handle(args: string, player: Player, fail: Function): Promise<boolean> {
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

