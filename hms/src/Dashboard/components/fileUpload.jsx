import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = ({ patientId }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);


  const fetchFiles = async () => {
    try {
      const response = await axios.get(`/api/files?patientId=${patientId}`); 
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('patientId', patientId); 

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUploadMessage('File uploaded successfully.');
        setSelectedFile(null);
        fetchFiles(); // Refresh the file list
      } else {
        setUploadMessage('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('File upload failed.');
    }
  };

  // Delete file from the backend using axios
  const handleDelete = async (fileId) => {
    try {
      const response = await axios.delete(`/api/files/${fileId}`);
      if (response.status === 200) {
        fetchFiles(); // Refresh the file list
      } else {
        console.error('Failed to delete file.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <>
      <div className="container-lab">
        <div className="header-lab">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
          <p>Browse File to upload!</p>
        </div>
        <label htmlFor="file" className="footer-lab">
          <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
              <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
            </g>
          </svg>
          <p>{selectedFile ? selectedFile.name : 'Not selected file'}</p>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z"
                stroke="#000000"
                strokeWidth="2"
              ></path>
              <path d="M19.5 5H4.5" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
              <path
                d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z"
                stroke="#000000"
                strokeWidth="2"
              ></path>
            </g>
          </svg>
        </label>
        <label htmlFor="file" className="footer-lab">
          <input id="file" type="file" onChange={handleFileChange} />
          <p>{selectedFile ? selectedFile.name : 'Not selected file'}</p>
        </label>
        <button onClick={handleUpload}>Upload</button>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
      <div className="file-list">
        <h3>Uploaded Files</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name}
                <button onClick={() => handleDelete(file.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded.</p>
        )}
      </div>
    </>
  );
};

export default FileUpload;