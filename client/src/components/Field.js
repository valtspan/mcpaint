import React, { useState, useCallback, useRef } from "react";
import { connect } from "react-redux";

import { Stage, Layer, Line, Rect } from "react-konva";

import { useResize } from "../hooks/useResize";
import { addShape } from "../store/shapes";

import {
  useReceivedData,
  sendDataToServer,
  connectionId,
} from "../api/socket-api";

function mouseHandlersMatcher(activeTool) {
  switch (activeTool) {
    //case "bars":
    //case "pencil-alt":
    case "paint-brush":
    case "eraser":
      return [
        (x, y) => ({ points: [x, y] }),
        (x, y, prevState) => {
          const prevPoints = prevState.shapeProps.points;
          return { points: [...prevPoints, x, y] };
        },
      ];
    case "vector-square":
      return [
        (x, y) => ({ x, y }),
        (x, y, prevState) => {
          const initX = prevState.shapeProps.x;
          const initY = prevState.shapeProps.y;
          return {
            x: initX,
            y: initY,
            width: x - initX,
            height: y - initY,
          };
        },
      ];
    //case null:
    //return [() => ({}), () => ({})];
    default:
      return [() => ({}), () => ({})];
    //case "save":
  }
}
const traceTypeMatcher = {
  "paint-brush": "brush-line",
  eraser: "eraser-line",
  "vector-square": "rectangle",
};
const componentMatcher = {
  "brush-line": McLine,
  "eraser-line": McLine,
  rectangle: McRect,
};

function McLine({ traceType, shapeProps }) {
  //const color = props.currentShape.shapeType
  const color =
    traceType === "eraser-line"
      ? shapeProps.eraserColor
      : shapeProps.brushColor;
  const size =
    traceType === "eraser-line" ? shapeProps.eraserSize : shapeProps.brushSize;
  return (
    <Line
      points={shapeProps.points}
      stroke={color}
      strokeWidth={size}
      lineCap="round"
      lineJoin="round"
    />
  );
}
function McRect({ shapeProps }) {
  return (
    <Rect
      style={{ cursor: "pointer" }}
      x={shapeProps.x}
      y={shapeProps.y}
      width={shapeProps.width}
      height={shapeProps.height}
      fill={shapeProps.rectangleColor}
    />
  );
}

function Base({ handlers, children, stageWidth }) {
  const { handleMouseDown, handleMouseMove, handleMouseUp } = handlers;
  // try {
  //   handleMouseMove();
  // } catch {
  //   handleMouseDown = null;
  //   handleMouseMove = null;
  // }
  return (
    <Stage
      width={stageWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>{children}</Layer>
    </Stage>
  );
}

function StorageComp(props) {
  const storage = props.storage;

  const storageComponents = storage.map((shape, index) => {
    console.log(shape, "UUU")
    const Shape = componentMatcher[shape.payload.traceType];
    return <Shape {...shape.payload} key={index} />;
  });

  return <>{storageComponents}</>;
}

function CurrentShape(props) {
  //const [currentShape, setCurrentShape] = useState({});
  const Shape = componentMatcher[props.currentShape.traceType];
  if (props.isMouseDown && Shape) {
    //const Shape = componentMatcher[props.currentShape.traceType];
    return <Shape {...props.currentShape} />;
  } else {
    return null;
  }
}

function Field(props) {
  const {
    activeTool,
    sidebarWidth,
    handleShape,
    allShapes,
    allTools,
  } = props;

  const stageWidth = useResize(sidebarWidth);

  const [currentShape, setCurrentShape] = useState({});
  //const [storage, addToStorage] = useState([]);
  const isMouseDown = useRef(false);
  //console.log(stageWidth);
  const [mouseDownWriter, mouseMoveWriter] = mouseHandlersMatcher(activeTool);
  const traceType = traceTypeMatcher[activeTool];

  //WILL BE REPLACED LATER WITH MIDDLEWARE
  //useReceivedData(handleShape, handleUndoRedo, allShapes);

  const handleMouseDown = useCallback(
    (event) => {
      isMouseDown.current = true;
      const x = event.evt.clientX;
      const y = event.evt.clientY;
      const coordinatesObj = mouseDownWriter(x - sidebarWidth, y);
      const obj = {
        traceType,
        shapeProps: { ...coordinatesObj, ...allTools },
      };
      //const obj = {
         //shapeType
         //shapeProps: {...coordinatesObj, allTools.}
      //}
      setCurrentShape(obj);
      //setCurrentShape({points: [x - sidebarWidth, y], ...otherProps})
    },
    [mouseDownWriter, sidebarWidth, traceType, allTools]
  );

  const handleMouseMove = useCallback(
    (event) => {
      // event.persist();
      const x = event.evt.clientX;
      const y = event.evt.clientY;
      if (isMouseDown.current) {
        setCurrentShape((prevState) => {
          const coordinatesObj = mouseMoveWriter(
            x - sidebarWidth,
            y,
            prevState
          );
          return {
            traceType,
            shapeProps: { ...coordinatesObj, ...allTools },
          };
          //return {points: [...prevPoints, x - sidebarWidth, y], ...otherProps}
        });
      }
    },
    [mouseMoveWriter, sidebarWidth, traceType, allTools]
  );
  const handleMouseUp = useCallback(
    (event) => {
      isMouseDown.current = false;
      //addToStorage([...storage, currentShape]);
      handleShape(connectionId, currentShape);
      sendDataToServer(addShape(connectionId, currentShape));
    },
    [currentShape, handleShape]
  );
  //TODO 
  //Correct line below
  if (activeTool) {
    return (
      <Base
        handlers={{ handleMouseDown, handleMouseMove, handleMouseUp }}
        stageWidth={stageWidth}
      >
        <StorageComp storage={allShapes} />
        <CurrentShape
          isMouseDown={isMouseDown.current}
          currentShape={currentShape}
        />
      </Base>
    );
  } else return null;
}

// const FieldColumn = (props) => {
//   return (
//     // <Col className="p-0">
//     <Field {...props} />
//   );
// };

const mapStateToProps = (state) => ({
  activeTool: state.tools.activeTool,
  sidebarWidth: state.sidebar.toolbarWidth + state.sidebar.toolPropertiesWidth,
  allTools: state.tools.allTools,
  allShapes: state.history.past,
});

const mapDispatchToProps = (dispatch) => ({
  handleShape: (id, payload) => dispatch(addShape(id, payload)),
  //WILL BE REPLACED LATER WITH MIDDLEWARE
  // handleUndoRedo: dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Field);
