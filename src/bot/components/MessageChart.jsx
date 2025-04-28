import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Colors
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Colors
);

const MessageChart = ({ guildId }) => {
  const [messageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!guildId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/messages-per-day/${guildId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessageData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching message data:', err);
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
    labels: messageData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Messages per Day',
        data: messageData.map(item => item.count),
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
        <div className="loading">Loading message data...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : messageData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="loading">No message data available</div>
      )}
    </div>
  );
};

export default MessageChart;