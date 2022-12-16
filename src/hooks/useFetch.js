import APIRequest from "../utils/APIRequest";
import {useState, useEffect, useMemo, useCallback} from "react";

const useFetch = (url, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [refreshValue, setRefreshValue] = useState(0);
  const [passedUrl, setPassedUrl] = useState(url);

  useEffect(() => {
    let getData = null;
    
    if (passedUrl) {
      getData = new APIRequest({
        url: passedUrl,
        method: "get",
        ...options
      });
      
      const fetchData = async () => {
        setLoading(true);
        const response = await getData
          .request()
          .catch((err) =>{ 
            setStatus(err.status);
            setData(null);
            setError(err);
            return null;
          })
          .finally(() => {
            setLoading(false);
          });
        if (response) {
          setStatus(response.status || null);
          setData(response.data || null);
          setError(null);
        }
      };

      fetchData();

    } else {
      // if falsy passedUrl
      setStatus(null);
      setData(null);
      setError(null);
    }
    return () => {
      // cleanup
      if (getData && data) {
        getData.abort("redundancy");
      }
    };
  }, [refreshValue, passedUrl]);
   
  const refresh = () => setRefreshValue(Math.random());

  const updateUrl = newUrl => {
    return setPassedUrl(newUrl)};

  return {
    loading: useMemo(() => loading, [loading]),
    status: useMemo(() => status, [status]),
    data: useMemo(() => data, [data && JSON.stringify(data)]),
    error: useMemo(() => error, [error && JSON.stringify(error)]),
    refresh: useCallback(refresh, []),
    updateUrl: useCallback(updateUrl, [])
  }
}

export default useFetch;
