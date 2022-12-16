import { useCallback, useEffect, useRef } from "react";

// will behave like useEffect, except will not automatically run on initial render
const useTriggeredEffect = (fn, dependencies) => {
  const memoizedFn = useCallback(fn, [])
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) { 
      memoizedFn();
    }
    didMountRef.current = true;
  }, [...dependencies, memoizedFn]);
}

export default useTriggeredEffect;
