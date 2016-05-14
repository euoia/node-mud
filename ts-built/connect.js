'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('fs');
const Promise = require('bluebird');
const db = require('./db');
const Player = require('./Player');
const world = require('./world');
const logoPath = './assets/logo.txt';
const readLogo = () => __awaiter(this, void 0, void 0, function* () {
    return new Promise(resolve => fs.readFile(logoPath, (err, file) => resolve(file.toString())));
});
const existingPlayer = (player) => __awaiter(this, void 0, void 0, function* () {
    const password = yield player.prompt('What is your password? ');
    if (player.checkPassword(password) === false) {
        player.tell(`Incorrect password.`);
        return player.disconnect();
    }
    world.enterWorld(player);
});
const newPlayer = (player) => __awaiter(this, void 0, void 0, function* () {
    player.tell(`A new player!`);
    // Password.
    const password = yield player.prompt(`What is your password? `);
    const passwordConfirm = yield player.prompt(`What is your password (confirm)? `);
    if (password !== passwordConfirm) {
        player.tell(`Passwords did not match.`);
        return player.disconnect();
    }
    player.setPassword(password);
    // Alignment.
    let alignment = yield player.prompt(`What is your alignment, good or evil? `);
    while (alignment !== 'good' && alignment !== 'evil') {
        player.tell(`That's not a valid choice. Enter good or evil.`);
        alignment = yield player.prompt(`What is your alignment, good or evil? `);
    }
    player.alignment = alignment;
    yield db.save(player);
    player.tell(`Entering game...`);
});
module.exports = (client) => __awaiter(this, void 0, void 0, function* () {
    client.write(yield readLogo());
    const name = yield client.prompt('What is your name? ');
    const player = new Player(name, client);
    const playerDoc = yield db.findOne(player);
    if (playerDoc === null) {
        return newPlayer(player);
    }
    player.load(playerDoc);
    return existingPlayer(player);
});
//# sourceMappingURL=connect.js.map