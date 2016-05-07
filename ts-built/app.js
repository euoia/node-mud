"use strict";
const Client = require('./client');
const config = require('./config');
const log = require('./log');
const net = require('net');
const connect = require('./connect');
const server = net.createServer(function (connection) {
    log.info(`client connected`);
    const client = new Client(connection);
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
//# sourceMappingURL=app.js.map