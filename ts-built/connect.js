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
const fs = require("fs");
const Bluebird = require("bluebird");
const db = require("./db");
const player_1 = require("./player");
const world = require("./world");
const new_player_1 = require("./new-player");
const logoPath = './assets/logo.txt';
const readLogo = () => __awaiter(this, void 0, void 0, function* () {
    return new Bluebird(resolve => fs.readFile(logoPath, (err, file) => resolve(file.toString())));
});
const existingPlayer = (player) => __awaiter(this, void 0, void 0, function* () {
    const password = yield player.prompt('What is your password? ');
    if (player.checkPassword(password) === false) {
        player.tell(`Incorrect password.`);
        return player.disconnect();
    }
    yield world.gameLoop(player);
});
function default_1(client) {
    return __awaiter(this, void 0, void 0, function* () {
        client.write(yield readLogo());
        const name = yield client.prompt('What is your name? ');
        const player = new player_1.default(name, client);
        const playerDoc = yield db.findOne(player);
        if (playerDoc === null) {
            return new_player_1.default(player);
        }
        player.load(playerDoc);
        return existingPlayer(player);
    });
}
exports.default = default_1;
;
//# sourceMappingURL=connect.js.map