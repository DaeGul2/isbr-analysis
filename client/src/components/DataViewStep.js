import React, { useState } from 'react';

const DataViewStep = ({ selectedSheets, onConfirm, onBack }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  const handleSheetChange = (index) => {
    setActiveSheetIndex(index); // 현재 활성화된 시트 인덱스를 변경
  };

  const currentSheetData = selectedSheets[activeSheetIndex]?.data || [];

  return (
    <div className="full-screen-step">
      <div className="tabs">
        {selectedSheets.map((sheet, index) => (
          <button
            key={index}
            className={`tab ${index === activeSheetIndex ? 'active' : ''}`}
            onClick={() => handleSheetChange(index)}
          >
            {sheet.sheetName}
          </button>
        ))}
      </div>
      <div className="data-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              {Object.keys(currentSheetData[0] || {}).map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentSheetData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-group">
        <button className="btn btn-secondary" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          해당 데이터로 확정하기
        </button>
      </div>
    </div>
  );
};

export default DataViewStep;
