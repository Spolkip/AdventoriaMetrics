const db = require('../db/db');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    try {
      await db.query(
        'INSERT INTO message_logs (guild_id, channel_id, user_id, message_id, created_at) VALUES (?, ?, ?, ?, NOW())',
        [message.guild.id, message.channel.id, message.author.id, message.id]
      );
    } catch (error) {
      console.error('Error inserting message log:', error);
    }
  }
};
