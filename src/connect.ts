'use strict';
import fs = require('fs');
import Promise = require('bluebird');

const logoPath = './assets/logo.txt';

const readLogo = async () => {
  return new Promise(resolve => fs.readFile(logoPath, (err, file) => resolve(file)));
};

export = async (client) => {
  client.write(await readLogo());

  const name = await (client.prompt('What is your name? '));
  client.write(`Hello ${name}!`);

  const password = await (client.prompt('What is your password? '));
  client.write(`Your password is ${password}.`);
};
