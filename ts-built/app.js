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
const commands = require("./commands");
const db = require("./db");
const net = require("net");
const process = require("process");
const world = require("./world");
const client_1 = require("./client");
const config_1 = require("./config");
const connect_1 = require("./connect");
const log_1 = require("./log");
const main = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield Bluebird.all([db.connect(), world.load(), commands.load()])
            .catch(e => {
            log_1.default.error('Error starting up.');
            log_1.default.error(e);
            process.exit(1);
        });
        const server = net.createServer((connection) => {
            log_1.default.info(`client connected`);
            const client = new client_1.default(connection);
            connection.setEncoding('utf8');
            connection.on('end', () => {
                log_1.default.info(`client disconnected`);
            });
            try {
                connect_1.default(client);
            }
            catch (e) {
                log_1.default.error(e.message);
                log_1.default.error(e.stack);
            }
        });
        server.on('error', (err) => {
            throw err;
        });
        server.listen(config_1.default.app.port, () => {
            log_1.default.info('Listening on port', config_1.default.app.port);
        });
    });
};
main();
//# sourceMappingURL=app.js.map