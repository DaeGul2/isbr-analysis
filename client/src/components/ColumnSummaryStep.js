import React from 'react';

const ColumnSummaryStep = ({ sheetSelections, onBack, onNext }) => {
  if (!sheetSelections) {
    return (
      <div className="full-screen-step">
        <h1>데이터 없음</h1>
        <p>필요한 데이터가 없습니다. 이전 단계로 돌아가 데이터를 확인하세요.</p>
        <button className="btn btn-secondary" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="full-screen-step">
      {/* 제목 */}
      <h1 className="text-center mb-4">컬럼 선택 요약</h1>

      {/* 시트별 요약 카드 */}
      <div className="summary-cards">
        {sheetSelections.map((sheet, index) => (
          <div key={index} className="card mb-4">
            <div className="card-header">
              <h2 className="card-title">{sheet.sheetName}</h2>
            </div>
            <div className="card-body">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>선택된 컬럼</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.selectedColumns.map((column, colIndex) => (
                    <tr key={colIndex}>
                      <td>{column}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="button-group text-center">
        <button className="btn btn-secondary mx-2" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
        <button className="btn btn-primary mx-2" onClick={onNext}>
          다음 단계로 이동
        </button>
      </div>
    </div>
  );
};

export default ColumnSummaryStep;
