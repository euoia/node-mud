///<reference path='../interfaces/Tellable.d.ts'/>
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(roomData) {
        this.inventory = [];
        for (let prop in roomData) {
            if (roomData.hasOwnProperty(prop)) {
                this[prop] = roomData[prop];
            }
        }
    }
    tell(message) {
        this.inventory.forEach(i => i.tell(message));
    }
}
exports.default = Room;
;
//# sourceMappingURL=room.js.map