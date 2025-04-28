const db = require('../db/db');

module.exports = {
  name: 'guildCreate',
  async execute(guild, client) {
    try {
      await db.query('INSERT INTO guilds (guild_id, guild_name) VALUES (?, ?)', [guild.id, guild.name]);
      console.log(`Joined guild: ${guild.name} (${guild.id})`);
    } catch (error) {
      console.error('Error inserting new guild:', error);
    }
  }
};
