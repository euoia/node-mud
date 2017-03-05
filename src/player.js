"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
///<reference path='Player.d.ts'/>
var crypto = require("crypto");
var config = require("./config");
var commands = require("./commands");
var Alias = require("./alias");
var _ = require("lodash");
module.exports = (function () {
    function Player(name, client) {
        this.name = name;
        this.client = client;
        this.collection = 'players';
        this.keys = 'name';
        this.props = ['name', 'salt', 'password', 'alignment', 'roomID'];
        this.salt = crypto.randomBytes(64).toString('hex');
        this.aliases = [];
    }
    // Load from a mongodb document.
    Player.prototype.load = function (doc) {
        var _this = this;
        this.props.forEach(function (prop) { return _this[prop] = doc[prop]; });
    };
    Player.prototype.setPassword = function (password) {
        this.password = crypto
            .createHmac('sha1', this.salt + config.app.secret)
            .update(password)
            .digest('hex');
    };
    Player.prototype.checkPassword = function (password) {
        var hashed = crypto
            .createHmac('sha1', this.salt + config.app.secret)
            .update(password)
            .digest('hex');
        return hashed === this.password;
    };
    Player.prototype.tell = function (text) {
        this.client.write(text);
    };
    Player.prototype.prompt = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.prompt(input)];
            });
        });
    };
    Player.prototype.setInteractive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, substitutedInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prompt("$ ")];
                    case 1:
                        input = _a.sent();
                        console.log("got input " + input);
                        substitutedInput = this.substituteAlias(input);
                        commands.handle(substitutedInput, this);
                        // After getting a command, get another command.
                        this.setInteractive();
                        return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.disconnect = function () {
        return this.client.disconnect();
    };
    Player.prototype.addAlias = function (alias, command) {
        this.aliases.push(new Alias(alias, command));
        this.tell("Added alias: " + alias + " => " + command + " $*");
    };
    Player.prototype.listAliases = function () {
        var _this = this;
        this.aliases.forEach(function (a) {
            _this.tell(a.alias + " => " + a.command + " $*");
        });
    };
    Player.prototype.substituteAlias = function (input) {
        var words = input.split(' ');
        var alias = words[0];
        var aliasMatch = _.find(this.aliases, { alias: alias });
        if (aliasMatch === undefined) {
            return input;
        }
        if (words.length > 1) {
            var rest = words.splice(1).join(' ');
            return aliasMatch.command + " " + rest;
        }
        return aliasMatch.command;
    };
    return Player;
}());
