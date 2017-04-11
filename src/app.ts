import * as Bluebird from 'bluebird';
import * as commands from './commands';
import * as db from './db';
import * as net from 'net';
import * as process from 'process';
import * as world from './world';

import Client from './client';
import config from './config';
import connect from './connect';
import log from './log';

const main = async function () {
  await Bluebird.all([db.connect(), world.load(), commands.load()])
    .catch(e => {
      log.error('Error starting up.');
      log.error(e);
      process.exit(1);
    });

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
