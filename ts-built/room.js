"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const _ = require("lodash");
class Room {
    constructor(roomData) {
        this.inventory = [];
        for (let prop in roomData) {
            if (roomData.hasOwnProperty(prop)) {
                this[prop] = roomData[prop];
            }
        }
    }
    tell(message, thisPlayer = null, targetPlayer = null) {
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
                    subjectiveMessage = subjectiveMessage.replace('%tp%', thisPlayer.getProperName());
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
                    subjectiveMessage = subjectiveMessage.replace('%tp%', thisPlayer.getProperName());
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
}
exports.default = Room;
;
//# sourceMappingURL=room.js.map