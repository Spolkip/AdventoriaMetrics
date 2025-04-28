const db = require('../db/db');

module.exports = {
  name: 'guildDelete',
  async execute(guild, client) {
    try {
      await db.query('DELETE FROM guilds WHERE guild_id = ?', [guild.id]);
      console.log(`Left guild: ${guild.id}`);
    } catch (error) {
      console.error('Error deleting guild:', error);
    }
  }
};
