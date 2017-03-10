import Player from './player';

export default async function (player: Player): Promise<void> {
  player.tell(`A new player!`);

  // Password.
  const password = await player.promptPassword(`What is your password? `);
  const passwordConfirm = await player.promptPassword(`What is your password (confirm)? `);

  if (password !== passwordConfirm) {
    player.tell(`Passwords did not match.`);
    return player.disconnect();
  }

  player.setPassword(password);

  // Alignment.
  let alignment = await player.prompt(`What is your alignment, good or evil? `);
  while (alignment !== 'good' && alignment !== 'evil') {
    player.tell(`That's not a valid choice. Enter good or evil.`);
    alignment = await player.prompt(`What is your alignment, good or evil? `);
  }

  player.alignment = alignment;
  await player.save();
};
