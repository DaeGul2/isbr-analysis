import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraphComponent = ({ statsTable, selectedTargets, selectedMetrics = ['mean'], title = '그래프' }) => {
  // x축 라벨 (컬럼명)
  const labels = Object.keys(statsTable);

  // 데이터셋 생성
  const datasets = selectedMetrics.flatMap((metric, metricIndex) => {
    return selectedTargets.map((target, targetIndex) => {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // 색상 배열
      const metricColors = colors.map(color => `${color}${50 + metricIndex * 50}`); // 메트릭별 색상
      return {
        label: `${target} (${metric})`, // legend 항목
        data: labels.map((column) => statsTable[column][target]?.[metric] || 0), // 선택된 메트릭 값
        backgroundColor: metricColors[targetIndex % colors.length], // 색상
      };
    });
  });

  // Chart.js 설정
  const chartData = {
    labels, // x축 라벨
    datasets, // 데이터셋
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '컬럼명',
        },
      },
      y: {
        title: {
          display: true,
          text: '값',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GraphComponent;
