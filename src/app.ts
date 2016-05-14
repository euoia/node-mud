import Client = require('./client');
import config = require('./config');
import log = require('./log');
import net = require('net');
import connect = require('./connect');
import db = require('./db');
import world = require('./world');
import commands = require('./commands');
import Promise = require('bluebird');

const main = async function () {
  await Promise.all([db.connect(), world.load(), commands.load()]);

  const server = net.createServer((connection: net.Socket) => {
    log.info(`client connected`);
    const client = new Client(connection);

    connection.setEncoding('utf8');

    connection.on('end', () => {
      log.info(`client disconnected`);
    });

    try {
      connect(client);
    } catch (e) {
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
};

main();
