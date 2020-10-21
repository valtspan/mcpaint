import React, { useState, useCallback, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";

import { last, init, concat, append } from "ramda";

function Field({
  brushColor,
  brushSize,
  eraserSize,
  panelMode,
  width,
  stageWidth,
}) {
  const [lines, addLine] = useState([]);
  const isDown = useRef(false);
  //const [currentLine, setLine] = useState(null);

  const color = panelMode === "eraser" ? "white" : brushColor;
  const size = panelMode === "eraser" ? eraserSize : brushSize;

  const handleMouseDown = useCallback(
    (event) => {
      const mouseX = event.evt.clientX;
      const mouseY = event.evt.clientY;
      //setLine({points: [mouseX - width, mouseY]});
      //color, size -> other properties of a figure
      addLine((lines) => [
        ...lines,
        { points: [mouseX - width, mouseY], color, size },
      ]);
      isDown.current = true;
    },
    [isDown, color, size, width]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (isDown.current) {
        const mouseX = event.evt.clientX;
        const mouseY = event.evt.clientY;
        addLine((lines) => {
          //return [...init(lines), [...last(lines), mouseX, mouseY]];
          return [
            ...init(lines),
            {
              points: [...last(lines).points, mouseX - width, mouseY],
              color,
              size,
            },
          ];
          //return append(concat(last(lines), [mouseX, mouseY]), init(lines));
        });
        // return {
        //   points: [...prevPoints, mouseX - width]
        // }
      }
    },
    [color, size, width]
  );

  const handleMouseUp = useCallback(
    (event) => {
      isDown.current = false;
    },
    [isDown]
  );

  return (
    <Stage
      width={stageWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {lines.map((line, index) => {
          if (line.points.length === 2) {
            return (
              <Circle
                x={line.points[0]}
                y={line.points[1]}
                fill={line.color}
                radius={line.size - 3}
                key={index + "a"}
              />
            );
          } else {
            return (
              <Line
                points={line.points}
                stroke={line.color}
                strokeWidth={line.size}
                lineCap="round"
                lineJoin="round"
                key={index}
              />
            );
          }
        })}
      </Layer>
    </Stage>
  );
}

//export default FieldColumn;
