import { useState, createContext, useCallback } from "react";

const initialState = {
  isOpen: false,
  message: null,
  title: null,
  confirmCallback: null,
  promptForInput: false,
  child: null
};

export const AlertStateContext = createContext({
  alertState: initialState,
  setAlertState: (newState) => {
    console.error("call to setAlertState failed.");
  },
  callAlert: (args) => {
    if (typeof args === "string") {
      alert(args);
    } else {
      alert(args.message);
    }
  },
  callAlertProm: (args) => {
    return new Promise(resolve => {
      const message = typeof args === "string" ? args : args.message;
      alert(message);
      return resolve(true);
    });
  },
  resetAlertState: () => {
    console.error("call to resetAlertState failed.");
  },
  alertError: (error) => {
    console.error(error);
    alert(error.message);
  },
  alertErrorProm: (error) => {
    return new Promise(resolve => {
      console.error(error);
      alert(error.message);
      return resolve(true);
    });
  }
});

const AlertStateProvider = function ({children}) {
  const [alertState, setAlertState] = useState(initialState);

  const callAlert = (args) => {
    let message, title, confirmCallback, closeCallback, promptForInput, child;
    if (typeof args === "string") {
      message = args;
    } else {
      ({
        message,
        title,
        confirmCallback,
        closeCallback,
        promptForInput,
        child
      } = args);
    }
    setAlertState({
      isOpen: true,
      message: typeof message === "string" ? message : JSON.stringify(message),
      title: title || null,
      confirmCallback: confirmCallback || null,
      closeCallback: closeCallback || null,
      promptForInput: promptForInput || false,
      child: child
    });
  };

  const callAlertProm = (args) => {
    return new Promise((resolve, reject) => {
      const passedArgs = typeof args === "string" ? { message: args } : args;
      const alertArgs = {
        ...passedArgs,
        closeCallback: () => {
          if (passedArgs.closeCallback) {
            return resolve(passedArgs.closeCallback(true));
          }
          return resolve(true);
        }
      };
      return callAlert(alertArgs);
    });
  };

  const resetAlertState = () => {
    setAlertState(initialState);
  };

  const alertError = (error) => {
    console.error(error);
    callAlert({ message: error.message, title: error.name });
  };
  const alertErrorProm = (error) => {
    return new Promise(resolve => {
      console.error(error);
      callAlert({
        message: error.message,
        title: error.name,
        closeCallback: () => {
          return resolve(true);
        }
      });
    });
  };
  const memoizedSetAlertState = useCallback(setAlertState, []);
  const memoizedCallAlert = useCallback(callAlert, []);
  const memoizedCallAlertProm = useCallback(callAlertProm, []);
  const memoizedResetAlertState = useCallback(resetAlertState, []);
  const memoizedAlertError = useCallback(alertError, []);
  const memoizedAlertErrorProm = useCallback(alertErrorProm, []);

  return (
    <AlertStateContext.Provider
      value={{
        alertState,
        setAlertState: memoizedSetAlertState,
        callAlert: memoizedCallAlert,
        callAlertProm: memoizedCallAlertProm,
        resetAlertState: memoizedResetAlertState,
        alertError: memoizedAlertError,
        alertErrorProm: memoizedAlertErrorProm
      }}
    >
      {children}
    </AlertStateContext.Provider>
  );
};

export default AlertStateProvider;
