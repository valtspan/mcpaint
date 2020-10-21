import { useState, useCallback, useRef } from "react";
//import { Stage, Layer, Line, Circle } from "react-konva";

function useMouse(
  shapeType,
  otherProps,
  width,
  addToStorage,
  storage,
  func1,
  func2
) {
  //general storage for all figures or specific storages
  //or maybe general storage for specific storages
  //const [storage, addToStorage] = useState([]);
  const [currentShape, setCurrentShape] = useState({});
  const isMouseDown = useRef(false);
  //const otherProps = [];

  const handleMouseDown = useCallback(
    (event) => {
      isMouseDown.current = true;
      const x = event.evt.clientX;
      const y = event.evt.clientY;
      const coordinatesObj = func1(x - width, y);
      const obj = {
        shapeType,
        shapeProps: { ...coordinatesObj, ...otherProps },
      };
      setCurrentShape(obj);
      //setCurrentShape({points: [x - width, y], ...otherProps})
    },
    [func1, width, shapeType, otherProps]
  );

  const handleMouseMove = useCallback(
    (event) => {
      // event.persist();
      const x = event.evt.clientX;
      const y = event.evt.clientY;
      if (isMouseDown.current) {
        setCurrentShape((prevState) => {
          const coordinatesObj = func2(x - width, y, prevState);
          return {
            shapeType,
            shapeProps: { ...coordinatesObj, ...otherProps },
          };
          //return {points: [...prevPoints, x - width, y], ...otherProps}
        });
      }
    },
    [func2, width, shapeType, otherProps]
  );
  const handleMouseUp = useCallback(
    (event) => {
      isMouseDown.current = false;
      addToStorage([...storage, currentShape]);
    },
    [currentShape, storage, addToStorage]
  );

  return [handleMouseDown, handleMouseMove, handleMouseUp];
}

export default useMouse;
