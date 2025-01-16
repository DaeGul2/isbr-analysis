import React, { useState } from 'react';

const SheetSelectionStep = ({ sheets, onSheetsSelected, onBack }) => {
  const [selectedSheets, setSelectedSheets] = useState([]);

  const handleCheckboxChange = (sheetName) => {
    setSelectedSheets((prev) =>
      prev.includes(sheetName)
        ? prev.filter((name) => name !== sheetName)
        : [...prev, sheetName]
    );
  };

  const handleAnalysisStart = () => {
    const selectedData = sheets.filter((sheet) =>
      selectedSheets.includes(sheet.sheetName)
    );
    onSheetsSelected(selectedData); // 선택된 시트 데이터 전달
  };

  return (
    <div className="sheet-selection-step text-center">
      <h1>시트 선택</h1>
      <p>분석에 사용할 시트를 선택하세요:</p>
      <div className="sheet-list">
        {sheets.map((sheet, index) => (
          <div key={index} className="sheet-item">
            <input
              type="checkbox"
              id={`sheet-${index}`}
              value={sheet.sheetName}
              onChange={() => handleCheckboxChange(sheet.sheetName)}
            />
            <label htmlFor={`sheet-${index}`}>{sheet.sheetName}</label>
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="btn btn-secondary" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
        <button
          className="btn btn-primary"
          onClick={handleAnalysisStart}
          disabled={selectedSheets.length === 0}
        >
          이 데이터(들) 분석하기
        </button>
      </div>
    </div>
  );
};

export default SheetSelectionStep;
