import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a PDF file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // MUST match Flask request.files['file']

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-questions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Backend response:", response.data);
    } catch (error) {
      console.error("Upload error:", error.response || error.message);
    }
  };

  return (
    <div>
      <h1>Upload PDF</h1>
      <FileUpload onFileSelect={handleFileSelect} />
      <button onClick={handleSubmit}>Generate Questions</button>
    </div>
  );
};

export default UploadPage;
