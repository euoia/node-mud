///<reference path='Persistable.d.ts'/>
import mongodb = require('mongodb');
import config = require('./config');
import Promise = require('bluebird');
import _ = require('lodash');

const server = new mongodb.Server(config.mongo.host, config.mongo.port);
const db = new mongodb.Db('node-mud', server, { w: 1 });

db.open(function() {});

export async function collection (collection: string) {
  return new Promise<mongodb.Collection>((resolve, reject) => {
    db.collection(collection, (err, c) => {
      if (err) { return reject(err); }
      return resolve(c);
    });
  });
}

export async function save(obj: Persistable) {
  const col = await collection(obj.collection);

  return new Promise((resolve, reject) => {
    const savingObj = _.pick(obj, obj.props);

    col.insert(savingObj, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });
}

export async function findOne(obj: Persistable) {
  const col = await collection(obj.collection);

  return new Promise((resolve, reject) => {
    const keyedObj = _.pick(obj, obj.keys);

    col.findOne(keyedObj, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });
}
