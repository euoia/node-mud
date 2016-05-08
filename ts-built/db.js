"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongodb = require('mongodb');
const config = require('./config');
const Promise = require('bluebird');
const _ = require('lodash');
const server = new mongodb.Server(config.mongo.host, config.mongo.port);
const db = new mongodb.Db('node-mud', server, { w: 1 });
db.open(function () { });
function collection(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db.collection(collection, (err, c) => {
                if (err) {
                    return reject(err);
                }
                return resolve(c);
            });
        });
    });
}
exports.collection = collection;
// TODO: add persistable interface.
function save(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const col = yield collection(obj.collection);
        return new Promise((resolve, reject) => {
            const savingObj = _.pick(obj, obj.props);
            col.insert(savingObj, (err, res) => {
                if (err) {
                    return reject(err);
                }
                console.log(`Saved to ${obj.collection}`);
                return resolve(res);
            });
        });
    });
}
exports.save = save;
function findOne(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const col = yield collection(obj.collection);
        return new Promise((resolve, reject) => {
            const keyedObj = _.pick(obj, obj.keys);
            col.findOne(keyedObj, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    });
}
exports.findOne = findOne;
//# sourceMappingURL=db.js.map