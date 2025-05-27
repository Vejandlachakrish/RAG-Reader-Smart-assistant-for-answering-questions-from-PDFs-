import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get('/api/pdf/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUploads(res.data);
      } catch (err) {
        alert('Failed to load uploads');
      }
    };

    fetchUploads();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <ul className="space-y-2">
          {uploads.map((file, idx) => (
            <li key={idx} className="p-2 border rounded">
              <strong>{file.filename}</strong> — Uploaded by {file.user}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
