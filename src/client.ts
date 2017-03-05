///<reference path='Client.d.ts'/>
import net = require('net');
import Bluebird = require('bluebird');

export = class Client {
  constructor (public connection: net.Socket) {
  }

  write (text) {
    this.connection.write(text + '\n');
  }

  prompt (input) {
    return new Bluebird(resolve => {
      this.connection.write(input);
      this.connection.once('data', function (response) {
        resolve(response.replace(/[\n\r]/g, ''));
      });
    });
  }

  disconnect () {
    return this.connection.destroy();
  }
};
