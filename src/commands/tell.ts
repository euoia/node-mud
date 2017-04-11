import * as world from '../world';

import Player from '../player';

export function match(command: string) {
  return command.split(' ')[0] === 'tell';
}

export async function handle(args: string, player: Player, fail: Function) {
  const words = args.split(' ');
  if (words.length < 3) {
    player.tell(`Usage: alias <player> <message>`);
    return true;
  }

  const targetName = words[1];
  const message = words.splice(2).join(' ');

  const target = world.getPlayerByName(targetName);
  if (target === undefined) {
    player.tell(`Can't find ${targetName}.`);
    return true;
  }

  if (target === player) {
    player.tell(`You mumble awkwardly to yourself.`);
    return true;
  }

  target.replyName = player.name;
  target.tell(`${player.getProperName()} tells you: ${message}`);
  player.tell(`You tell ${target.getProperName()}: ${message}`);
  return true;
}
