import React, { useEffect, useState } from "react";

const UploadsPage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/files");
        if (!response.ok) throw new Error("Failed to fetch files");
        
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Uploaded Files</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadsPage;
