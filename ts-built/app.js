"use strict";
var Client = require('./client');
var config = require('./config');
var log = require('./log');
var net = require('net');
var connect = require('./connect');
var server = net.createServer(function (connection) {
    log.info("client connected");
    var client = new Client(connection);
    connection.setEncoding('utf8');
    connection.on('end', function () {
        log.info("client disconnected");
    });
    try {
        connect(client);
    }
    catch (e) {
        log.error(e.message);
        log.error(e.stack);
    }
});
server.on('error', function (err) {
    throw err;
});
server.listen(config.app.port, function () {
    log.info('Listening on port', config.app.port);
});
//# sourceMappingURL=app.js.map