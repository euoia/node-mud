import fs = require('fs');
import Bluebird = require('bluebird');
import * as db from './db';
import Player from './player';
import Client from './client';
import * as world from  './world';
import newPlayer from './new-player';

const logoPath = './assets/logo.txt';

const readLogo = async () => {
  return new Bluebird<string>(resolve => fs.readFile(logoPath, (err, file) => resolve(file.toString())));
};

const existingPlayer = async (player: Player) => {
  const password = await player.promptPassword('What is your password? ');
  if (player.checkPassword(password) === false) {
    player.tell(`Incorrect password.`);
    return player.disconnect();
  }

  await world.gameLoop(player);
};

export default async function (client: Client): Promise<void> {
  client.write(await readLogo());

  const name = await client.prompt('What is your name? ');

  const player = new Player(name, client);
  const playerDoc = await db.findOne(player);
  if (playerDoc === null) {
    return newPlayer(player);
  }

  player.load(playerDoc);
  return existingPlayer(player);
};
