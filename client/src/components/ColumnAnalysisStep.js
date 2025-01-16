import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  BoxPlotController,
  BoxAndWiskers,
  ViolinController,
} from '@sgratzl/chartjs-chart-boxplot';

// Chart.js 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxAndWiskers,
  ViolinController
);

const ColumnAnalysisStep = ({ sheets, sheetSelections, onBack, onNext }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [activeColumn, setActiveColumn] = useState(null);
  const [combineColumns, setCombineColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 로딩 상태 관리
  useEffect(() => {
    if (sheetSelections && sheetSelections.length > 0) {
      setIsLoading(false);
    }
  }, [sheetSelections]);

  if (isLoading) {
    return (
      <div className="full-screen-step">
        <h1>데이터 로드 중...</h1>
        <p>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</p>
      </div>
    );
  }

  const activeSelection = sheetSelections[activeSheetIndex];
  const activeSheet = sheets.find((sheet) => sheet.sheetName === activeSelection.sheetName);
  const selectedColumns = activeSelection.selectedColumns;

  if (!activeSheet || !activeSheet.data) {
    console.error(`시트 "${activeSelection.sheetName}"에 데이터가 없습니다.`);
    return (
      <div className="full-screen-step">
        <h1>데이터 없음</h1>
        <p>선택한 시트 "{activeSelection.sheetName}"에 데이터가 존재하지 않습니다.</p>
        <button className="btn btn-secondary" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
      </div>
    );
  }

  const calculateStatistics = (data) => {
    const mean = d3.mean(data);
    const median = d3.median(data);
    const mode = d3.mode(data);
    const min = d3.min(data);
    const max = d3.max(data);
    const range = max - min;
    const variance = d3.variance(data);
    const stdDev = d3.deviation(data);

    const q1 = d3.quantile(data, 0.25);
    const q3 = d3.quantile(data, 0.75);
    const iqr = q3 - q1;

    return { mean, median, mode, min, max, range, variance, stdDev, q1, q3, iqr };
  };

  const getColumnData = (column) => {
    return activeSheet.data.map((row) => parseFloat(row[column])).filter(Number.isFinite);
  };

  const getCombinedData = () => {
    return selectedColumns
      .map((column) => getColumnData(column))
      .reduce((acc, colData) => acc.map((value, idx) => value + (colData[idx] || 0)), new Array(getColumnData(selectedColumns[0]).length).fill(0));
  };

  const dataToAnalyze = combineColumns
    ? getCombinedData()
    : activeColumn
    ? getColumnData(activeColumn)
    : [];

  const stats = dataToAnalyze.length > 0 ? calculateStatistics(dataToAnalyze) : null;

  // 히스토그램 데이터 생성
  const createHistogramData = (data) => {
    const histogram = d3.bin().thresholds(10)(data);
    return {
      labels: histogram.map((d) => d.x0.toFixed(2)),
      datasets: [
        {
          label: '히스토그램',
          data: histogram.map((d) => d.length),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Box Plot 데이터 생성
  const createBoxPlotData = (data) => {
    return {
      labels: ['Box Plot'],
      datasets: [
        {
          label: activeColumn || '통합 데이터',
          data: [data],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // IQR 시각화 데이터 생성
  const createIQRData = (data) => {
    const { q1, q3, iqr } = stats;
    return {
      labels: ['Q1', 'Q3', 'IQR'],
      datasets: [
        {
          label: 'IQR',
          data: [q1, q3, iqr],
          backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
          borderColor: ['rgba(255, 159, 64, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="full-screen-step">
      {/* 시트 탭 */}
      <div className="tabs">
        {sheetSelections.map((selection, index) => (
          <button
            key={index}
            className={`tab ${index === activeSheetIndex ? 'active' : ''}`}
            onClick={() => setActiveSheetIndex(index)}
          >
            {selection.sheetName}
          </button>
        ))}
      </div>

      {/* 컬럼 탭 */}
      <div className="tabs">
        {selectedColumns.map((col, index) => (
          <button
            key={index}
            className={`tab ${activeColumn === col ? 'active' : ''}`}
            onClick={() => setActiveColumn(col)}
          >
            {col}
          </button>
        ))}
      </div>

      {/* 컬럼 통합 체크박스 */}
      <div className="combine-columns">
        <input
          type="checkbox"
          id="combine-columns"
          checked={combineColumns}
          onChange={() => setCombineColumns(!combineColumns)}
        />
        <label htmlFor="combine-columns">선택한 컬럼 통합</label>
      </div>

      {/* 분석 결과 */}
      <div className="analysis-results">
        {stats ? (
          <>
            <h3>기초 통계분석</h3>
            <Bar
              data={{
                labels: ['평균', '중앙값', '최빈값', '최소값', '최대값', '범위', '분산', '표준편차'],
                datasets: [
                  {
                    label: '기초 통계량',
                    data: [
                      stats.mean,
                      stats.median,
                      stats.mode,
                      stats.min,
                      stats.max,
                      stats.range,
                      stats.variance,
                      stats.stdDev,
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                ],
              }}
            />

            <h3>점수 분포의 모양과 이상치 탐지</h3>
            <Bar data={createHistogramData(dataToAnalyze)} />
            <Bar data={createBoxPlotData(dataToAnalyze)} />

            <h3>점수 데이터의 변동성 및 퍼짐 정도 측정</h3>
            <Bar data={createIQRData(dataToAnalyze)} />
          </>
        ) : (
          <p>유효한 데이터를 선택하세요.</p>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="button-group">
        <button className="btn btn-secondary" onClick={onBack}>
          이전 단계로 돌아가기
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          다음 단계로 이동
        </button>
      </div>
    </div>
  );
};

export default ColumnAnalysisStep;
