import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Colors
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Colors
);

const TopUsersChart = ({ guildId }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!guildId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/top-users/${guildId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [guildId]);

  const chartData = {
    labels: userData.map(item => item.username || `User ${item.user_id}`),
    datasets: [
      {
        label: 'Messages',
        data: userData.map(item => item.message_count),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Messages',
          color: '#e0e0e0'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e0e0e0'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#e0e0e0'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      {loading ? (
        <div className="loading">Loading user data...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : userData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="loading">No user data available</div>
      )}
    </div>
  );
};

export default TopUsersChart;