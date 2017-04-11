import * as net from 'net';

export default class Client {
  constructor (public connection: net.Socket) {
  }

  async write (text) {
    return new Promise(resolve => {
      this.connection.write(text, null, resolve);
    });
  }

  async getInput () {
    return new Promise(resolve => {
      this.connection.once('data', response => {
        const responseStr = response.toString();
        resolve(responseStr.replace(/[\n\r]/g, ''));
      });
    });
  }

  async prompt (input): Promise<string> {
    await this.write(input);
    return await this.getInput() as string;
  }

  async disableLocalEcho () {
    const m = [0xFF, 0xFB, 0x01]; // IAC WILL ECHO
    const message = new Buffer(m);
    return new Promise(resolve => {
      this.connection.write(message, null, () => {
        // For some reason enabling and disabling local echo puts junk in the pipe.
        this.getInput().then(resolve);
      });
    });
  }

  async enableLocalEcho () {
    const m = [0xFF, 0xFC, 0x01]; // IAC WONT ECHO
    const message = new Buffer(m);
    return new Promise(resolve => {
      this.connection.write(message, null, () => {
        // For some reason enabling and disabling local echo puts junk in the pipe.
        this.getInput().then(resolve);
      });
    });
  }

  disconnect () {
    return this.connection.end();
  }
};
