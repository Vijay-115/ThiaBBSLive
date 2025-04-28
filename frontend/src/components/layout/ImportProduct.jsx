import React, { useRef, useState } from "react";

const ImportProduct = ({ setIsImportModalOpen, onImport }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // ✅ Store the actual file object
    }
  };

  const formatFileSize = (size) => {
    const units = ["B", "KB", "MB", "GB"];
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    setImportSuccess(false);
    
    const success = await onImport(selectedFile); // ✅ Await the response
    if (success.status === 200) {
      setTimeout(() => {
        setIsImporting(false);
        setImportSuccess(true);
        setTimeout(() => {
          setImportSuccess(false);
          setIsImportModalOpen(false);
        }, 1500);
      }, 1000);
    } else {
      setIsImporting(false);
      alert("Import failed. Please try again.", success.message);
    }
  };

  return (
    <div id="importProduct">
      <h2 className="text-center text-lg font-semibold mb-3">Upload File</h2>
      <div className="container">
        <div className="file-input-box">
          <div className="wrapper-file-input">
            <div className="input-box" onClick={openFileInput}>
              <h4>
                <i className="fa-solid fa-upload"></i> Choose File to Upload
              </h4>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".zip" // ✅ Restrict file type
                onChange={handleFileChange}
              />
            </div>
            <small className="text-gray-500 font-light">Files Supported: CSV</small>
          </div>

          {selectedFile && (
            <div className="wrapper-file-section">
              <div className="selected-file">
                <h5 className="text-sm font-semibold mt-1 mb-1">Selected File</h5>
                <div className="file-info">
                  <span className="name">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </span>
                </div>
              </div>
              <button className="btn-import mt-6 mx-auto" onClick={handleImport} disabled={isImporting}>
                {isImporting ? "Importing..." : "Import"}
              </button>
              
              {/* ✅ Loading Animation */}
              {isImporting && <div className="loading-animation">⏳ Importing...</div>}

              {/* ✅ Success Message */}
              {importSuccess && <p className="success-message">✅ Import Successful!</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportProduct;