import Player from '../player';

export function match(command: string) {
  return command.split(' ')[0] === 'poke';
}

export async function handle(args: string, player: Player, fail: Function) {
  const words = args.split(' ');
  if (words.length !== 2) {
    player.tell(`Usage: poke <whom>`);
    return true;
  }

  const object = words[1];
  const target = player.getRoom().getPlayer(object);
  if (target === undefined) {
    player.tell(`There's no ${object} here!`);
    return true;
  }

  player.getRoom().tell(`%tp% |poke| %target% in the ribs.`, player, target);
  return true;
}

