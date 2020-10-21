export const setPanelWidth = (panel, width) => {
  return { type: "Set_panel_width", panel, width };
};

const initialState = { toolbarWidth: 0, toolPropertiesWidth: 0 };

export const sidebar = (state = initialState, action) => {
  switch (action.type) {
    case "Set_panel_width":
      return { ...state, [action.panel]: action.width };
    default:
      return state;
  }
};
