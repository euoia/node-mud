import fs = require('fs');
import path = require('path');
import Promise = require('bluebird');
import Player = require('./player');
import _ = require('lodash');
import world = require('./world');

const commandsPath = path.join(__dirname, 'commands');

const commands = [];

export async function load () {
  const readdirAsync = Promise.promisify(fs.readdir);

  const files = await readdirAsync(commandsPath).map(f => path.join(commandsPath, f));

  await Promise.map(files, async function (f) {
    if (f.match(/.js$/) === null) {
      // Do not require .map files.
      return;
    }

    console.log(`requiring`, f);
    commands.push(require(f));
  });
}

export function handle (command: string, player: Player) {
  console.log(`received command`, command, `from`, player.name);

  // Try a command.
  let commandObj = _.find(commands, c => c.match(command));
  if (commandObj) {
    return commandObj.handle(command, player);
  }

  // Try the world.
  if (world.handleCommand(command, player)) {
    return;
  }
}
