function useResize(toolPropertiesWidth, toolbarWidth) {
  const [stageWidth, setStageWidth] = useState(0);

  const handleResize = useCallback(() => {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    //const stageWidth = scrollBarWidth ? (document.body.clientWidth - width) : (window.innerWidth - width);
    if (scrollBarWidth) {
      setStageWidth(
        document.body.clientWidth - toolPropertiesWidth - toolbarWidth
      );
    } else {
      setStageWidth(window.innerWidth - toolPropertiesWidth - toolbarWidth);
    }
  }, [toolPropertiesWidth, toolbarWidth]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return stageWidth;
}

function reducer(state, action) {
  switch (action.type) {
    case "brushSize":
      return { ...state, brushSize: action.value };
    case "brushColor":
      return { ...state, brushColor: action.value };
    case "eraserSize":
      return { ...state, eraserSize: action.value };
    case "pencilColor":
      return { ...state, pencilColor: action.value };
    case "pencilSize":
      return { ...state, pencilSize: action.value };
    case "rectangleColor":
      return { ...state, rectangleColor: action.value };

    default:
      throw new Error();
  }
}

const initialState = {
  brushColor: "#fff",
  brushSize: 5,
  eraserColor: "#fff",
  eraserSize: 10,
  rectangleColor: "#fff",
};

function App(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [toolPropertiesWidth, setToolPropertiesWidth] = useState(0);
  const handleToolPropertiesWidth = useCallback((width) => {
    setToolPropertiesWidth(width);
  }, []);

  const [toolbarWidth, setToolBarWidth] = useState(0);
  const handleToolBarWidth = useCallback((width) => {
    setToolBarWidth(width);
  }, []);

  const stageWidth = useResize(toolPropertiesWidth, toolbarWidth);

  const [activeTool, setActiveTool] = useState(null);
  const handleActiveTool = useCallback((iconName) => {
    setActiveTool(iconName);
  }, []);

  return (
    <Container fluid={true} style={{ height: "100vh" }}>
      <Row style={{ height: "100%" }}>
        <Toolbar
          getToolbarWidth={handleToolBarWidth}
          onActiveTool={handleActiveTool}
        />
        <ToolProperties
          getToolPropertiesWidth={handleToolPropertiesWidth}
          activeTool={activeTool}
          state={state}
          dispatch={dispatch}
        />
        <FieldColumn
          brushColor={state.brushColor}
          brushSize={state.brushSize}
          eraserSize={state.eraserSize}
          sidebarState={state}
          activeTool={activeTool}
          width={toolPropertiesWidth + toolbarWidth}
          stageWidth={stageWidth}
        />
      </Row>
    </Container>
  );
}

export default App;
