import { useState, useCallback, useEffect } from "react";

export function useResize(sidebarWidth) {
  const [stageWidth, setStageWidth] = useState(0);
  const handleResize = useCallback(() => {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    //const stageWidth = scrollBarWidth ? (document.body.clientWidth - width) : (window.innerWidth - width);
    if (scrollBarWidth) {
      setStageWidth(document.body.clientWidth - sidebarWidth);
    } else {
      setStageWidth(window.innerWidth - sidebarWidth);
    }
  }, [sidebarWidth]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return stageWidth;
}

export default useResize;
