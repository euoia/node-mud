import net = require('net');
import Promise = require('bluebird');

export = class Client {
  constructor (public connection: net.Socket) {
  }

  write (text) {
    this.connection.write(text + '\n');
  }

  prompt (input) {
    return new Promise(resolve => {
      this.connection.write(input);
      this.connection.once('data', function (response) {
        resolve(response.replace(/[\n\r]/g, ''));
      });
    });
  }
};
