///<reference path='../interfaces/Persistable.d.ts'/>
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const _ = require("lodash");
const mongodb = require("mongodb");
const config_1 = require("./config");
const url = `mongodb://${config_1.default.mongo.host}:${config_1.default.mongo.port}/node-mud`;
let db = null;
const checkConnection = () => {
    if (db === null) {
        throw new Error('Not connected to database.');
    }
};
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Bluebird((resolve, reject) => {
            mongodb.MongoClient.connect(url, (err, database) => {
                if (err) {
                    return reject(err);
                }
                db = database;
                return resolve({});
            });
        });
    });
}
exports.connect = connect;
function collection(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        checkConnection();
        return new Bluebird((resolve, reject) => {
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
function save(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        checkConnection();
        const col = yield collection(obj.collection);
        // See if there's an existing object.
        const existingObj = yield findOne(obj);
        if (existingObj) {
            // If so, use the ID from that object.
            obj._id = existingObj._id;
        }
        return new Bluebird((resolve, reject) => {
            // Make sure to include _id (if present) so that the object is updated
            // rather than saved.
            const savingObj = _.pick(obj, [...obj.props, '_id']);
            col.save(savingObj, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    });
}
exports.save = save;
function findOne(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        checkConnection();
        const col = yield collection(obj.collection);
        return new Bluebird((resolve, reject) => {
            const keyedObj = _.pick(obj, obj.keys);
            col.findOne(keyedObj, (err, res) => {
                if (err) {
                    console.log(`got error`);
                    return reject(err);
                }
                return resolve(res);
            });
        });
    });
}
exports.findOne = findOne;
//# sourceMappingURL=db.js.map