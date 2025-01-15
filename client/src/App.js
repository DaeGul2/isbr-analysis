import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import DataFilter from './components/DataFilter';
import Chart from './components/Chart';
import SummaryStats from './components/SummaryStats';
import { filterDataByGroup, calculateStatistics } from './services/dataService';
import './styles/App.css'

function App() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState([]);

  const handleDataProcessed = (uploadedData) => {
    setData(uploadedData[0].data); // 첫 번째 시트 데이터 사용
  };

  const handleFilterApply = ({ selectedGroups, selectedColumns, topPercent }) => {
    const filteredData = filterDataByGroup(data, selectedGroups);
    const statistics = calculateStatistics(filteredData, selectedColumns);
    setStats(statistics);
  };

  return (
    <div className="container">
      <h1>Excel Data Analytics</h1>
      <FileUploader onDataProcessed={handleDataProcessed} />
      <DataFilter columns={Object.keys(data[0] || {})} onFilterApply={handleFilterApply} />
      {stats.length > 0 && <SummaryStats stats={stats} />}
      {stats.length > 0 && <Chart data={stats} />}
    </div>
  );
}

export default App;
