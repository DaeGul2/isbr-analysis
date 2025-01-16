import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUploadStep = ({ onDataUploaded, showBackButton, onBack }) => {
  const [fileName, setFileName] = useState(null);
  const [sheetsData, setSheetsData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheets = workbook.SheetNames.map((sheetName) => ({
          sheetName,
          data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
        }));
        setSheetsData(sheets); // 데이터를 임시 저장
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleStartAnalysis = () => {
    if (sheetsData) {
      onDataUploaded(sheetsData); // "분석 시작" 버튼 클릭 시 부모 컴포넌트로 데이터 전달
    }
  };

  return (
    <div className="file-upload-step text-center">
      <h1>데이터 분석 시작</h1>
      <p>분석하고 싶은 엑셀 파일을 업로드하세요.</p>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ display: 'block', margin: '20px auto' }}
      />
      {fileName && <p>업로드된 파일: <strong>{fileName}</strong></p>}
      <div>
        {showBackButton && (
          <button
            className="btn btn-secondary"
            onClick={onBack}
            style={{ marginRight: '10px' }}
          >
            이전 단계로 돌아가기
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={handleStartAnalysis}
          disabled={!sheetsData} // 데이터가 없으면 버튼 비활성화
        >
          분석 시작
        </button>
      </div>
    </div>
  );
};

export default FileUploadStep;
