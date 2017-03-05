import path = require('path');
import fs = require('fs');
import Bluebird = require('bluebird');
import yaml = require('js-yaml');
import { Player } from './player';

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

  roomArr.forEach(r => rooms.set(r.roomID, r));
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

  return rooms.get(player.roomID);
};

export function enterWorld (player: Player) {
  player.tell(`Entering game...`);
  updatePlayerRoom(player);
  enterRoom(player);
  player.setInteractive();
};

export function enterRoom (player: Player) {
  look(player);
}

export function movePlayer (player: Player, roomID: string) {
  player.roomID = roomID;
  enterRoom(player);
}

export function look (player: Player) {
  const room = rooms.get(player.roomID);
  player.tell(room.short);
  player.tell(room.long);

  const exits = room.exits !== undefined ? room.exits : {};
  const numExits = Object.keys(exits).length;
  const isAre = numExits === 1 ? `is` : `are`;
  const exitExits = numExits === 1 ? `exit` : `exits`;
  const exitsStr = numExits > 0 ? `: ${Object.keys(exits).join(', ')}.` : '';
  player.tell(`There ${isAre} ${numExits} obvious ${exitExits}${exitsStr}`);
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
