import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Alert, Image } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import '../styles/Button.css';
import '../styles/ImageUploadPage.css';

function ImageUpload({ authToken, addImage, handleLogout }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(authToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        handleLogout();
      }
    } catch (error) {
      console.error("Invalid token", error);
      handleLogout();
    }
  }, [authToken, handleLogout]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://pet-medical-histoy-n0uny5i36-mks-projects-119eb587.vercel.app', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        },
      });
      addImage({ file: selectedFile, interpretation: response.data });
      setUploadStatus('업로드가 완료되었습니다!');
    } catch (error) {
      console.error('Error uploading the file:', error);
      setUploadStatus('업로드에 실패했습니다.');
    }
  };

  return (
    <div className="upload-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
          <label htmlFor="file-input" className="button">이미지 불러오기</label>
        </Form.Group>
        {preview && (
          <div className="mb-3">
            <Image src={preview} thumbnail style={{ width: '280px', height: '400px' }} />
          </div>
        )}
        <button type="submit" className="button upload-button">
          업로드
        </button>
      </Form>
      {uploadStatus && (
        <Alert variant={uploadStatus.includes('완료') ? 'success' : 'danger'} className="mt-3">
          {uploadStatus}
        </Alert>
      )}
    </div>
  );
}

export default ImageUpload;
