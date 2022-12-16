import { useCallback, useEffect, useRef } from "react";

// will behave like useEffect, except will only run on the first render
const useEffectOnce = (fn: () => void, dependencies: any[] = []) => {
  const memoizedFn = useCallback(fn, [])
  const fnExecuted = useRef(false);
  useEffect(() => {
    if (!fnExecuted.current) { 
      fnExecuted.current = true;
      memoizedFn();
    }
  }, [...dependencies, memoizedFn]);
}

export default useEffectOnce;
