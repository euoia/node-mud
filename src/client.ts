import net = require('net');

export default class Client {
  constructor (public connection: net.Socket) {
  }

  async write (text) {
    this.connection.write(text + '\n');
  }

  prompt (input): Promise<string> {
    return new Promise(resolve => {
      this.connection.write(input);
      this.connection.once('data', function (response) {
        resolve(response.replace(/[\n\r]/g, ''));
      });
    });
  }

  disconnect () {
    return this.connection.end();
  }
};
