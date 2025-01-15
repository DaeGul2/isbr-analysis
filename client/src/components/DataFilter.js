import React, { useState } from 'react';

const DataFilter = ({ columns, onFilterApply }) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [topPercent, setTopPercent] = useState(10);

  const handleApplyFilter = () => {
    onFilterApply({ selectedGroups, selectedColumns, topPercent });
  };

  return (
    <div className="data-filter">
      <h4>데이터 필터링</h4>
      <div>
        <label>데이터군 선택:</label>
        <input type="checkbox" value={2} onChange={(e) => setSelectedGroups([...selectedGroups, +e.target.value])} /> 최종합격자
        <input type="checkbox" value={1} onChange={(e) => setSelectedGroups([...selectedGroups, +e.target.value])} /> 해당전형 합격자
        <input type="checkbox" value={0} onChange={(e) => setSelectedGroups([...selectedGroups, +e.target.value])} /> 해당전형 불합격자
      </div>
      <div>
        <label>분석할 컬럼 선택:</label>
        {columns.map((col) => (
          <label key={col}>
            <input type="checkbox" value={col} onChange={(e) => setSelectedColumns([...selectedColumns, e.target.value])} />
            {col}
          </label>
        ))}
      </div>
      <div>
        <label>상위 %:</label>
        <input type="number" value={topPercent} onChange={(e) => setTopPercent(+e.target.value)} />
      </div>
      <button onClick={handleApplyFilter}>적용</button>
    </div>
  );
};

export default DataFilter;
