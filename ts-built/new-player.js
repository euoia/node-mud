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
function default_1(player) {
    return __awaiter(this, void 0, void 0, function* () {
        player.tell(`A new player!`);
        // Password.
        const password = yield player.promptPassword(`What is your password? `);
        const passwordConfirm = yield player.promptPassword(`What is your password (confirm)? `);
        if (password !== passwordConfirm) {
            player.tell(`Passwords did not match.`);
            player.disconnect();
            throw new Error(`Passwords did not match`);
        }
        player.setPassword(password);
        // Alignment.
        let alignment = yield player.prompt(`What is your alignment, good or evil? `);
        while (alignment !== 'good' && alignment !== 'evil') {
            player.tell(`That's not a valid choice. Enter good or evil.`);
            alignment = yield player.prompt(`What is your alignment, good or evil? `);
        }
        player.alignment = alignment;
        yield player.save();
    });
}
exports.default = default_1;
;
//# sourceMappingURL=new-player.js.map