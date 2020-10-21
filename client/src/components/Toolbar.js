import React from "react";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPencilAlt,
  faPaintBrush,
  faEraser,
  faVectorSquare,
  faSave,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import "../css/styles.css";

import { useSidebar } from "../hooks/useSidebar";
import { setActiveTool } from "../store/tools";
import { setPanelWidth } from "../store/sidebar";

const icons = [
  faBars,
  faPencilAlt,
  faPaintBrush,
  faEraser,
  faVectorSquare,
  faSave,
  faHistory,
];

function Toolbar({ getToolbarWidth, onActiveTool }) {
  const toolbarRef = useSidebar(getToolbarWidth);
  //useCallback??
  function handleIconClick(iconName) {
    const handleSpecificIcon = () => {
      onActiveTool(iconName);
      //onShowToolProperties();
    };
    return handleSpecificIcon;
  }

  return (
    <div ref={toolbarRef} className={"toolbar"}>
      {icons.map((icon) => {
        return (
          <div className={"icon"}>
            <FontAwesomeIcon
              icon={icon}
              onClick={handleIconClick(icon.iconName)}
            />
          </div>
        );
      })}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onActiveTool: (iconName) => dispatch(setActiveTool(iconName)),
  getToolbarWidth: (width) => dispatch(setPanelWidth("toolbarWidth", width)),
});

export default connect(null, mapDispatchToProps)(Toolbar);
