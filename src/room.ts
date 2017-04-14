import * as _ from 'lodash';
import * as pluralize from 'pluralize';

import Player from './player';

export default class Room {
  _id: string;
  short: string;
  long: string;
  inventory: any[];
  exits: Map<string, string>;

  constructor (roomData:any) {
    this.inventory = [];
    this.short = roomData.short;
    this.long = roomData.long;

    const roomExits = roomData.exits || {};

    this.exits = new Map();
    for (const exitText of Object.keys(roomExits)) {
      this.exits.set(exitText, roomExits[exitText])
    }
  }

  tell (message:string, thisPlayer?:Player, targetPlayer?:Player) {
    this.inventory.forEach(i => {
      let subjectiveMessage = message;

      switch (i) {
      case thisPlayer:
        if (targetPlayer) {
          subjectiveMessage = subjectiveMessage.replace('%target%', targetPlayer.getProperName());
        }

        subjectiveMessage = subjectiveMessage.replace('%tp%', 'You');
        subjectiveMessage = subjectiveMessage.replace(
          /(\|?)(\w+)(\|)/g,
          match => {
            return match.replace(/\|/g, '');
          },
        );
        subjectiveMessage = subjectiveMessage.replace('%tp%', 'You');
        break;
      case targetPlayer:
        if (targetPlayer) {
          subjectiveMessage = subjectiveMessage.replace('%target%', 'You');
        }

        if (thisPlayer) {
          subjectiveMessage = subjectiveMessage.replace('%tp%', thisPlayer.getProperName());
        }

        subjectiveMessage = subjectiveMessage.replace(
          /(\|?)(\w+)(\|)/g,
          match => {
            const word = match.replace(/\|/g, '');

            // TODO: This isn't really a plural, it's verb conjugation but in
            // practise I can't think of an example where this doesn't work.
            return pluralize.plural(word);
          },
        );
        // TODO
        break;
      default:
        if (targetPlayer) {
          subjectiveMessage = subjectiveMessage.replace('%target%', targetPlayer.getProperName());
        }

        if (thisPlayer) {
          subjectiveMessage = subjectiveMessage.replace('%tp%', thisPlayer.getProperName());
        }

        subjectiveMessage = subjectiveMessage.replace(
          /(\|?)(\w+)(\|)/g,
          match => {
            const word = match.replace(/\|/g, '');

            // TODO: This isn't really a plural, it's verb conjugation but in
            // practise I can't think of an example where this doesn't work.
            return pluralize.plural(word);
          },
        );
      }

      i.tell(subjectiveMessage);
    });
  }

  getPlayer(name: string): Player {
    return _.find(this.inventory, {name});
  }

  getExit(exitText: string): string | undefined {
    return this.exits.get(exitText);
  }

  getExits(): string[] {
    let exits = new Array<string>();
    for (let exit of this.exits) {
      exits.push(exit[0]);
    }

    return exits;
  }
};
