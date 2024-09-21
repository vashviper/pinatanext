import React, { useState } from 'react';
import axios from 'axios';
import styles from './FileUpload.module.css';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Your Story</h1>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
          Genre
        </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a genre</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-fiction</option>
          <option value="poetry">Poetry</option>
          <option value="drama">Drama</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
          Choose File
        </label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleUpload}
        className={styles.uploadButton}
        disabled={!file}
      >
        Upload Story
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