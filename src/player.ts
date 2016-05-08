///<reference path='Player.d.ts'/>
import crypto = require('crypto');
import Client = require('./client');

export = class Player {
  collection: string;
  keys: string;
  props: string[];
  salt: string; // password salt.
  password: string; // hashed password.
  alignment: string;

  constructor (public name: string, public client: Client) {
    this.collection = 'players';
    this.keys = 'name';
    this.props = ['name', 'salt', 'password', 'alignment'];
    this.salt = crypto.randomBytes(64).toString('hex');
  }

  // Load from a mongodb document.
  load (doc) {
    this.props.forEach(prop => this[prop] = doc[prop]);
  }

  setPassword (password: string) {
    this.password = crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
  }

  checkPassword (password: string) {
    const hashed = crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');

    return hashed === this.password;
  }

  tell (text: string) {
    this.client.write(text);
  }

  prompt (input: string) {
    return this.client.prompt(input);
  }

  disconnect () {
    return this.client.disconnect();
  }
}
