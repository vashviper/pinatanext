import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import styles from '../styles/FileUpload.module.css';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/plain' || selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a .txt or .pdf file.');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData);
      console.log('Server response:', response.data);
      if (response.data.success) {
        console.log('File uploaded successfully:', response.data.ipfsHash);
        setIpfsHash(response.data.ipfsHash);
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error: unknown) {
      console.error('Upload error:', error);
      let errorMessage = 'An error occurred while uploading the file.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.fileUpload}>
      <h1>Upload File to IPFS</h1>
      <input type="file" accept=".txt,.pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload to IPFS'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {ipfsHash && (
        <div className={styles.success}>
          <p>File uploaded successfully!</p>
          <p>IPFS Hash: {ipfsHash}</p>
          <a
            href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${ipfsHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on IPFS
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;