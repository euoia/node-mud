import Client = require('./client');
import config = require('./config');
import log = require('./log');
import net = require('net');
import connect = require('./connect');

const server = net.createServer(function (connection: net.Socket) {
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
