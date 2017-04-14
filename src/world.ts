import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import Player from './player';
import Room from './room';

const roomsPath = 'rooms';
const goodStart = 'good-church';
const evilStart = 'evil-church';
const rooms = new Map<string, Room>();
const players = new Array<Player>();

const exitDirections = ['north', 'south', 'east', 'west', 'northeast',
  'southeast', 'southwest', 'northwest'];

const voidRoom = new Room({
  short: 'The void',
  long: 'A swirling vortex of nothingness. This is the void.'
});

rooms.set('the-void', voidRoom);

export async function load () {
  const readFileAsync = Bluebird.promisify(fs.readFile);
  const readdirAsync = Bluebird.promisify(fs.readdir);

  const files = await readdirAsync(roomsPath).map(f => path.join(roomsPath, f as any));

  // Load rooms from files, using the filename as the ID.
  const roomArr = await Bluebird.map(files, async function (f) {
    const roomData = await readFileAsync(f as any).then(data => yaml.safeLoad(data.toString()));
    roomData.roomID = path.parse(f).name;
    return roomData;
  });

  roomArr.forEach(r => rooms.set(r.roomID, new Room(r)));
}

function getPlayerStartingRoom (player: Player):string {
  return player.alignment === 'evil' ? evilStart : goodStart;
};

export async function gameLoop (player: Player) {
  if (rooms.has(player.roomID) === false || player.roomID === undefined) {
    player.roomID = getPlayerStartingRoom(player);
  }

  if (rooms.has(player.roomID) === false) {
    throw new Error(`Room not found: ${player.roomID}`);
  }

  movePlayer(player, player.roomID);

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
}

export function movePlayer (player: Player, newRoomID: string) {
  const oldRoom = rooms.get(player.roomID);
  const newRoom = rooms.get(newRoomID);

  if (oldRoom) {
    _.pull(oldRoom.inventory, player);
  }

  if (newRoom) {
    player.roomID = newRoomID;
    newRoom.inventory.push(player);
  } else {
    player.roomID = 'the-void';
    voidRoom.inventory.push(player);
  }

  look(player);
}

export function getPlayerRoom (player: Player): Room {
  const room = rooms.get(player.roomID);
  if (room) {
    return room;
  }

  movePlayer(player, 'the-void');
  return voidRoom;

}

export function look (player: Player) {
  const room = getPlayerRoom(player);
  player.tell(room.short);
  player.tell(room.long);

  // Exits.
  const exits = room.getExits();
  const numExits = Object.keys(exits).length;
  const isAre = numExits === 1 ? `is` : `are`;
  const exitExits = numExits === 1 ? `exit` : `exits`;
  const exitsStr = numExits > 0 ? `: ${exits.join(', ')}.` : '';
  player.tell(`There ${isAre} ${numExits} obvious ${exitExits}${exitsStr}`);

  // Inventory.
  room.inventory
    .filter((i:any) => i !== player)
    .forEach((i:any) => player.tell(i.getShort(player)));
}

export function handleCommand (command: string, player: Player, fail: Function): boolean {
  const room = getPlayerRoom(player);
  const newRoomID = room.getExit(command);
  if (newRoomID) {
    console.log(`moving ${player.name} to ${newRoomID}`);
    movePlayer(player, newRoomID);
    return true;
  }

  if (exitDirections.indexOf(command) >= 0) {
    fail(`You can't go that way!`);
  }

  return false;
}

export function addPlayer(player: Player) {
  players.push(player);
}

export function removePlayer(player: Player) {
  _.pull(players, player);
}

export function getPlayerByName(playerName: string): Player | undefined {
  return _.find(players, {name: playerName});
}
