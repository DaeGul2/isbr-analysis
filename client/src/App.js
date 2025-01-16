import React, { useState } from 'react';
import FileUploadStep from './components/FileUploadStep';
import SheetSelectionStep from './components/SheetSelectionStep';
import DataViewStep from './components/DataViewStep';
import ColumnSelectionStep from './components/ColumnSelectionStep';
import './styles/App.css';

function App() {
  const [step, setStep] = useState(1); // 현재 단계
  const [sheets, setSheets] = useState(null); // 업로드된 전체 시트 데이터
  const [selectedSheets, setSelectedSheets] = useState(null); // 선택된 시트 데이터
  const [columnSelections, setColumnSelections] = useState(null); // 컬럼 선택 결과

  const handleDataUploaded = (data) => {
    setSheets(data); // 업로드된 시트 데이터를 상태에 저장
    setStep(2); // 2단계로 이동
  };

  const handleSheetsSelected = (selected) => {
    setSelectedSheets(selected); // 선택된 시트 데이터 저장
    setStep(3); // 3단계로 이동
  };

  const handleColumnSelections = (selections) => {
    setColumnSelections(selections); // 컬럼 선택 결과 저장
    setStep(5); // 다음 단계로 이동
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1)); // 이전 단계로 이동
    if (step === 2) setSheets(null); // 1단계로 돌아가면 시트 데이터 초기화
    if (step === 3) setSelectedSheets(null); // 2단계로 돌아가면 선택된 시트 데이터 초기화
  };

  return (
    <div className="App">
      {step === 1 && (
        <FileUploadStep
          onDataUploaded={handleDataUploaded}
          showBackButton={false}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <SheetSelectionStep
          sheets={sheets}
          onSheetsSelected={handleSheetsSelected}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <DataViewStep
          selectedSheets={selectedSheets}
          onConfirm={() => setStep(4)}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <ColumnSelectionStep
          selectedSheets={selectedSheets}
          onConfirm={handleColumnSelections}
          onBack={handleBack}
        />
      )}
      {step === 5 && (
        <div className="text-center full-screen-step">
          <h1>분석 준비 완료</h1>
          <p>선택된 컬럼과 데이터를 바탕으로 분석을 시작합니다!</p>
          <button className="btn btn-secondary" onClick={handleBack}>
            이전 단계로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
