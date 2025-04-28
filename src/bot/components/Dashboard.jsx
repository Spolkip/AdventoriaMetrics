import React, { useState, useEffect } from 'react';
import GuildSelector from './GuildSelector';
import MessageChart from './MessageChart';
import VoiceChart from './VoiceChart';
import ReactionChart from './ReactionChart';
import TopUsersChart from './TopUsersChart';
import GuildCountChart from './GuildCountChart';

const Dashboard = () => {
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [guildCount, setGuildCount] = useState(0);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const response = await fetch('/api/guilds');
        const data = await response.json();
        setGuilds(data);
        
        const countResponse = await fetch('/api/guild-count');
        const countData = await countResponse.json();
        setGuildCount(countData.count);
      } catch (error) {
        console.error('Error fetching guilds:', error);
      }
    };

    fetchGuilds();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="card">
        <GuildSelector 
          guilds={guilds} 
          onSelect={setSelectedGuild} 
        />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <MessageChart guildId={selectedGuild} />
        </div>

        <div className="card">
          <GuildCountChart count={guildCount} />
        </div>

        <div className="card">
          <TopUsersChart guildId={selectedGuild} />
        </div>

        <div className="card">
          <VoiceChart guildId={selectedGuild} />
        </div>

        <div className="card">
          <ReactionChart guildId={selectedGuild} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;