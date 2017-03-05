import { Player } from '../player';

export function match(command: string) {
  return command.split(' ')[0] === 'alias';
}

export function handle(args: string, player: Player, fail: Function) {
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

