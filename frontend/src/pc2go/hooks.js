import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export function useScroll() {

  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScroll(window.scrollY);
    }
    
    // Add event listener
    window.addEventListener("scroll", handleScroll);
    
    // Call handler right away so state gets updated with initial window size
    handleScroll();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty array ensures that effect is only run on mount

  return scroll
}

