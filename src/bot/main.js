const { Client, GatewayIntentBits } = require('discord.js');
const db = require('./db/db');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates
  ],
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Connected to ${client.guilds.cache.size} guild(s)!`);

  // Optional: sync all existing guilds into DB (if needed on bot restart)
  for (const [guildId, guild] of client.guilds.cache) {
    await db.query('INSERT IGNORE INTO guilds (guild_id, guild_name) VALUES (?, ?)', [guildId, guild.name]);
  }
});

client.events = new Map();
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.name && event.execute) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

client.login(process.env.TOKEN);

module.exports = { client };
