import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileUploader from './components/FileUploader';

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Excel Data Analytics</h1>
      <FileUploader />
    </div>
  );
}

export default App;
