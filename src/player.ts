///<reference path='Player.d.ts'/>
import crypto = require('crypto');
import Client = require('./client');
import config = require('./config');
import commands = require('./commands');
import Alias = require('./alias');
import _ = require('lodash');

export = class Player {
  aliases: Alias[];
  collection: string;
  keys: string;
  props: string[];
  salt: string; // password salt.
  password: string; // hashed password.
  alignment: string;
  roomID: string;

  constructor (public name: string, public client: Client) {
    this.collection = 'players';
    this.keys = 'name';
    this.props = ['name', 'salt', 'password', 'alignment', 'roomID'];
    this.salt = crypto.randomBytes(64).toString('hex');
    this.aliases = [];
  }

  // Load from a mongodb document.
  load (doc) {
    this.props.forEach(prop => this[prop] = doc[prop]);
  }

  setPassword (password: string) {
    this.password = crypto
        .createHmac('sha1', this.salt + config.app.secret)
        .update(password)
        .digest('hex');
  }

  checkPassword (password: string) {
    const hashed = crypto
        .createHmac('sha1', this.salt + config.app.secret)
        .update(password)
        .digest('hex');

    return hashed === this.password;
  }

  tell (text: string) {
    this.client.write(text);
  }

  async prompt (input: string) {
    return this.client.prompt(input);
  }

  async setInteractive () {
    const input = await this.prompt(`$ `);
    console.log(`got input ${input}`);
    const substitutedInput = this.substituteAlias(input);
    commands.handle(substitutedInput, this);

    // After getting a command, get another command.
    this.setInteractive();
  }

  disconnect () {
    return this.client.disconnect();
  }

  addAlias (alias: string, command: string) {
    this.aliases.push(new Alias(alias, command));
    this.tell(`Added alias: ${alias} => ${command} $*`);
  }

  listAliases () {
    this.aliases.forEach(a => {
      this.tell(`${a.alias} => ${a.command} $*`);
    });
  }

  substituteAlias(input: string) {
    const words = input.split(' ');
    const alias = words[0];
    const aliasMatch = _.find(this.aliases, {alias});
    if (aliasMatch === undefined) {
      return input;
    }

    if (words.length > 1) {
      const rest = words.splice(1).join(' ');
      return `${aliasMatch.command} ${rest}`;
    }

    return aliasMatch.command;
  }
};
