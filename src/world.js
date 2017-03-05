"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var Bluebird = require("bluebird");
var yaml = require("js-yaml");
var roomsPath = 'rooms';
var goodStart = 'good-church';
var evilStart = 'evil-church';
var rooms = new Map();
var exitDirections = ['north', 'south', 'east', 'west', 'northeast',
    'southeast', 'southwest', 'northwest'];
function load() {
    return __awaiter(this, void 0, void 0, function () {
        var readFileAsync, readdirAsync, files, roomArr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readFileAsync = Bluebird.promisify(fs.readFile);
                    readdirAsync = Bluebird.promisify(fs.readdir);
                    return [4 /*yield*/, readdirAsync(roomsPath).map(function (f) { return path.join(roomsPath, f); })];
                case 1:
                    files = _a.sent();
                    return [4 /*yield*/, Bluebird.map(files, function (f) {
                            return __awaiter(this, void 0, void 0, function () {
                                var roomData;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, readFileAsync(f).then(function (data) { return yaml.safeLoad(data.toString()); })];
                                        case 1:
                                            roomData = _a.sent();
                                            roomData.roomID = path.parse(f).name;
                                            return [2 /*return*/, roomData];
                                    }
                                });
                            });
                        })];
                case 2:
                    roomArr = _a.sent();
                    roomArr.forEach(function (r) { return rooms.set(r.roomID, r); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.load = load;
var getPlayerStartingRoom = function (player) {
    return player.alignment === 'evil' ? evilStart : goodStart;
};
var updatePlayerRoom = function (player) {
    if (rooms.has(player.roomID) === false) {
        player.roomID = getPlayerStartingRoom(player);
    }
    if (rooms.has(player.roomID) === false) {
        throw new Error("Room not found: " + player.roomID);
    }
    return rooms.get(player.roomID);
};
function enterWorld(player) {
    player.tell("Entering game...");
    updatePlayerRoom(player);
    enterRoom(player);
    player.setInteractive();
}
exports.enterWorld = enterWorld;
;
function enterRoom(player) {
    look(player);
}
exports.enterRoom = enterRoom;
function movePlayer(player, roomID) {
    player.roomID = roomID;
    enterRoom(player);
}
exports.movePlayer = movePlayer;
function look(player) {
    var room = rooms.get(player.roomID);
    player.tell(room.short);
    player.tell(room.long);
    var exits = room.exits !== undefined ? room.exits : {};
    var numExits = Object.keys(exits).length;
    var isAre = numExits === 1 ? "is" : "are";
    var exitExits = numExits === 1 ? "exit" : "exits";
    var exitsStr = numExits > 0 ? ": " + Object.keys(exits).join(', ') + "." : '';
    player.tell("There " + isAre + " " + numExits + " obvious " + exitExits + exitsStr);
}
exports.look = look;
function handleCommand(command, player, fail) {
    var room = rooms.get(player.roomID);
    if (room.exits[command]) {
        console.log("moving " + player.name + " to " + room.exits[command]);
        movePlayer(player, room.exits[command]);
        return true;
    }
    if (exitDirections.indexOf(command) >= 0) {
        fail("You can't go that way!");
    }
    return false;
}
exports.handleCommand = handleCommand;
