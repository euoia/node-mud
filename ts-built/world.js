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
const Bluebird = require("bluebird");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const room_1 = require("./room");
const roomsPath = 'rooms';
const goodStart = 'good-church';
const evilStart = 'evil-church';
const rooms = new Map();
const players = new Array();
const exitDirections = ['north', 'south', 'east', 'west', 'northeast',
    'southeast', 'southwest', 'northwest'];
const voidRoom = new room_1.default({
    short: 'The void',
    long: 'A swirling vortex of nothingness. This is the void.'
});
rooms.set('the-void', voidRoom);
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        const readFileAsync = Bluebird.promisify(fs.readFile);
        const readdirAsync = Bluebird.promisify(fs.readdir);
        const files = yield readdirAsync(roomsPath).map(f => path.join(roomsPath, f));
        // Load rooms from files, using the filename as the ID.
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
function getPlayerStartingRoom(player) {
    return player.alignment === 'evil' ? evilStart : goodStart;
}
;
function gameLoop(player) {
    return __awaiter(this, void 0, void 0, function* () {
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
function movePlayer(player, newRoomID) {
    const oldRoom = rooms.get(player.roomID);
    const newRoom = rooms.get(newRoomID);
    if (oldRoom) {
        _.pull(oldRoom.inventory, player);
    }
    if (newRoom) {
        player.roomID = newRoomID;
        newRoom.inventory.push(player);
    }
    else {
        player.roomID = 'the-void';
        voidRoom.inventory.push(player);
    }
    look(player);
}
exports.movePlayer = movePlayer;
function getPlayerRoom(player) {
    const room = rooms.get(player.roomID);
    if (room) {
        return room;
    }
    movePlayer(player, 'the-void');
    return voidRoom;
}
exports.getPlayerRoom = getPlayerRoom;
function look(player) {
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
        .filter((i) => i !== player)
        .forEach((i) => player.tell(i.getShort(player)));
}
exports.look = look;
function handleCommand(command, player, fail) {
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
exports.handleCommand = handleCommand;
function addPlayer(player) {
    players.push(player);
}
exports.addPlayer = addPlayer;
function removePlayer(player) {
    _.pull(players, player);
}
exports.removePlayer = removePlayer;
function getPlayerByName(playerName) {
    return _.find(players, { name: playerName });
}
exports.getPlayerByName = getPlayerByName;
//# sourceMappingURL=world.js.map