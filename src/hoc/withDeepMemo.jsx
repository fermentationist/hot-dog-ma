import { memo } from "react";

const propsAreEqual = (prevProps, nextProps) => {
  for (const prop in prevProps) {
    try { // using try/catch in case of circular objects or other values that will cause JSON.stringify to fail
      const stringifiedPrevProp = JSON.stringify(prevProps[prop]);
      const stringifiedNextProp = JSON.stringify(nextProps[prop]);
      if (stringifiedPrevProp !== stringifiedNextProp){
        return false;
      }
    }
    catch (error) {
      return false;
    }
  }
  return true;
}

const withDeepMemo = (WrappedComponent) => {
  return memo(WrappedComponent, propsAreEqual);
}

export default withDeepMemo;
