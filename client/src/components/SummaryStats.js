import React from 'react';

const SummaryStats = ({ stats }) => {
  return (
    <div className="summary-stats">
      <h4>통계 요약</h4>
      <ul>
        {stats.map((item) => (
          <li key={item.column}>
            <strong>{item.column}</strong>: 평균 {item.mean}, 중앙값 {item.median}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryStats;
