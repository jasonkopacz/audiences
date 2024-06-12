import { useState } from "react";

function CSVUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    // console.log("upload", file);
    if (file) {
      // console.log("FORM DATA", file);
      formData.append("file", file);
    }
    console.log(formData);
    try {
      console.log("csv");

      // const boundary = "---------------------------" + Date.now().toString(16);

      const response = await fetch("http://127.0.0.1:8000/upload_csv", {
        method: "POST",
        // headers: {
        //   "Content-Type": `multipart/form-data; boundary=${boundary}`
        // },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <input type="file" id="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}
    </div>
  );
}

export default CSVUpload;
