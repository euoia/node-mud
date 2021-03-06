import * as crypto from 'crypto';
import * as db from './db';
import * as world from './world';

import Alias from './alias';
import Client from './client';
import Room from './room';
import config from './config';

import commands = require('./commands');
import _ = require('lodash');

export default class Player {
  // This allows the loading from document. It's also a bit gross.
  [key: string]: any;
  _id: string;
  aliases: Alias[];
  collection: string;
  keys: string;
  props: string[];
  salt: string; // password salt.
  password: string; // hashed password.
  alignment: string;
  roomID: string;
  hasQuit: boolean;
  replyName?: string;

  constructor (public name: string, public client: Client) {
    this.collection = 'players';
    this.keys = 'name';
    this.props = ['name', 'salt', 'password', 'alignment', 'roomID', 'aliases', 'replyName'];
    this.salt = crypto.randomBytes(64).toString('hex');
    this.aliases = [];
    this.hasQuit = false;
    this.replyName = undefined;
  }

  // Load from a mongodb document.
  load (doc:any) {
    this.props.forEach(prop => {
      // Filter out properties that weren't saved. This allows us to add new
      // properties.
      if (doc[prop] !== undefined && this.hasOwnProperty(prop)) {
        this[prop] = doc[prop];
      }
    });
  }

  setPassword (password: string) {
    this.password = crypto
        .createHmac('sha1', this.salt + config.app.secret)
        .update(password)
        .digest('hex');
  }

  /**
   * @returns {bool}
   */
  checkPassword (password: string) {
    const hashed = crypto
        .createHmac('sha1', this.salt + config.app.secret)
        .update(password)
        .digest('hex');

    return hashed === this.password;
  }

  tell (text: string) {
    this.client.write(`${text}\n`);
  }

  async quit () {
    await this.client.write(`Saving...\n`);
    await this.save();
    await this.client.write(`Saved. Goodbye!\n`);
    this.hasQuit = true;
  }

  async prompt (input: string): Promise<string> {
    return this.client.prompt(input);
  }

  async promptPassword (input: string): Promise<string> {
    await this.client.write(input);
    await this.client.disableLocalEcho();
    const password = await this.client.getInput() as string;
    await this.client.enableLocalEcho();
    this.client.write('\n');

    return password;
  }

  async setInteractive () {
    const input = await this.prompt(`$ `);
    console.log(`got input ${input}`);
    const substitutedInput = this.substituteAlias(input);
    await this.command(substitutedInput);
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

  async save () {
    await db.save(this);
  }

  getProperName () {
    return `${this.name[0].toLocaleUpperCase()}${this.name.slice(1)}`;
  }

  getShort(player: Player) {
    return `${this.getProperName()} [${this.alignment}]`;
  }

  getRoom(): Room {
    return world.getPlayerRoom(this);
  }

  async command(command:string) {
    await commands.handle(command, this);
  }
};
