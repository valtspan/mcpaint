function Toolbar({ getToolbarWidth, onActiveTool }) {
  const toolbarRef = useSidebar(getToolbarWidth);
  //const onActiveTool = props.onActiveTool;

  // const onActiveToolChange = props.onActiveToolChange;
  // const handleClick = useCallback(event => {
  //   onActiveToolChange(event.target.id)
  // }, [onActiveToolChange]);
  function handleIconClick(iconName) {
    const handleSpecificIcon = () => {
      onActiveTool(iconName);
    };
    return handleSpecificIcon;
  }

  return (
    <Col ref={toolbarRef} md="auto">
      {icons.map((icon) => {
        return (
          <div style={{ cursor: "pointer" }}>
            <FontAwesomeIcon
              icon={icon}
              onClick={handleIconClick(icon.iconName)}
            />
          </div>
        );
      })}
    </Col>
  );
}
