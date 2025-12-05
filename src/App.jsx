import React from "react";
import Routes from "./Routes";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <DataProvider>
      <Routes />
    </DataProvider>
  );
}

export default App;