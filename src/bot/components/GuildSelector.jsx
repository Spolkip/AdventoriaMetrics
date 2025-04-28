import React from 'react';

const GuildSelector = ({ guilds, onSelect }) => {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    onSelect(selectedId === '' ? null : selectedId);
  };

  return (
    <div className="guild-selector">
      <h2>Select a Guild</h2>
      <select onChange={handleChange} defaultValue="">
        <option value="">-- Choose a Guild --</option>
        {guilds.map(guild => (
          <option key={guild.guild_id} value={guild.guild_id}>
            {guild.guild_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GuildSelector;