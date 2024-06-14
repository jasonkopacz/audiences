import "./CSVUpload.css";
import { useState } from "react";
import { FidgetSpinner } from "react-loader-spinner";
import ReachChart from "./ReachChart";
import EfficiencyChart from "./EfficiencyChart";
import DataChart from "./DataChart";

function CSVUpload() {
  const [file, setFile] = useState(null);
  const [reachValue, setreachValue] = useState(0.5);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [reachData, setReachData] = useState([null]);
  const [efficiencyData, setEfficiencyData] = useState([null]);

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
    if (reachValue) formData.append("reach", reachValue);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_csv", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
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
    <div className="container">
      <fieldset className="fileUpload">
        <input type="file" className="file" onChange={handleFileChange} />
        <input
          id="reach"
          className="reach"
          type="range"
          min={0.1}
          max={1.0}
          step={0.01}
          value={reachValue}
          onChange={handleReachChange}
        />
        <label className="reachLabel" htmlFor="reach">
          Reach Value: {reachValue}
        </label>
        <button onClick={handleUpload} aria-pressed="false" name="chartData">
          Chart Data
        </button>
      </fieldset>
      {uploadStatus === "pending" && (
        <FidgetSpinner
          visible={true}
          height="80"
          width="80"
          ariaLabel="fidget-spinner-loading"
          wrapperStyle={{}}
          wrapperClass="fidget-spinner-wrapper"
        />
      )}
      <section>
        {uploadStatus === "success" && (
          <div className="chartContainer">
            <ReachChart reachData={reachData} />
            <EfficiencyChart efficiencyData={efficiencyData} />
            <DataChart efficiencyData={efficiencyData} reachData={reachData} />
          </div>
        )}
      </section>
    </div>
  );
}

export default CSVUpload;
