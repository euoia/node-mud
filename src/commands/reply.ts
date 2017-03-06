import Player from '../player';

export function match(command: string) {
  return command.split(' ')[0] === 'reply';
}

export async function handle(args: string, player: Player, fail: Function) {
  const words = args.split(' ');
  if (words.length < 2) {
    player.tell(`Usage: reply <message>`);
    return true;
  }

  if (player.replyName === null) {
    player.tell(`You have nobody to reply to.`);
    return true;
  }

  player.command(args.replace(/reply/, `tell ${player.replyName}`));
  return true;
}
