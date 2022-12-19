const DEFAULT_EXPIRATION = 1000 * 60 * 15; // 15 minutes

export const LocalCache = function (defaultExpirationInMs) {
  return {
    DEFAULT_EXPIRATION: defaultExpirationInMs,
    _cache: new Map(),
    get: async function (key) {
      const entry = this._cache.get(key);
      if (entry) {
        if (Date.now() >= entry.expires) {
          if (entry.updateFn) {
            return entry.updateFn().then(freshData => {
              this.put(key, freshData, {
                updateFn: entry.updateFn,
                expirationTime: entry.expirationTime
              });
              return freshData;
            });
          }
          this._cache.delete(key);
          return null;
        }
        return entry.value;
      }
      return null;
    },
    put: function (key, value, { updateFn, expirationTime = this.DEFAULT_EXPIRATION }) {
      const data = {
        expirationTime,
        expires: Date.now() + expirationTime,
        value,
        updateFn
      };
      this._cache.set(key, data);
    },
    clear: function () {
      this._cache.clear();
    },
    get keys() {
      return this._cache.keys();
    },
    get size() {
      return this._cache.size;
    },
    invalidate: function (key) {
      const keys = Array.isArray ? [key] : key;
      for (const cacheKey of keys) {
        const entry = this._cache.get(cacheKey);
        const invalidatedEntry = {
          ...entry,
          expires: Date.now()
        };
        this._cache.set(cacheKey, invalidatedEntry);
      }
    }
  };
};

const localCache = new LocalCache(DEFAULT_EXPIRATION);

export const getCachedTable = async (tableName, updateFn, expirationTime) => {
  let tableData = await localCache.get(tableName);
  if (!tableData) {
    const data = await updateFn();
    localCache.put(tableName, data, {
      updateFn,
      expirationTime
    });
    tableData = data;
  }
  return tableData;
};

export const isExistingTableAttribute = (tableName, updateFn) => {
  return async (inputStr, tableAttribute) => {
    const tableData = await getCachedTable(
      tableName,
      updateFn,
      1000 * 60 * 15
    );
    const attributeArray = tableData.map(row => row[tableAttribute]);
    return attributeArray.includes(inputStr);
  };
};

export default localCache;
