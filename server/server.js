import "dotenv/config";
import express from "express";
import axios from "axios";
import rateLimiter from "./rateLimiter.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import apiRouter from "./api/router.js";
import { API_SERVER_PORT } from "../vite.config.js";

const SELF_URL = "https://hot-dog-ma.onrender.com";
const WAKE_SERVER_INTERVAL = 1000 * 60 * 14; // 14 minutes

const PROD_MODE = process.env.PROD_MODE === "true";
const STATIC_FOLDER = PROD_MODE ? "../build/" : "../";
const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const staticPath = path.join(dirName, STATIC_FOLDER);
app.use(express.static(staticPath));

app.use("/api", rateLimiter, apiRouter);

app.listen(API_SERVER_PORT, () => {
  console.log(`Express app listening on port ${API_SERVER_PORT}`);

  setInterval(() => {
    // keep server awake
    console.log(`Fetching ${SELF_URL} to wake up server`);
    axios({
      url: SELF_URL,
      timeout: 20000
    })
      .then(() => {
        console.log("Server is awake");
      })
      .catch((error) => {
        console.log(`Error fetching ${SELF_URL}: ${error.message}`)
      });
  }, WAKE_SERVER_INTERVAL);
});

export default app;
