import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import registerServiceWorker from "./serviceWorkerRegistration.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// uncomment to activate service worker
// registerServiceWorker();
