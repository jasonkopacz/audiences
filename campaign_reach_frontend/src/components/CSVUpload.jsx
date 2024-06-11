import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = async (url, options) => {
  const res = await fetch(url, options);
  return res.json();
};

function CSVUpload() {
  const [file, setFile] = useState(null);
  const { data, error } = useSWR("/api/upload-csv/", fetcher, {
    revalidateOnMount: false
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const options = {
      method: "POST",
      body: formData
    };

    try {
      const response = await mutate("/api/upload-csv/", options);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  if (error) return <div>Failed to upload CSV</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default CSVUpload;
