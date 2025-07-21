// BulkUpload.js
import React, { useState } from 'react';
import { Card, Form, Button, Alert, Table } from 'react-bootstrap';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewData, setPreviewData] = useState([]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const fileType = uploadedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx'].includes(fileType)) {
      setUploadStatus('❌ Only CSV or Excel files are supported.');
      return;
    }

    setFile(uploadedFile);
    setUploadStatus('Preview ready. This is mock data — parsing not implemented.');
    
    // Dummy preview
    setPreviewData([
      { title: 'Product A', price: 100, stock: 20 },
      { title: 'Product B', price: 150, stock: 15 },
      { title: 'Product C', price: 200, stock: 0 },
      { title: 'Product D', price: 90, stock: 8 },
      { title: 'Product E', price: 300, stock: 5 },
    ]);
  };

  const handleUpload = () => {
    if (!file) {
      setUploadStatus('❌ Please select a file first.');
      return;
    }

    // Here you would call backend API
    setUploadStatus('✅ File uploaded and processed successfully (mock).');
  };

  const handleTemplateDownload = () => {
    // For now, mock a download alert
    alert('📄 Template Download: You can generate a real CSV in backend.');
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>📁 Bulk Product Upload</Card.Title>

        <Form.Group controlId="bulkFile" className="mb-3">
          <Form.Label>Upload CSV or Excel file</Form.Label>
          <Form.Control type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
        </Form.Group>

        {uploadStatus && <Alert variant={uploadStatus.startsWith('✅') ? 'success' : 'danger'}>{uploadStatus}</Alert>}

        {previewData.length > 0 && (
          <div className="mb-3">
            <h6>🔍 Preview (First 5 Rows):</h6>
            <Table striped bordered size="sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.title}</td>
                    <td>{row.price}</td>
                    <td>{row.stock}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="outline-secondary" onClick={handleTemplateDownload}>📄 Download Template</Button>
          <Button variant="primary" onClick={handleUpload}>🚀 Upload & Import</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BulkUpload;
