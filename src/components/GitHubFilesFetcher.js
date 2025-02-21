import React, { useState } from "react";

const GitHubFilesFetcher = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileContents, setFileContents] = useState({}); // Store file content

  const fetchFiles = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/files");

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status}`);
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.status}`);
      }
      const content = await response.text(); // Fetch as text (adjust based on file type)
      setFileContents(prev => ({ ...prev, [fileName]: content }));
    } catch (error) {
      console.error(`Error fetching content for ${fileName}:`, error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Uploaded Files</h2>
      <button onClick={fetchFiles} disabled={loading} style={styles.fetchButton}>
        {loading ? "Loading..." : "Show Files"}
      </button>

      {error && <p style={styles.errorMessage}>{error}</p>}

      <ul style={styles.fileList}>
        {files.map(file => (
          <li key={file.name} style={styles.fileItem}>
            <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
              {file.name}
            </a>
            <button onClick={() => fetchFileContent(file.downloadUrl, file.name)} style={styles.viewButton}>
              View Content
            </button>
            {fileContents[file.name] && (
              <pre style={styles.fileContent}>
                {fileContents[file.name]}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Custom styles
const styles = {
  container: {
    textAlign: "center",
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    width: "500px",
    margin: "20px auto",
  },
  title: {
    color: "#333",
    fontSize: "22px",
  },
  fetchButton: {
    background: "#007bff",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "10px",
    transition: "0.3s",
  },
  fileList: {
    listStyle: "none",
    padding: "0",
  },
  fileItem: {
    background: "#ffffff",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileLink: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
  },
  viewButton: {
    background: "#28a745",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "10px",
    transition: "0.3s",
  },
  fileContent: {
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "5px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
  },
};

export default GitHubFilesFetcher;
