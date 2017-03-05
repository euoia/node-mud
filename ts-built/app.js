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
const client_1 = require("./client");
const config = require("./config");
const log = require("./log");
const net = require("net");
const connect = require("./connect");
const db = require("./db");
const world = require("./world");
const commands = require("./commands");
const Bluebird = require("bluebird");
const main = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield Bluebird.all([db.connect(), world.load(), commands.load()]);
        const server = net.createServer((connection) => {
            log.info(`client connected`);
            const client = new client_1.Client(connection);
            connection.setEncoding('utf8');
            connection.on('end', () => {
                log.info(`client disconnected`);
            });
            try {
                connect(client);
            }
            catch (e) {
                log.error(e.message);
                log.error(e.stack);
            }
        });
        server.on('error', (err) => {
            throw err;
        });
        server.listen(config.app.port, () => {
            log.info('Listening on port', config.app.port);
        });
    });
};
main();
//# sourceMappingURL=app.js.map