import { opError } from "./errors";
const REQUEST_TIMEOUT = 20000;

export default class APIRequest {
  constructor(config = {}) {
    this.config = config;
    this.config.body = config.body
      ? JSON.stringify(config.body)
      : config.data
      ? JSON.stringify(config.data)
      : null;
    this.config.headers = config.headers || {
      "Content-Type": "application/json",
    };
    this.url = config.url;
    this.abortController = new AbortController();
    this.config.signal = this.abortController.signal;

    // so methods still work if passed as higher-order functions
    this.request = this.request.bind(this);
    this.abort = this.abort.bind(this);
  }

  fetchWithTimeout(url, options = {}) {
    const { timeout = REQUEST_TIMEOUT } = options;
    const timeoutId = setTimeout(() => {
      this.abort("timeout");
      console.log(
        `Request timed out at ${timeout / 1000} second${
          timeout / 1000 === 1 ? "" : "s"
        }`
      );
    }, timeout);
    return fetch(url, options).then((response) => {
      clearTimeout(timeoutId);
      return response;
    });
  }

  async request(additionalConfig = {}) {
    const requestConfig = {
      ...this.config,
      ...additionalConfig,
    };
    // log request
    console.log("REQUEST: ");
    console.log(requestConfig);

    // return fetch promise
    return this.fetchWithTimeout(requestConfig.url, requestConfig)
      .then(async (responseObj) => {
        const content = await responseObj.json();
        if (!responseObj.ok) { // not "ok" responses
          // unlike some other libraries, fetch API resolves errors returned from the server, instead of rejecting them
          throw opError(
            content?.error || (typeof content === "string" && content) || "Request failed",
            {
              name: "Request error",
              status: responseObj.status || 400,
              ...content,
            }
          );
        }
        // "ok" responses
        // log response
        const response = { status: responseObj.status, data: content }
        console.log("RESPONSE:");
        console.log(response);

        return response;
      })
      .catch((error) => {
        if (
          requestConfig?.signal?.aborted &&
          requestConfig?.signal?.reason !== "timeout"
        ) {
          // ignore error when request is intentionally aborted by client
          console.log("pending request aborted by client:", requestConfig);
          console.log("reason:", requestConfig?.signal?.reason);
        } else {
          // otherwise reject error
          let errorOutput = error;
          if (requestConfig?.signal?.aborted) {
            errorOutput = opError("The server took too long to respond", {
              name: "Network error",
              status: 500,
            });
          }

          // log error
          console.log("ERROR:");
          console.log(errorOutput);

          return Promise.reject(errorOutput);
        }
      });
  }

  abort(reason) {
    console.log("ABORTING REQUEST:");
    console.log(this.config);
    this.abortController.abort(reason);
  }
}
