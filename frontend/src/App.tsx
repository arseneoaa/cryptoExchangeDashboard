import React from "react";
import Container from "@material-ui/core/Container";

import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="appContainer">
      <Container>
        <Dashboard />
      </Container>
    </div>
  );
}

export default App;
