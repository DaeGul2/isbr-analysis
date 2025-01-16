import React, { useState } from 'react';

const ColumnSelectionStep = ({ selectedSheets, onConfirm, onBack }) => {
  const [sheetSelections, setSheetSelections] = useState(
    selectedSheets.map((sheet) => ({
      sheetName: sheet.sheetName,
      selectedColumns: [],
      isFinalStep: false,
    }))
  );

  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  const handleColumnToggle = (sheetName, columnName) => {
    setSheetSelections((prev) =>
      prev.map((sheet) =>
        sheet.sheetName === sheetName
          ? {
              ...sheet,
              selectedColumns: sheet.selectedColumns.includes(columnName)
                ? sheet.selectedColumns.filter((col) => col !== columnName)
                : [...sheet.selectedColumns, columnName],
            }
          : sheet
      )
    );
  };

  const handleFinalStepToggle = (sheetName) => {
    setSheetSelections((prev) =>
      prev.map((sheet) => ({
        ...sheet,
        isFinalStep: sheet.sheetName === sheetName ? !sheet.isFinalStep : false,
      }))
    );
  };

  const handleConfirm = () => {
    const allSheetsValid = sheetSelections.every(
      (sheet) => sheet.selectedColumns.length > 0
    );
    const finalStepCount = sheetSelections.filter((sheet) => sheet.isFinalStep)
      .length;

    if (!allSheetsValid) {
      alert('모든 시트에서 최소 하나 이상의 열을 선택해야 합니다.');
      return;
    }
    if (finalStepCount !== 1) {
      alert('최종 단계 시트를 정확히 하나만 선택해야 합니다.');
      return;
    }

    onConfirm(sheetSelections); // 선택 데이터를 부모 컴포넌트로 전달
  };

  const activeSheet = selectedSheets[activeSheetIndex];
  const activeSheetSelection = sheetSelections[activeSheetIndex];
  const excludedColumns = ['연번', '수험번호', '지원분야', '결과'];

  const columns = Object.keys(activeSheet.data[0] || {}).filter(
    (col) => !excludedColumns.includes(col)
  );

  return (
    <div className="full-screen-step">
      <div className="tabs">
        {selectedSheets.map((sheet, index) => (
          <button
            key={index}
            className={`tab ${index === activeSheetIndex ? 'active' : ''}`}
            onClick={() => setActiveSheetIndex(index)}
          >
            {sheet.sheetName}
          </button>
        ))}
      </div>
      <div className="final-step">
        <input
          type="checkbox"
          id="final-step"
          checked={activeSheetSelection.isFinalStep}
          onChange={() => handleFinalStepToggle(activeSheet.sheetName)}
        />
        <label htmlFor="final-step">이 시트가 최종 단계입니까?</label>
      </div>
      <div className="data-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>
                  <input
                    type="checkbox"
                    id={`col-${index}`}
                    checked={activeSheetSelection.selectedColumns.includes(col)}
                    onChange={() => handleColumnToggle(activeSheet.sheetName, col)}
                  />
                  <label htmlFor={`col-${index}`}>{col}</label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeSheet.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{row[col]}</td>
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
        <button className="btn btn-primary" onClick={handleConfirm}>
          다음 단계로 이동
        </button>
      </div>
    </div>
  );
};

export default ColumnSelectionStep;
