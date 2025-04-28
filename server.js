const express = require('express');
const path = require('path');
const db = require('./src/bot/db/db');
require('dotenv').config();

const app = express();

// Middleware: Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: JSON response headers (optional)
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Route: Fetch all guilds
app.get('/api/guilds', async (req, res) => {
  try {
    const [guilds] = await db.query('SELECT guild_id, guild_name FROM guilds');
    res.json(guilds);
  } catch (err) {
    console.error('Error fetching guilds:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route: Fetch messages per day for a guild
app.get('/api/messages-per-day/:guildId', async (req, res) => {
  const { guildId } = req.params;
  try {
    const [messages] = await db.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM message_logs
      WHERE guild_id = ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [guildId]);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages per day:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route: Fetch guild count
app.get('/api/guild-count', async (req, res) => {
  try {
    const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM guilds');
    res.json({ count });
  } catch (err) {
    console.error('Error fetching guild count:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route: Fetch top users by message count
app.get('/api/top-users/:guildId', async (req, res) => {
  const { guildId } = req.params;
  try {
    const [users] = await db.query(`
      SELECT user_id, COUNT(*) AS message_count
      FROM message_logs
      WHERE guild_id = ?
      GROUP BY user_id
      ORDER BY message_count DESC
      LIMIT 10
    `, [guildId]);
    res.json(users);
  } catch (err) {
    console.error('Error fetching top users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/usernames/:guildId', async (req, res) => {
  const { guildId } = req.params;
  try {
    const [users] = await db.query(`
      SELECT DISTINCT user_id 
      FROM (
        SELECT user_id FROM message_logs WHERE guild_id = ?
        UNION SELECT user_id FROM voice_logs WHERE guild_id = ?
        UNION SELECT user_id FROM reaction_logs WHERE guild_id = ?
      ) AS combined
    `, [guildId, guildId, guildId]);
    
    // In a real app, you'd fetch usernames from Discord API here
    // For now we'll just return IDs
    res.json(users);
  } catch (err) {
    console.error('Error fetching user IDs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route: Fetch top users by voice activity
app.get('/api/voice-activity/:guildId', async (req, res) => {
  const { guildId } = req.params;
  try {
    const [users] = await db.query(`
      SELECT 
        v.user_id,
        SUM(v.minutes) AS minutes,
        MAX(v.created_at) AS last_active
      FROM voice_logs v
      WHERE v.guild_id = ?
      GROUP BY v.user_id
      ORDER BY minutes DESC
      LIMIT 10
    `, [guildId]);
    res.json(users);
  } catch (err) {
    console.error('Error fetching voice activity:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route: Fetch top users by reaction activity
app.get('/api/reaction-activity/:guildId', async (req, res) => {
  const { guildId } = req.params;
  try {
    const [users] = await db.query(`
      SELECT 
        r.user_id,
        COUNT(*) AS reactions,
        MAX(r.created_at) AS last_active
      FROM reaction_logs r
      WHERE r.guild_id = ?
      GROUP BY r.user_id
      ORDER BY reactions DESC
      LIMIT 10
    `, [guildId]);
    res.json(users);
  } catch (err) {
    console.error('Error fetching reaction activity:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
