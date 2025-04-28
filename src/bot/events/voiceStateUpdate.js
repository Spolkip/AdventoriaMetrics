const { Events } = require('discord.js');
const db = require('../db/db');

const voiceSessions = new Map();

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState, client) {
    const userId = newState.id;
    const guildId = newState.guild.id;
    const username = newState.member?.user?.username || 'Unknown';
    const sessionKey = `${guildId}_${userId}`;

    // User joins a voice channel
    if (!oldState.channelId && newState.channelId) {
      voiceSessions.set(sessionKey, {
        startTime: Date.now(),
        username: username
      });
    }

    // User leaves a voice channel
    if (oldState.channelId && !newState.channelId) {
      const session = voiceSessions.get(sessionKey);
      if (session) {
        const endTime = Date.now();
        const durationMinutes = Math.floor((endTime - session.startTime) / (1000 * 60));
        
        if (durationMinutes > 0) {
          try {
            await db.query(`
              INSERT INTO voice_logs 
                (guild_id, user_id, username, minutes, session_start, session_end)
              VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))
            `, [
              guildId, 
              userId,
              session.username,
              durationMinutes,
              Math.floor(session.startTime / 1000),
              Math.floor(endTime / 1000)
            ]);
          } catch (err) {
            console.error('Error logging voice minutes:', err);
          }
        }
        
        voiceSessions.delete(sessionKey);
      }
    }
  }
};