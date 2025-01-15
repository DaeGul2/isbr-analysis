import React from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.column),
    datasets: [
      {
        label: '평균',
        data: data.map((item) => item.mean),
        backgroundColor: 'rgba(75,192,192,0.4)',
      },
      {
        label: '중앙값',
        data: data.map((item) => item.median),
        backgroundColor: 'rgba(153,102,255,0.4)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default Chart;
