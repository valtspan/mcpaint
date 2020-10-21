import React, { useState, useCallback } from "react";
import { Stage, Layer, Text, Line } from "react-konva";
import Konva from "konva";

function ColoredRect() {
  const [color, setColor] = useState("green");

  const handleClick = useCallback(() => {
    setColor(Konva.Util.getRandomColor());
  }, []);

  return (
    <Line
      points={[100, 250, 100, 250]}
      strokeWidth={100}
      stroke={color}
      lineJoin={"round"}
      //height={50}
      //fill={color}
      //shadowBlur={5}
      onClick={handleClick}
    />
  );
}

function Test() {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Sosi Pisku" />
        <ColoredRect />
      </Layer>
    </Stage>
  );
}

export default Test;
