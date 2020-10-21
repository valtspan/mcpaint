import React, { useState } from "react";

import ToolProperties from "./ToolProperties";
import Field from "./Field";
import Toolbar from "./Toolbar";

import "../css/styles.css";

function App() {
  return (
    <div className={"container"}>
      <Toolbar />
      <ToolProperties />
      <Field />
    </div>
  );
}

export default App;
