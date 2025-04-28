document.addEventListener('DOMContentLoaded', async () => {
  const guildSelect = document.getElementById('guildSelect');
  const messageChartCtx = document.getElementById('messageChart').getContext('2d');
  const guildChartCtx = document.getElementById('guildChart').getContext('2d');
  const topUsersChartCtx = document.getElementById('topUsersChart').getContext('2d');
  const voiceChartCtx = document.getElementById('voiceChart').getContext('2d');
  const reactionChartCtx = document.getElementById('reactionChart').getContext('2d');

  let messageChart = null;
  let topUsersChart = null;
  let voiceChart = null;
  let reactionChart = null;
  let refreshInterval = null;

  function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    let last = +new Date();
    const tick = function() {
      element.style.opacity = +element.style.opacity + (new Date() - last) / 400;
      last = +new Date();
      if (+element.style.opacity < 1) requestAnimationFrame(tick);
    };
    tick();
  }

  async function fetchAndUpdateCharts(guildId) {
    try {
      const [messagesRes, topUsersRes, voiceRes, reactionRes] = await Promise.all([
        fetch(`/api/messages-per-day/${guildId}`),
        fetch(`/api/top-users/${guildId}`),
        fetch(`/api/voice-activity/${guildId}`),
        fetch(`/api/reaction-activity/${guildId}`)
      ]);

      const messages = await messagesRes.json();
      const topUsers = await topUsersRes.json();
      const voiceActivity = await voiceRes.json();
      const reactionActivity = await reactionRes.json();

      // Messages per Day
      const messageLabels = messages.map(m => m.date);
      const messageData = messages.map(m => m.count);

      if (!messageChart) {
        messageChart = new Chart(messageChartCtx, {
          type: 'line',
          data: {
            labels: messageLabels,
            datasets: [{
              label: 'Messages per Day',
              data: messageData,
              borderColor: '#2196F3',
              fill: false,
            }]
          },
          options: { responsive: true }
        });
      } else {
        messageChart.data.labels = messageLabels;
        messageChart.data.datasets[0].data = messageData;
        messageChart.update();
      }

      // Top Users
      const userLabels = topUsers.map(u => u.user_id);
      const userMessages = topUsers.map(u => u.message_count);
        

      if (!topUsersChart) {
        topUsersChart = new Chart(topUsersChartCtx, {
          type: 'bar',
          data: {
            labels: userLabels,
            datasets: [{
              label: 'Messages',
              data: userMessages,
              backgroundColor: '#FF9800',
            }]
          },
          options: { responsive: true }
        });
      } else {
        topUsersChart.data.labels = userLabels;
        topUsersChart.data.datasets[0].data = userMessages;
        topUsersChart.update();
      }

      // Voice Activity
      const voiceLabels = voiceActivity.map(v => v.username);
      const voiceMinutes = voiceActivity.map(v => v.minutes);

      if (!voiceChart) {
        voiceChart = new Chart(voiceChartCtx, {
          type: 'bar',
          data: {
            labels: voiceLabels,
            datasets: [{
              label: 'Minutes in Voice',
              data: voiceMinutes,
              backgroundColor: '#9C27B0',
            }]
          },
          options: { responsive: true }
        });
      } else {
        voiceChart.data.labels = voiceLabels;
        voiceChart.data.datasets[0].data = voiceMinutes;
        voiceChart.update();
      }

      // Reaction Activity
      const reactionLabels = reactionActivity.map(r => r.username);
      const reactionCounts = reactionActivity.map(r => r.reactions);

      if (!reactionChart) {
        reactionChart = new Chart(reactionChartCtx, {
          type: 'bar',
          data: {
            labels: reactionLabels,
            datasets: [{
              label: 'Reactions Given',
              data: reactionCounts,
              backgroundColor: '#00BCD4',
            }]
          },
          options: { responsive: true }
        });
      } else {
        reactionChart.data.labels = reactionLabels;
        reactionChart.data.datasets[0].data = reactionCounts;
        reactionChart.update();
      }

    } catch (error) {
      console.error('Error updating charts:', error);
    }
  }

  try {
    // Fetch guilds
    const res = await fetch('/api/guilds');
    const guilds = await res.json();

    if (!guilds.length) {
      console.error('No guilds found.');
      return;
    }

    guilds.forEach(guild => {
      const option = document.createElement('option');
      option.value = guild.guild_id;
      option.textContent = guild.guild_name;
      guildSelect.appendChild(option);
    });

    // Guild count chart (static)
    const guildCountRes = await fetch('/api/guild-count');
    const guildCount = await guildCountRes.json();

    new Chart(guildChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Active Guilds'],
        datasets: [{
          label: 'Guilds',
          data: [guildCount.count],
          backgroundColor: ['#4CAF50'],
        }]
      },
      options: { responsive: true }
    });

    // When user selects a guild
    guildSelect.addEventListener('change', async (event) => {
      const guildId = event.target.value;
      if (!guildId) return;

      // Immediately load charts
      await fetchAndUpdateCharts(guildId);

      // Clear previous interval
      if (refreshInterval) clearInterval(refreshInterval);

      // Setup auto-refresh
      refreshInterval = setInterval(() => {
        fetchAndUpdateCharts(guildId);
      }, 30000); // every 30 seconds
    });

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
});
