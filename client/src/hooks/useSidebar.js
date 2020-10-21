import { useRef, useEffect } from "react";

function useSidebar(getPanelWidth) {
  const sidebarRef = useRef(null);

  let width;
  useEffect(() => {
    width = sidebarRef.current.clientWidth;
    if (width) {
      getPanelWidth(width);
    }
  }, [getPanelWidth, width]);

  return sidebarRef;
}

export { useSidebar };
