import React from 'react';
import { Bar } from 'react-chartjs-2';
import "chart.js/auto";

const RevenueChart: React.FC= () => {

  const data = {
    labels: ["January",
      "February","March","April","May","June","July","August","September","October","November","December"],
    datasets: [
      {
        label: 'Revenue',
        data: [200, 300, 400, 500, 600, 700, 800,900,1000, 1100,1200, 1300],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-4xl md:max-w-xl bg-white rounded p-5">
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
