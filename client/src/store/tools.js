// const initialState = {
//   brushColor: "#194D33",
//   brushSize: 5,
//   // eraserColor: "#fff",
//   // eraserSize: 10,
//   rectangleColor: "#fff",
// };

const initialState = {
  "paint-brush": { color: "#194D33", size: 5 },
  "vector-square": { color: "#194D33" }
}

export const setToolValue = (tool, property, value) => {
  return { type: "Set_tool_value", payload: { tool, property, value } };
};

const allTools = (state = initialState, action) => {
  switch (action.type) {
    case "Set_tool_value":
      return { ...state, [action.payload.tool]: { ...state[action.payload.tool], [action.payload.property]: action.payload.value} };
    default:
      return state;
  }
};

export const setActiveTool = (activeTool) => {
  return { type: "Set_active_tool", payload: activeTool };
};

const activeTool = (state = "paint-brush", action) => {
  switch (action.type) {
    case "Set_active_tool":
      return action.payload;
    default:
      return state;
  }
};

export const tools = (state = {}, action) => ({
  allTools: allTools(state.allTools, action),
  activeTool: activeTool(state.activeTool, action),
});
