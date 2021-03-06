import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import Command from './command';
import Player from './player';

import world = require('./world');

const commandsPath = path.join(__dirname, 'commands');

const commands = new Array<Command>();

export async function load () {
  const readdirAsync = Bluebird.promisify(fs.readdir);

  const files = await readdirAsync(commandsPath);

  await Bluebird.map(files as string[], async f => {
    if (f.match(/.js$/) === null) {
      // Do not require .map files.
      return;
    }

    commands.push(require(path.join(commandsPath, f)));
    console.log(`Loaded command: ${f.replace(/.js$/, '')}.`);
  });
}

export async function handle(command: string, player: Player) {
  console.log(`received command`, command, `from`, player.name);

  let failMessage = `What?`;
  const fail = (failString:string) => {
    failMessage = failString;
  };

  // Try all commands.
  for (let i = 0; i < commands.length; i += 1) {
    if (commands[i].match(command)) {
      if (await commands[i].handle(command, player, fail)) {
        return;
      }
    }
  }

  // Try the world.
  if (world.handleCommand(command, player, fail)) {
    return;
  }

  player.tell(failMessage);
}
