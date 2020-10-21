const initialState = {
  brushColor: "#194D33",
  brushSize: 5,
  eraserColor: "#fff",
  eraserSize: 10,
  rectangleColor: "#fff",
};

export const setToolValue = (tool, value) => {
  return { type: "Set_tool_value", tool, value };
};

const allTools = (state = initialState, action) => {
  switch (action.type) {
    case "Set_tool_value":
      return { ...state, [action.tool]: action.value };
    default:
      return state;
  }
};

export const setActiveTool = (activeTool) => {
  return { type: "Set_active_tool", activeTool };
};

const activeTool = (state = "paint-brush", action) => {
  switch (action.type) {
    case "Set_active_tool":
      return action.activeTool;
    default:
      return state;
  }
};

export const tools = (state = {}, action) => ({
  allTools: allTools(state.allTools, action),
  activeTool: activeTool(state.activeTool, action),
});
