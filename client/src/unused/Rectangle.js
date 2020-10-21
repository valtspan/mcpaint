import React, { useCallback, useState, useRef } from "react";
import { Rect, Stage, Layer } from "react-konva";

function RectangleApp() {
  const [rect, setRect] = useState({});
  const [storage, addToStorage] = useState([]);
  const isDown = useRef(false);

  const handleMouseDown = useCallback((e) => {
    isDown.current = true;
    setRect({
      initX: e.evt.clientX,
      initY: e.evt.clientY,
    });
  }, []);
  const handleMouseMove = useCallback((e) => {
    if (isDown.current) {
      setRect((prevRect) => {
        const currentX = e.evt.clientX;
        const currentY = e.evt.clientY;
        return {
          ...prevRect,
          width: currentX - prevRect.initX,
          height: currentY - prevRect.initY,
        };
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDown.current = false;
    addToStorage([...storage, rect]);
  }, [rect, storage]);

  const currentRect = isDown.current ? (
    <Rect
      style={{ cursor: "pointer" }}
      x={rect.initX}
      y={rect.initY}
      width={rect.width}
      height={rect.height}
      fill="black"
    />
  ) : null;

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {storage.map((shape) => (
          <Rect
            style={{ cursor: "pointer" }}
            x={shape.initX}
            y={shape.initY}
            width={shape.width}
            height={shape.height}
            fill="black"
          />
        ))}
        {currentRect}
      </Layer>
    </Stage>
  );
}

export default RectangleApp;
