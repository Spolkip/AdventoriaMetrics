const { Events } = require('discord.js');
const db = require('../db/db');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();
      if (user.partial) await user.fetch();

      if (user.bot) return;
      if (!reaction.message.guild) return;

      const { guild, channel, id: messageId } = reaction.message;
      const emoji = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;
      const username = user.username;

      await db.query(
        `INSERT INTO reaction_logs 
          (guild_id, channel_id, user_id, username, message_id, emoji, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [guild.id, channel.id, user.id, username, messageId, emoji]
      );

    } catch (error) {
      console.error('Error in MessageReactionAdd:', error);
    }
  },
};