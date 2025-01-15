import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUploader = ({ onDataProcessed }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetData = workbook.SheetNames.map((sheetName) => ({
        sheetName,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
      }));
      onDataProcessed(sheetData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="file-uploader text-center">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
};

export default FileUploader;
