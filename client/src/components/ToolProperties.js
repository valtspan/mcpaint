import React, { useCallback } from "react";
import { connect } from "react-redux";

import { GithubPicker, MaterialPicker } from "react-color";
import "../css/styles.css";

import { useSidebar } from "../hooks/useSidebar";
import { setPanelWidth } from "../store/sidebar";
import { setToolValue } from "../store/tools";
import { sendDataToServer, connectionId } from "../api/socket-api";

// {icon-name: [list of toolProperties elements]}
//toolProperties element corresponds to specific function(BrushSize, BrushColor) which controls corresponding state (brushSize, brushColor)

const config = {
  bars: [],
  "pencil-alt": [],
  "paint-brush": ["brush-palette", "brush-size"],
  eraser: ["eraser-size"],
  "vector-square": ["rect-palette"],
  save: [],
  history: ["history-list", "undo-redo-panel"],
};

function toolColor(tool) {
  return function (props) {
    return <Color tool={tool} {...props} />;
  };
}

function toolSize(tool) {
  return function (props) {
    return <Size tool={tool} {...props} />;
  };
}

const BrushColor = toolColor("brushColor");
const RectColor = toolColor("rectangleColor");

const BrushSize = toolSize("brushSize");
const EraserSize = toolSize("eraserSize");

const componentMatcher = {
  "brush-palette": BrushColor,
  "rect-palette": RectColor,
  "brush-size": BrushSize,
  "eraser-size": EraserSize,
  "history-list": HistoryList,
  "undo-redo-panel": ButtonPanel,
};

function Color({ tool, toolState, handleTool }) {
  const color = toolState[tool];
  const handleChangeComplete = useCallback(
    (event) => {
      handleTool(tool, event.hex);
    },
    [handleTool, tool]
  );
  return <GithubPicker color={color} onChangeComplete={handleChangeComplete} />;
}

function Size({ tool, toolState, handleTool }) {
  const size = toolState[tool];
  const handleChangeComplete = useCallback(
    (event) => {
      handleTool(tool, Number(event.target.value));
    },
    [handleTool, tool]
  );
  return (
    <input
      onChange={handleChangeComplete}
      style={{ marginTop: "10px", width: "170px" }}
      type="range"
      value={size}
      min={5}
      max={100}
    />
  );
}

function HistoryList({ shapes }) {
  //TODO
  //change condition when storage is not undefined
  //extract code below in a separate function
  let lastShapes;
  if (shapes.length > 4) {
    lastShapes = shapes
      .slice(shapes.length - 5)
      .map((shape) => shape.traceType);
  } else if (shapes.length > 0) {
    lastShapes = shapes.map((shape) => shape.traceType);
  } else {
    lastShapes = [];
  }

  lastShapes.reverse();
  return (
    <div>
      <p
        style={{
          textTransform: "uppercase",
          fontSize: "15px",
          color: "#5e6c84",
          paddingTop: "10px",
        }}
      >
        Last actions
      </p>
      <ul style={{ padding: "0", color: "#4d4e4f" }}>
        {lastShapes.map((shape, index) => (
          <li
            style={{
              listStyleType: "none",
            }}
            key={index}
          >
            {shape}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ButtonPanel({ canUndo, canRedo, handleUndo, handleRedo }) {
  return (
    <div>
      <button
        onClick={() => {
          handleUndo();
          //TODO
          //action in both above & below lines is the same
          sendDataToServer({ type: "Undo", id: connectionId });
        }}
        disabled={!canUndo}
      >
        Undo
      </button>
      <button
        onClick={() => {
          handleRedo();
          //TODO
          //action in both above & below lines is the same
          sendDataToServer({ type: "Redo", id: connectionId });
        }}
        disabled={!canRedo}
      >
        Redo
      </button>
    </div>
  );
}

let ToolProperties = (props) => {
  const { activeTool, getToolPropertiesWidth, ...otherProps } = props;

  const toolPropertiesElements = activeTool ? config[activeTool] : [];
  const toolPropertiesComponents = toolPropertiesElements.map(
    (element) => componentMatcher[element]
  );

  const toolPropertiesRef = useSidebar(getToolPropertiesWidth);

  return (
    <div ref={toolPropertiesRef} className={"panel"} /*style={style}*/>
      {toolPropertiesComponents.map((ToolPropertiesComponent) => (
        <ToolPropertiesComponent {...otherProps} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeTool: state.tools.activeTool,
  toolState: state.tools.allTools,
  shapes: state.history.past,
  canUndo:
    state.history.past.filter((item) => item.id === connectionId).length > 0,
  canRedo:
    state.history.future.filter((item) => item.shape.id === connectionId)
      .length > 0,
});

const mapDispatchToProps = (dispatch) => ({
  getToolPropertiesWidth: (width) =>
    dispatch(setPanelWidth("toolPropertiesWidth", width)),
  handleTool: (tool, value) => dispatch(setToolValue(tool, value)),
  handleUndo: () => dispatch({ type: "Undo", id: connectionId }),
  handleRedo: () => dispatch({ type: "Redo", id: connectionId }),
});

ToolProperties = connect(mapStateToProps, mapDispatchToProps)(ToolProperties);

export default ToolProperties;

// export default React.memo(ToolProperties);
//Pure component for functional components
