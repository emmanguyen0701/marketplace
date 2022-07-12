import { useState, useEffect } from "react";

function useWindowDimension() {
  const [windowDimension, setWindowDimension] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowDimension;
}

export default useWindowDimension;
