interface Player {
  name: string;
  client: Client;
  collection: string;
  keys: string;
  props: string[];
  salt: string; // password salt.
  password: string; // hashed password.
  alignment: string;
  roomID: string;
  load (document);
  setPassword (password: string);
  checkPassword (password: string);
  tell (input: string);
  prompt (input: string);
  disconnect ();
  setInteractive ();
}
