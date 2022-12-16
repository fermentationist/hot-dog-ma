const CACHE_NAME = "wordle_assistant";

const preCache = async resources => {
  try {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(resources);
  } catch (error) {
    console.error("error loading precache:", error);
  }
};

const handleFetch = async event => {
  const {request} = event;
  if (request.method.toLowerCase() === "get") {
    // console.log("request:", request);
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    let response = cached;
    if (!cached) {
      response = await fetch(request).catch(error => error);
      const responseClone = response.clone();
      await cache.add(request, responseClone).catch(error => {/*do nothing*/});
      // console.log("response:", response);
    } else {
      // console.log("cached response:", cached);
    }
    return response;
  }
}

self.addEventListener("activate", event => {
  const serviceWorker = event.target.serviceWorker;
  console.log("service worker being activated:", serviceWorker);
});

self.addEventListener("fetch", event => {
  event.respondWith(handleFetch(event));
})