import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FileCard = ({ file, onDelete }) => {
  const token = localStorage.getItem('token');
  const [showDetails, setShowDetails] = useState(false);

  const downloadFile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/files/download/${file._id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalname);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const previewFile = () => {
window.open(`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${file.filename}`, '_blank')
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/share/${file._id}`; // Example path
    navigator.clipboard.writeText(shareLink);
    toast.success("Shareable link copied!");
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="border p-4 rounded shadow-sm mb-4 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{file.originalname}</p>
          <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <div className="flex gap-2">
          <button onClick={previewFile} className="btn-sm bg-indigo-500 text-white">Preview</button>
          <button onClick={downloadFile} className="btn-sm bg-blue-500 text-white">Download</button>
          <button onClick={onDelete} className="btn-sm bg-red-500 text-white">Delete</button>
          <button onClick={() => setShowDetails(!showDetails)} className="btn-sm bg-gray-700 text-white">
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded">
          <p><strong>File Name:</strong> {file.originalname}</p>
          <p><strong>Type:</strong> {file.mimetype}</p>
          <p><strong>Uploaded:</strong> {formatDate(file.createdAt)}</p>
          <p className="mt-2">
            <button onClick={copyShareLink} className="underline text-blue-600 hover:text-blue-800">
              Copy Shareable Link
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default FileCard;
