"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const pluralize = require("pluralize");
class Room {
    constructor(roomData) {
        this.inventory = [];
        this.short = roomData.short;
        this.long = roomData.long;
        const roomExits = roomData.exits || {};
        this.exits = new Map();
        for (const exitText of Object.keys(roomExits)) {
            this.exits.set(exitText, roomExits[exitText]);
        }
    }
    tell(message, thisPlayer, targetPlayer) {
        this.inventory.forEach(i => {
            let subjectiveMessage = message;
            switch (i) {
                case thisPlayer:
                    if (targetPlayer) {
                        subjectiveMessage = subjectiveMessage.replace('%target%', targetPlayer.getProperName());
                    }
                    subjectiveMessage = subjectiveMessage.replace('%tp%', 'You');
                    subjectiveMessage = subjectiveMessage.replace(/(\|?)(\w+)(\|)/g, match => {
                        return match.replace(/\|/g, '');
                    });
                    subjectiveMessage = subjectiveMessage.replace('%tp%', 'You');
                    break;
                case targetPlayer:
                    if (targetPlayer) {
                        subjectiveMessage = subjectiveMessage.replace('%target%', 'You');
                    }
                    if (thisPlayer) {
                        subjectiveMessage = subjectiveMessage.replace('%tp%', thisPlayer.getProperName());
                    }
                    subjectiveMessage = subjectiveMessage.replace(/(\|?)(\w+)(\|)/g, match => {
                        const word = match.replace(/\|/g, '');
                        // TODO: This isn't really a plural, it's verb conjugation but in
                        // practise I can't think of an example where this doesn't work.
                        return pluralize.plural(word);
                    });
                    // TODO
                    break;
                default:
                    if (targetPlayer) {
                        subjectiveMessage = subjectiveMessage.replace('%target%', targetPlayer.getProperName());
                    }
                    if (thisPlayer) {
                        subjectiveMessage = subjectiveMessage.replace('%tp%', thisPlayer.getProperName());
                    }
                    subjectiveMessage = subjectiveMessage.replace(/(\|?)(\w+)(\|)/g, match => {
                        const word = match.replace(/\|/g, '');
                        // TODO: This isn't really a plural, it's verb conjugation but in
                        // practise I can't think of an example where this doesn't work.
                        return pluralize.plural(word);
                    });
            }
            i.tell(subjectiveMessage);
        });
    }
    getPlayer(name) {
        return _.find(this.inventory, { name });
    }
    getExit(exitText) {
        return this.exits.get(exitText);
    }
    getExits() {
        let exits = new Array();
        for (let exit of this.exits) {
            exits.push(exit[0]);
        }
        return exits;
    }
}
exports.default = Room;
;
//# sourceMappingURL=room.js.map