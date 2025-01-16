import React, { useState } from 'react';
import FileUploadStep from './components/FileUploadStep';
import SheetSelectionStep from './components/SheetSelectionStep';
import ColumnSelectionStep from './components/ColumnSelectionStep';
import ColumnSummaryStep from './components/ColumnSummaryStep';
import ColumnAnalysisStep from './components/ColumnAnalysisStep';
import './styles/App.css';

function App() {
  const [step, setStep] = useState(1); // 현재 단계
  const [sheets, setSheets] = useState(null); // 업로드된 전체 시트 데이터 (원본)
  const [selectedSheets, setSelectedSheets] = useState(null); // 선택된 시트 정보
  const [sheetSelections, setSheetSelections] = useState(null); // 컬럼 선택 결과

  const handleDataUploaded = (data) => {
    console.log("Uploaded Sheets:", data); // 디버깅용
    setSheets(data); // 업로드된 데이터를 원본으로 저장
    setStep(2); // 2단계로 이동
  };

  const handleSheetsSelected = (selected) => {
    console.log("Selected Sheets:", selected); // 디버깅용
    setSelectedSheets(selected); // 선택된 시트 데이터 저장
    setStep(3); // 3단계로 이동
  };

  const handleColumnSelections = (selections) => {
    console.log("Column Selections:", selections); // 디버깅용
    const updatedSelections = selections.map((selection) => {
      const correspondingSheet = sheets.find(
        (sheet) => sheet.sheetName === selection.sheetName
      );
      return {
        ...selection,
        data: correspondingSheet?.data || [],
      };
    });
    setSheetSelections(updatedSelections); // 선택된 컬럼 정보와 데이터를 포함
    setStep(4); // 4단계로 이동
  };

  const handleNextFromSummary = () => {
    console.log("Passing SheetSelections to Step 5:", sheetSelections); // 디버깅용
    setStep(5); // 5단계로 이동
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1)); // 이전 단계로 이동
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1); // 다음 단계로 이동
  };

  return (
    <div className="App">
      {step === 1 && (
        <FileUploadStep
          onDataUploaded={handleDataUploaded}
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
        <ColumnSelectionStep
          selectedSheets={selectedSheets}
          onConfirm={handleColumnSelections}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <ColumnSummaryStep
          sheetSelections={sheetSelections}
          onNext={handleNextFromSummary}
          onBack={handleBack}
        />
      )}
      {step === 5 && (
        <ColumnAnalysisStep
          sheets={sheets} // 원본 데이터를 전달
          sheetSelections={sheetSelections} // 선택된 컬럼 정보 전달
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {step === 6 && (
        <div className="text-center full-screen-step">
          <h1>데이터 분석 완료</h1>
          <p>선택된 데이터를 기반으로 분석을 완료했습니다!</p>
          <button className="btn btn-secondary" onClick={handleBack}>
            이전 단계로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
