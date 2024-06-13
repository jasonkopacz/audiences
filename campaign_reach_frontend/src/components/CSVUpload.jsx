import { useState } from "react";
import { Audio } from "react-loader-spinner";
import ReachChart from "./ReachChart";
import EfficiencyChart from "./EfficiencyChart";
import DataChart from "./DataChart";

function CSVUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [reachData, setReachData] = useState([null]);
  const [efficiencyData, setEfficiencyData] = useState([null]);
  const [reachValue, setreachValue] = useState(0.5);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleReachChange = (event) => {
    setreachValue(parseFloat(event.target.value));
  };

  const handleUpload = async () => {
    setUploadStatus("pending");
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("reach", reachValue);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_csv", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setReachData(data.data.reach_data);
        setEfficiencyData(data.data.efficiency_data);
        setUploadStatus("success");
      } else {
        setUploadStatus("failure");
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("failure");
    }
  };

  return (
    <div>
      <input type="file" id="file" onChange={handleFileChange} />
      <input
        className="reach"
        type="range"
        min={0.1}
        max={1.0}
        step={0.01}
        value={reachValue}
        onChange={handleReachChange}
      />
      <label className="reachLabel">Reach Value: {reachValue}</label>
      <button onClick={handleUpload}>Chart Data</button>
      {uploadStatus === "pending" && (
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      )}
      {uploadStatus && (
        <div>
          Upload status: {uploadStatus[0].toUpperCase() + uploadStatus.slice(1)}
        </div>
      )}
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

      <section>
        {uploadStatus === "success" && (
          <div>
            {/* <ReachChart reachData={reachData} />
            <EfficiencyChart efficiencyData={efficiencyData} /> */}
            <DataChart efficiencyData={efficiencyData} reachData={reachData} />
          </div>
        )}
      </section>
    </div>
  );
}

export default CSVUpload;
