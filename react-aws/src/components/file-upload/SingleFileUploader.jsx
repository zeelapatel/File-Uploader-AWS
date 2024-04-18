import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useState } from "react";
import { OutlinedInput, TextField, styled } from '@mui/material';
import axios from "axios";


const initialTextField={
  text:""
}


function SingleFileUploader() {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState(initialTextField);

  // Function to upload file to s3
  const uploadFile = async () => {
    const S3_BUCKET = "react-file";
    const REGION = import.meta.env.VITE_AWS_REGION;
    const UPLOAD_API_ENDPOINT = import.meta.env.VITE_AWS_API_ENDPOINT; // Replace with your API Gateway endpoint

    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      console.log("File uploaded successfully.");

      fetch(UPLOAD_API_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          text: textInput,
          filePath: `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.name}`
        })
      })
      .then((response)=>{
        console.log(response);
      }).catch(error => console.error('Error:', error));
      alert("File uploaded successfully.");

    } catch (err) {
      alert("File uploaded booo.");
      console.error("Error uploading file:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  return (
    <div className="App">
      <div>
        <input type = "text" 
          id="outlined-basic" 
          label="Text Input"
          onChange={(e) =>handleTextChange(e)} />
        
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default SingleFileUploader;
