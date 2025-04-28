import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  Colors
} from 'chart.js';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  Colors
);

const GuildCountChart = ({ count }) => {
  const chartData = {
    labels: ['Active Guilds'],
    datasets: [
      {
        data: [count],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e0e0e0'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Active Guilds: ${context.raw}`;
          }
        }
      },
    },
    cutout: '70%',
  };

  return (
    <div className="chart-container">
      {count > 0 ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <div className="loading">No guild data available</div>
      )}
    </div>
  );
};

export default GuildCountChart;