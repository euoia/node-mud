import path = require('path');
import fs = require('fs');
import Bluebird = require('bluebird');
import yaml = require('js-yaml');
import Player from './player';
import Room from './room';
import * as _ from 'lodash';

const roomsPath = 'rooms';
const goodStart = 'good-church';
const evilStart = 'evil-church';
const rooms = new Map();

const exitDirections = ['north', 'south', 'east', 'west', 'northeast',
  'southeast', 'southwest', 'northwest'];

export async function load () {
  const readFileAsync = Bluebird.promisify(fs.readFile);
  const readdirAsync = Bluebird.promisify(fs.readdir);

  const files = await readdirAsync(roomsPath).map(f => path.join(roomsPath, f as any));

  const roomArr = await Bluebird.map(files, async function (f) {
    const roomData = await readFileAsync(f as any).then(data => yaml.safeLoad(data.toString()));
    roomData.roomID = path.parse(f).name;
    return roomData;
  });

  roomArr.forEach(r => rooms.set(r.roomID, new Room(r)));
}

const getPlayerStartingRoom = (player: Player) => {
  return player.alignment === 'evil' ? evilStart : goodStart;
};

const updatePlayerRoom = (player: Player) => {
  if (rooms.has(player.roomID) === false) {
    player.roomID = getPlayerStartingRoom(player);
  }

  if (rooms.has(player.roomID) === false) {
    throw new Error(`Room not found: ${player.roomID}`);
  }

  enterRoom(player, player.roomID);
};

export async function gameLoop (player: Player) {
  try {
    updatePlayerRoom(player);
  } catch (e) {
    console.log(`Error entering the world.`);
    console.log(e);
  }

  player.tell(`Entering game...`);

  while (player.hasQuit === false) {
    try {
      await player.setInteractive();
    } catch (e) {
      console.log('error in game loop');
      console.error(e);
    }
  }

  player.disconnect();
};

function leaveRoom (player: Player) {
  _.pull(rooms.get(player.roomID).inventory, player);
  player.roomID = null;
}

function enterRoom (player: Player, roomID: string) {
  player.roomID = roomID;
  rooms.get(roomID).inventory.push(player);
  look(player);
}

export function movePlayer (player: Player, newRoomID: string) {
  leaveRoom(player);
  enterRoom(player, newRoomID);
}

export function look (player: Player) {
  const room = rooms.get(player.roomID);
  player.tell(room.short);
  player.tell(room.long);

  // Exits.
  const exits = room.exits !== undefined ? room.exits : {};
  const numExits = Object.keys(exits).length;
  const isAre = numExits === 1 ? `is` : `are`;
  const exitExits = numExits === 1 ? `exit` : `exits`;
  const exitsStr = numExits > 0 ? `: ${Object.keys(exits).join(', ')}.` : '';
  player.tell(`There ${isAre} ${numExits} obvious ${exitExits}${exitsStr}`);

  // Inventory.
  room.inventory
    .filter(i => i !== player)
    .forEach(i => player.tell(i.getShort(player)));
}

export function handleCommand (command: string, player: Player, fail: Function): boolean {
  const room = rooms.get(player.roomID);
  if (room.exits[command]) {
    console.log(`moving ${player.name} to ${room.exits[command]}`);
    movePlayer(player, room.exits[command]);
    return true;
  }

  if (exitDirections.indexOf(command) >= 0) {
    fail(`You can't go that way!`);
  }

  return false;
}
