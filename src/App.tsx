import "./App.css";

import React from "react";
import { useAppDispatch } from "./store/hooks";
import { useSelector } from "react-redux";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useSelector((state: any) => state.data.isLoading);

  React.useEffect(() => {
    // Dispatch an action to load data here
    // dispatch(loadData());
  }, [dispatch]);

  return (
    <div className="App">
      <h1>Loan Data Visualization</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="App">
          <p>CHARTS AND GRAPHS</p>
        </div>
      )}
    </div>
  );
};

export default App;
