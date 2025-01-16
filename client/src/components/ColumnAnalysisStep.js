import React, { useState } from 'react';
import * as d3 from 'd3';
import '../styles/ColumnAnalysisStep.css';

const ColumnAnalysisStep = ({ sheetSelections, onBack, onNext }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0); // 현재 선택된 시트
  const [selectedTargets, setSelectedTargets] = useState([]); // 분석할 대상 그룹

  const activeSelection = sheetSelections[activeSheetIndex];
  const isFinalStep = activeSelection.isFinalStep;
  const data = activeSelection.data || [];

  console.log("Active Sheet Data:", data);

  // '결과' 기준 데이터 필터링 함수
  const filterDataByTarget = (target) => {
    const cleanData = data.map((row) => {
      // '결과' 값을 숫자로 변환
      let resultValue = row['결과']; 
      if (typeof resultValue === "string") {
        resultValue = resultValue.replace(/[^0-9.-]/g, ""); // 숫자가 아닌 문자 제거
        resultValue = parseFloat(resultValue);
      }
      return { ...row, 결과: Number.isFinite(resultValue) ? resultValue : null };
    });

    let filteredData = [];
    if (isFinalStep) {
      if (target === "final_fail") filteredData = cleanData.filter((row) => row.결과 === 0);
      if (target === "final_pass") filteredData = cleanData.filter((row) => row.결과 === 1);
      if (target === "final_all") filteredData = cleanData.filter((row) => row.결과 === 0 || row.결과 === 1);
    } else {
      if (target === "fail") filteredData = cleanData.filter((row) => row.결과 === 0);
      if (target === "pass_not_final") filteredData = cleanData.filter((row) => row.결과 === 1);
      if (target === "final_pass") filteredData = cleanData.filter((row) => row.결과 === 2);
      if (target === "all_pass") filteredData = cleanData.filter((row) => row.결과 >= 1);
      if (target === "not_final") filteredData = cleanData.filter((row) => row.결과 <= 1);
      if (target === "all") filteredData = cleanData.filter((row) => row.결과 >= 0);
    }

    console.log(`Target: ${target}, Filtered Data:`, filteredData);
    return filteredData;
  };

  // 기본 통계량 계산 함수
  const calculateStatistics = (filteredData, column) => {
    const values = filteredData
      .map((row) => {
        let value = row[column];
        if (typeof value === "string") {
          value = value.replace(/,/g, ""); // 쉼표 제거
          value = parseFloat(value);
        }
        return Number.isFinite(value) ? value : null;
      })
      .filter((value) => value !== null);

    console.log(`Column: ${column}, Processed Values:`, values);

    return {
      mean: d3.mean(values) || 0,
      median: d3.median(values) || 0,
      stdDev: d3.deviation(values) || 0,
      variance: d3.variance(values) || 0,
      min: d3.min(values) || 0,
      max: d3.max(values) || 0,
    };
  };

  // 대상 선택 상태 업데이트
  const toggleTargetSelection = (target) => {
    setSelectedTargets((prev) =>
      prev.includes(target) ? prev.filter((t) => t !== target) : [...prev, target]
    );
  };

  // 분석 결과 생성
  const generateStatisticsTable = () => {
    const stats = {};

    selectedTargets.forEach((target) => {
      const filteredData = filterDataByTarget(target);

      activeSelection.selectedColumns.forEach((column) => {
        if (!stats[column]) stats[column] = {};
        stats[column][target] = calculateStatistics(filteredData, column);
      });
    });

    return stats;
  };

  const statsTable = generateStatisticsTable();

  return (
    <div className="full-screen-step">
      {/* 시트 탭 */}
      <div className="tabs">
        {sheetSelections.map((sheet, index) => (
          <button
            key={index}
            className={`tab ${index === activeSheetIndex ? 'active' : ''}`}
            onClick={() => setActiveSheetIndex(index)}
          >
            {sheet.sheetName}
          </button>
        ))}
      </div>

      {/* 대상 선택 */}
      <div className="target-selection mb-4">
        <h3 className="text-center mb-3">대상 선택</h3>
        <div className="d-flex justify-content-center">
          {isFinalStep ? (
            <>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="final_fail"
                  checked={selectedTargets.includes("final_fail")}
                  onChange={() => toggleTargetSelection("final_fail")}
                />
                최종 전형 탈락자
              </label>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="final_pass"
                  checked={selectedTargets.includes("final_pass")}
                  onChange={() => toggleTargetSelection("final_pass")}
                />
                최종 전형 합격자
              </label>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="final_all"
                  checked={selectedTargets.includes("final_all")}
                  onChange={() => toggleTargetSelection("final_all")}
                />
                최종 전형 전체 응시자
              </label>
            </>
          ) : (
            <>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="fail"
                  checked={selectedTargets.includes("fail")}
                  onChange={() => toggleTargetSelection("fail")}
                />
                해당 전형 탈락자
              </label>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="pass_not_final"
                  checked={selectedTargets.includes("pass_not_final")}
                  onChange={() => toggleTargetSelection("pass_not_final")}
                />
                해당 전형 합격자 (최종 탈락)
              </label>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="final_pass"
                  checked={selectedTargets.includes("final_pass")}
                  onChange={() => toggleTargetSelection("final_pass")}
                />
                최종 합격자
              </label>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="all_pass"
                  checked={selectedTargets.includes("all_pass")}
                  onChange={() => toggleTargetSelection("all_pass")}
                />
                해당 전형 전체 합격자
              </label>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="not_final"
                  checked={selectedTargets.includes("not_final")}
                  onChange={() => toggleTargetSelection("not_final")}
                />
                최종 전형 탈락자
              </label>
              <label className="mx-3">
                <input
                  type="checkbox"
                  value="all"
                  checked={selectedTargets.includes("all")}
                  onChange={() => toggleTargetSelection("all")}
                />
                해당 전형 전체 응시자
              </label>
            </>
          )}
        </div>
      </div>

      {/* 기본 통계 테이블 */}
      <div className="statistics-table">
        <h3 className="text-center mb-4">기본 통계 분석 결과</h3>
        {selectedTargets.length === 0 ? (
          <p className="text-center">분석할 대상을 선택해주세요.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>컬럼명</th>
                {selectedTargets.map((target) => (
                  <th key={target}>{target}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(statsTable).map((column) => (
                <tr key={column}>
                  <td>{column}</td>
                  {selectedTargets.map((target) => (
                    <td key={target}>
                      평균: {statsTable[column][target]?.mean.toFixed(2)} <br />
                      중앙값: {statsTable[column][target]?.median.toFixed(2)} <br />
                      표준편차: {statsTable[column][target]?.stdDev.toFixed(2)} <br />
                      분산: {statsTable[column][target]?.variance.toFixed(2)} <br />
                      최소값: {statsTable[column][target]?.min.toFixed(2)} <br />
                      최대값: {statsTable[column][target]?.max.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="button-group text-center">
        <button className="btn btn-secondary" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={selectedTargets.length === 0}
        >
          다음 단계로 이동
        </button>
      </div>
    </div>
  );
};

export default ColumnAnalysisStep;
