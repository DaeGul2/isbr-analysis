import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import '../styles/ColumnAnalysisStep.css';
import GraphComponent from './GraphComponent';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ColumnAnalysisStep = ({ sheetSelections, onBack, onNext }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0); // 현재 선택된 시트
  const [analysisState, setAnalysisState] = useState({}); // 시트별 단계별 상태
  const [currentStep, setCurrentStep] = useState(0); // 현재 분석 단계

  const steps = ['기본 통계 분석 결과', '대상별 평균 비교 그래프', '점수 분포표'];

  const activeSelection = sheetSelections[activeSheetIndex];
  const isFinalStep = activeSelection.isFinalStep;
  const data = activeSelection.data || [];

  const getCurrentState = () => {
    const sheetState = analysisState[activeSheetIndex] || {};
    return sheetState[currentStep] || { selectedTargets: [] };
  };

  const setCurrentState = (newState) => {
    setAnalysisState((prev) => {
      const sheetState = prev[activeSheetIndex] || {};
      return {
        ...prev,
        [activeSheetIndex]: {
          ...sheetState,
          [currentStep]: newState,
        },
      };
    });
  };

  const toggleTargetSelection = (target) => {
    const currentState = getCurrentState();
    const updatedTargets = currentState.selectedTargets.includes(target)
      ? currentState.selectedTargets.filter((t) => t !== target)
      : [...currentState.selectedTargets, target];
    setCurrentState({ ...currentState, selectedTargets: updatedTargets });
  };

  const getTargetNameWithCount = (target) => {
    const nameMap = {
      fail: '탈락자',
      pass_not_final: '합격자 (최종 탈락)',
      final_pass: '최종 합격자',
      all_pass: '전체 합격자',
      not_final: '최종 탈락자',
      all: '전체 응시자',
      final_fail: '최종 탈락자',
      final_all: '최종 전체 응시자',
    };

    const filteredData = filterDataByTarget(target);
    return `${nameMap[target] || '대상'} (${filteredData.length}명)`;
  };

  const filterDataByTarget = (target) => {
    const cleanData = data.map((row) => {
      let resultValue = row['결과'];
      if (typeof resultValue === "string") {
        resultValue = resultValue.replace(/[^0-9.-]/g, "");
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

    return filteredData;
  };

  const calculateStatistics = (filteredData, column) => {
    const values = filteredData
      .map((row) => {
        let value = row[column];
        if (typeof value === "string") {
          value = value.replace(/,/g, "");
          value = parseFloat(value);
        }
        return Number.isFinite(value) ? value : null;
      })
      .filter((value) => value !== null);

    return {
      mean: d3.mean(values) || 0,
      median: d3.median(values) || 0,
      stdDev: d3.deviation(values) || 0,
      variance: d3.variance(values) || 0,
      min: d3.min(values) || 0,
      max: d3.max(values) || 0,
    };
  };

  const generateStatisticsTable = () => {
    const stats = {};
    const currentState = getCurrentState();
    const selectedTargets = currentState.selectedTargets;

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

  const renderScoreDistribution = () => {
    const currentState = getCurrentState();
    const selectedTargets = currentState.selectedTargets;

    const scoreData = selectedTargets.map((target) => {
      const filteredData = filterDataByTarget(target);
      return {
        target,
        scores: filteredData.map((row) => row['점수'] || 0).filter((score) => Number.isFinite(score)),
      };
    });

    return (
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ textAlign: 'center' }}>점수 분포표</h3>
        {scoreData.map(({ target, scores }) => (
          <div key={target} style={{ marginBottom: '20px' }}>
            <h4>{getTargetNameWithCount(target)}</h4>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg width="500" height="300">
                {d3.bin()
                  .thresholds(10)(scores)
                  .map((bin, i) => (
                    <rect
                      key={i}
                      x={(i * 50)}
                      y={300 - bin.length * 10}
                      width="50"
                      height={bin.length * 10}
                      fill="steelblue"
                    />
                  ))}
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStatisticsGraphs = () => {
    return (
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>대상별 평균 비교 그래프</h3>
          {getCurrentState().selectedTargets.length > 0 && (
            <GraphComponent
              statsTable={statsTable}
              selectedTargets={getCurrentState().selectedTargets}
              selectedMetrics={['mean']}
              title="대상별 평균 비교"
            />
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>대상별 최대값, 최소값 그래프</h3>
          {getCurrentState().selectedTargets.length > 0 && (
            <GraphComponent
              statsTable={statsTable}
              selectedTargets={getCurrentState().selectedTargets}
              selectedMetrics={['max', 'min']}
              title="대상별 최대값과 최소값"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box', backgroundColor: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {sheetSelections.map((sheet, index) => (
          <button
            key={index}
            style={{
              padding: '10px 20px',
              margin: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: index === activeSheetIndex ? '#007bff' : '#f1f1f1',
              color: index === activeSheetIndex ? 'white' : 'black',
              cursor: 'pointer',
            }}
            onClick={() => setActiveSheetIndex(index)}
          >
            {sheet.sheetName}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3>대상 선택</h3>
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {isFinalStep
            ? ["final_fail", "final_pass", "final_all"].map((target) => (
                <label key={target} style={{ margin: '0 15px', fontSize: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    value={target}
                    checked={getCurrentState().selectedTargets.includes(target)}
                    onChange={() => toggleTargetSelection(target)}
                    style={{ marginRight: '5px' }}
                  />
                  {getTargetNameWithCount(target)}
                </label>
              ))
            : ["fail", "pass_not_final", "final_pass", "all_pass", "not_final", "all"].map((target) => (
                <label key={target} style={{ margin: '0 15px', fontSize: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    value={target}
                    checked={getCurrentState().selectedTargets.includes(target)}
                    onChange={() => toggleTargetSelection(target)}
                    style={{ marginRight: '5px' }}
                  />
                  {getTargetNameWithCount(target)}
                </label>
              ))}
        </div>
      </div>

      {currentStep === 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>기초 통계 결과</h3>
          <table className="table table-striped table-bordered text-center" style={{ marginTop: '10px' }}>
            <thead className="thead-dark">
              <tr>
                <th>컬럼명</th>
                {getCurrentState().selectedTargets.map((target) => (
                  <th key={target}>{getTargetNameWithCount(target)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(statsTable).map((column) => (
                <tr key={column}>
                  <td>{column}</td>
                  {getCurrentState().selectedTargets.map((target) => (
                    <td key={target}>
                      평균: {statsTable[column][target]?.mean.toFixed(2)} <br />
                      중앙값: {statsTable[column][target]?.median.toFixed(2)} <br />
                      표준편차: {statsTable[column][target]?.stdDev.toFixed(2)} <br />
                      최소값: {statsTable[column][target]?.min.toFixed(2)} <br />
                      최대값: {statsTable[column][target]?.max.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentStep === 1 && renderStatisticsGraphs()}

      {currentStep === 2 && renderScoreDistribution()}

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'fixed', bottom: '10px', width: '90%', margin: '0 auto' }}>
        <button
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          이전 분석 단계
        </button>
        <button
          onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          다음 분석 단계
        </button>
      </div>
    </div>
  );
};

export default ColumnAnalysisStep;
