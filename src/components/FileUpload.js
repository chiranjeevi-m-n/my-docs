import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadToBackend = async () => {
    if (!file) {
      setMessage("❗ Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("⏳ Uploading...");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64File = reader.result.split(",")[1];

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: base64File,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.message === "File already exists") {
          setMessage("⚠️ File already exists!");
        } else {
          setMessage("✅ File uploaded successfully!");
        }
      } else {
        setMessage("❌ Upload failed! Check the console.");
        console.error(result);
      }

      setUploading(false);
    };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload a File</h2>
      <input type="file" accept=".docx,.pptx" onChange={handleFileChange} style={styles.input} />
      <button onClick={uploadToBackend} disabled={uploading} style={styles.button}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <p style={message.includes("failed") ? styles.errorMessage : message.includes("exists") ? styles.warningMessage : styles.successMessage}>
        {message}
      </p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
    margin: "20px auto",
  },
  title: {
    color: "#333",
    fontSize: "22px",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
  },
  button: {
    background: "#007bff",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
  successMessage: {
    color: "green",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
  },
  warningMessage: {
    color: "orange",
    fontWeight: "bold",
  },
};

export default FileUpload;
