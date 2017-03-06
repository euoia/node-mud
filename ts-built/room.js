"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
class Room {
    constructor(roomData) {
        this.inventory = [];
        for (let prop in roomData) {
            if (roomData.hasOwnProperty(prop)) {
                this[prop] = roomData[prop];
            }
        }
    }
    tell(message, thisPlayer = null) {
        this.inventory.forEach(i => {
            if (i === thisPlayer) {
                let subjectiveMessage = message;
                subjectiveMessage = message.replace('%tp%', 'You');
                subjectiveMessage = subjectiveMessage.replace(/(\|?)(\w+)(\|)/g, match => {
                    return match.replace(/\|/g, '');
                });
                i.tell(subjectiveMessage.replace('%tp%', 'You'));
            }
            else {
                let subjectiveMessage = message;
                subjectiveMessage = subjectiveMessage.replace(/(\|?)(\w+)(\|)/g, match => {
                    const word = match.replace(/\|/g, '');
                    return pluralize.plural(word);
                });
                i.tell(subjectiveMessage.replace('%tp%', thisPlayer.getProperName()));
            }
        });
    }
}
exports.default = Room;
;
//# sourceMappingURL=room.js.map