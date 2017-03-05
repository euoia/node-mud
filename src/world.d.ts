export declare function load(): Promise<void>;
export declare function enterWorld(player: Player): void;
export declare function enterRoom(player: Player): void;
export declare function movePlayer(player: Player, roomID: string): void;
export declare function look(player: Player): void;
export declare function handleCommand(command: string, player: Player, fail: Function): boolean;
