import fs = require('fs');
import path = require('path');
import Bluebird = require('bluebird');
import Player = require('./player');
import world = require('./world');

const commandsPath = path.join(__dirname, 'commands');

const commands = [];

export async function load () {
  const readdirAsync = Bluebird.promisify(fs.readdir);

  const files = await readdirAsync(commandsPath).map(f => path.join(commandsPath, f as any));

  await Bluebird.map(files, async function (f) {
    if (f.match(/.js$/) === null) {
      // Do not require .map files.
      return;
    }

    console.log(`requiring`, f);
    commands.push(require(f));
  });
}

export function handle(command: string, player: Player) {
  console.log(`received command`, command, `from`, player.name);

  let failMessage = `What?`;
  const fail = function (failString) {
    failMessage = failString;
  };

  // Try all commands.
  for (let i = 0; i < commands.length; i += 1) {
    if (commands[i].match(command)) {
      if (commands[i].handle(command, player, fail)) {
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
