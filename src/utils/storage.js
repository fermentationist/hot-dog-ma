const initStorage = (namespace = "shRetail") => {
  const storageObj = {
    getStorage: (key: string) => {
      const stringifiedData = localStorage.getItem(`${namespace}.${key}`) || null;
      try {
        return JSON.parse(stringifiedData);
      } catch (err) {
        return stringifiedData;
      }
    },
    setStorage: (key: string, data: any, merge = false) => {
      let newState = data;
      const previousState = storageObj.getStorage(key);
      if (previousState && typeof previousState === "object" && typeof data === "object" && merge) {
        newState = {
          ...previousState,
          ...data
        }
      }
      localStorage.setItem(`${namespace}.${key}`, JSON.stringify(newState))
      return newState;
    },
    removeStorage: (key: string) => {
      localStorage.removeItem(`${namespace}.${key}`);
    }
  }
  return storageObj;
}

export default initStorage;
