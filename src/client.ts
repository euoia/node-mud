import net = require('net');

export default class Client {
  constructor (public connection: net.Socket) {
  }

  async write (text) {
    return new Promise(resolve => {
      this.connection.write(text, null, resolve);
    });
  }

  async getInput () {
    console.log('getting input');
    return new Promise(resolve => {
      this.connection.once('data', response => {
        const responseStr = response.toString();
        console.log('received data', responseStr);
        resolve(responseStr.replace(/[\n\r]/g, ''));
      });
    });
  }

  async prompt (input): Promise<string> {
    await this.write(input);
    return await this.getInput() as string;
  }

  async disableLocalEcho () {
    // const m = [0x74, 0x65, 0x73, 0x74]; // test
    // const m = [0xFF, 0xFC, 0x01]; // IAC WONT ECHO
    const m = [0xFF, 0xFB, 0x01]; // IAC WILL ECHO
    const message = new Buffer(m);
    return new Promise(resolve => {
      this.connection.write(message, null, resolve);
    });
  }

  async enableLocalEcho () {
    const m = [0xFF, 0xFC, 0x01]; // IAC WONT ECHO
    // const m = [0xFF, 0xFB, 0x01]; // IAC WILL ECHO
    const message = new Buffer(m);
    return new Promise(resolve => {
      this.connection.write(message, null, resolve);
    });
  }

  disconnect () {
    return this.connection.end();
  }
};
