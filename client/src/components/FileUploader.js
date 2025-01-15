import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUploader = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
      console.log(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="text-center">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <pre>{data.length > 0 && JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FileUploader;
