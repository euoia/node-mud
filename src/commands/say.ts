import Player from '../player';

export function match(command: string) {
  return command.split(' ')[0] === 'say';
}

export async function handle(args: string, player: Player, fail: Function) {
  const words = args.split(' ');
  if (words.length < 2) {
    player.tell(`Usage: say <message>`);
    return true;
  }

  const message = words.splice(1).join(' ');
  player.getRoom().tell(`%tp% |say|: ${message}`, player);
  return true;
}

