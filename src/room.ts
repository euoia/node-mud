export default class Room {
  _id: string;
  short: string;
  long: string;
  inventory: object[];
  exits: object[];

  constructor (roomData) {
    this.inventory = [];

    for (let prop in roomData) {
      if (roomData.hasOwnProperty(prop)) {
        this[prop] = roomData[prop];
      }
    }
  }
};
