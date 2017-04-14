import Player from './player';

abstract class Command {
  abstract match (command: string): boolean;
  abstract handle (args: string, player: Player, fail: Function): Promise<boolean>;
};

export default Command;
