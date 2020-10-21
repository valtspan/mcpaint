import { tools } from "./tools";
import { sidebar } from "./sidebar";
import { history } from "./history";

const rootReducer = (state = {}, action) => {
  return {
    history: history(state.history, action),
    tools: tools(state.tools, action),
    sidebar: sidebar(state.sidebar, action),
  };
};

export default rootReducer;
