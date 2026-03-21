'use client';

import { useState, useRef } from 'react';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [status, setStatus] = useState(null); // { message, type }
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setProgress(0);
    setShowProgress(false);
    setStatus(null);
    setIsDragOver(false);
    onClose();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ message: 'Please select a photo first.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('product', selectedFile);

    setShowProgress(true);
    setProgress(30);
    setStatus(null);
    setIsUploading(true);

    try {
      setProgress(60);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      setProgress(90);
      const data = await res.json();

      if (data.success) {
        setProgress(100);
        setStatus({ message: 'Upload successful! Your 3D model is ready.', type: 'success' });
        onUploadSuccess(data.modelUrl);
        setTimeout(() => {
          handleClose();
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }, 1200);
      } else {
        setStatus({ message: 'Upload failed. Please try again.', type: 'error' });
        setProgress(0);
      }
    } catch (err) {
      console.error(err);
      setStatus({ message: 'Server error. Please try again.', type: 'error' });
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal">
        <h2>Upload a Photo</h2>
        <p>Choose a product photo to transform into a 3D model.</p>

        <div
          className={`drop-zone${isDragOver ? ' drag-over' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <svg
            width="40"
            height="40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ display: 'block', margin: '0 auto 12px' }}
          >
            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p>{selectedFile ? `✓ ${selectedFile.name}` : 'Drag & drop your photo here'}</p>
          <span>or click to browse — PNG, JPG supported</span>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />

        {showProgress && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {status && (
          <div className={`status-msg ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleUpload} disabled={isUploading}>
            Upload &amp; Transform
          </button>
        </div>
      </div>
    </div>
  );
}
