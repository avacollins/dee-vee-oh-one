import "./App.css";

import DataLoader from "./components/DataLoader";
import React from "react";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Loan Data Visualization</h1>
      <DataLoader />
    </div>
  );
};

export default App;
