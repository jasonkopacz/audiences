import CSVUpload from "./components/CSVUpload";
import ReachEfficiencyChart from "./components/ReachEfficiencyChart";

function App() {
  return (
    <div>
      <h1>Audience Data Analysis</h1>
      <CSVUpload />
      <ReachEfficiencyChart />
    </div>
  );
}

export default App;
