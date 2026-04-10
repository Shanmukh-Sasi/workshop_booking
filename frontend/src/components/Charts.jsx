import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const StateChart = ({ labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'State-wise Workshops',
      data: data,
      backgroundColor: 'rgba(102, 126, 234, 0.7)',
      borderColor: 'rgba(102, 126, 234, 1)',
      borderWidth: 1,
    }]
  };
  return <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
};

export const TypeChart = ({ labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Workshop Types',
      data: data,
      backgroundColor: ['#667eea', '#764ba2', '#11998e', '#f7971e'],
      borderWidth: 1,
    }]
  };
  return <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
};
