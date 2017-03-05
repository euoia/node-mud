///<reference path='../interfaces/Persistable.d.ts'/>
import mongodb = require('mongodb');
import config = require('./config');
import Bluebird = require('bluebird');
import _ = require('lodash');

const url = `mongodb://${config.mongo.host}:${config.mongo.port}/node-mud`;
let db = null;

const checkConnection = () => {
  if (db === null) {
    throw new Error('Not connected to database.');
  }
};

export async function connect () {
  return new Bluebird((resolve, reject) => {
    mongodb.MongoClient.connect(url, (err, database) => {
      if (err) { return reject(err); }
      db = database;
      return resolve(null);
    });
  });
}

export async function collection (collection: string) {
  checkConnection();
  return new Bluebird<mongodb.Collection>((resolve, reject) => {
    db.collection(collection, (err, c) => {
      if (err) { return reject(err); }
      return resolve(c);
    });
  });
}

export async function save(obj: Persistable) {
  checkConnection();
  const col = await collection(obj.collection);

  // See if there's an existing object.
  const existingObj = await findOne(obj) as Persistable;
  if (existingObj) {
    // If so, use the ID from that object.
    obj._id = existingObj._id;
  }

  return new Bluebird((resolve, reject) => {
    // Make sure to include _id (if present) so that the object is updated
    // rather than saved.
    const savingObj = _.pick(obj, [...obj.props, '_id']);

    col.save(savingObj, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });
}

export async function findOne(obj: Persistable) {
  checkConnection();
  const col = await collection(obj.collection);

  return new Bluebird((resolve, reject) => {
    const keyedObj = _.pick(obj, obj.keys);

    col.findOne(keyedObj, (err, res) => {
      if (err) { console.log(`got error`); return reject(err); }
      return resolve(res);
    });
  });
}
