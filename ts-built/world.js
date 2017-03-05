"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Bluebird = require("bluebird");
const yaml = require("js-yaml");
const room_1 = require("./room");
const _ = require("lodash");
const roomsPath = 'rooms';
const goodStart = 'good-church';
const evilStart = 'evil-church';
const rooms = new Map();
const exitDirections = ['north', 'south', 'east', 'west', 'northeast',
    'southeast', 'southwest', 'northwest'];
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        const readFileAsync = Bluebird.promisify(fs.readFile);
        const readdirAsync = Bluebird.promisify(fs.readdir);
        const files = yield readdirAsync(roomsPath).map(f => path.join(roomsPath, f));
        const roomArr = yield Bluebird.map(files, function (f) {
            return __awaiter(this, void 0, void 0, function* () {
                const roomData = yield readFileAsync(f).then(data => yaml.safeLoad(data.toString()));
                roomData.roomID = path.parse(f).name;
                return roomData;
            });
        });
        roomArr.forEach(r => rooms.set(r.roomID, new room_1.default(r)));
    });
}
exports.load = load;
const getPlayerStartingRoom = (player) => {
    return player.alignment === 'evil' ? evilStart : goodStart;
};
const updatePlayerRoom = (player) => {
    if (rooms.has(player.roomID) === false) {
        player.roomID = getPlayerStartingRoom(player);
    }
    if (rooms.has(player.roomID) === false) {
        throw new Error(`Room not found: ${player.roomID}`);
    }
    enterRoom(player, player.roomID);
};
function gameLoop(player) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            updatePlayerRoom(player);
        }
        catch (e) {
            console.log(`Error entering the world.`);
            console.log(e);
        }
        player.tell(`Entering game...`);
        while (player.hasQuit === false) {
            try {
                yield player.setInteractive();
            }
            catch (e) {
                console.log('error in game loop');
                console.error(e);
            }
        }
        player.disconnect();
    });
}
exports.gameLoop = gameLoop;
;
function leaveRoom(player) {
    _.pull(rooms.get(player.roomID).inventory, player);
    player.roomID = null;
}
function enterRoom(player, roomID) {
    player.roomID = roomID;
    rooms.get(roomID).inventory.push(player);
    look(player);
}
function movePlayer(player, newRoomID) {
    leaveRoom(player);
    enterRoom(player, newRoomID);
}
exports.movePlayer = movePlayer;
function look(player) {
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
exports.look = look;
function handleCommand(command, player, fail) {
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
exports.handleCommand = handleCommand;
//# sourceMappingURL=world.js.map