const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    try {
      const registration = navigator.serviceWorker.register("./serviceWorker.js", {scope: "./"});
      if (registration.installing) {
        console.log("service worker installing");
      } else if (registration.waiting) {
        console.log("service worker installed and waiting");
      } else if (registration.active) {
        console.log("service worker active");
      }
    } catch (error) {
      console.error("service worker registration failed with error:", error);
    }
  }
}

export const unregister = async () => {
  console.log("unregister called. unregistering all service workers")
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
  }
}

export default registerServiceWorker;