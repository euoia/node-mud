'use strict';
import fs = require('fs');
import Bluebird = require('bluebird');
import db = require('./db');
import Player = require('./Player');
import Client = require('./client');
import world = require('./world');

const logoPath = './assets/logo.txt';

const readLogo = async () => {
  return new Bluebird<string>(resolve => fs.readFile(logoPath, (err, file) => resolve(file.toString())));
};

const existingPlayer = async (player: Player) => {
  const password = await player.prompt('What is your password? ');
  if (player.checkPassword(password) === false) {
    player.tell(`Incorrect password.`);
    return player.disconnect();
  }

  world.enterWorld(player);
};

const newPlayer = async (player: Player) => {
  player.tell(`A new player!`);

  // Password.
  const password = await player.prompt(`What is your password? `);
  const passwordConfirm = await player.prompt(`What is your password (confirm)? `);

  if (password !== passwordConfirm) {
    player.tell(`Passwords did not match.`);
    return player.disconnect();
  }

  player.setPassword(password);

  // Alignment.
  let alignment = await player.prompt(`What is your alignment, good or evil? `);
  while (alignment !== 'good' && alignment !== 'evil') {
    player.tell(`That's not a valid choice. Enter good or evil.`);
    alignment = await player.prompt(`What is your alignment, good or evil? `);
  }

  player.alignment = alignment;
  await db.save(player);

  world.enterWorld(player);
};

export = async (client: Client) => {
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
