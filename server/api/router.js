import { Router } from "express";
import { getPrayer } from "./controllers/openAi.js";

const router = Router();

router.get("/openai/prayer", getPrayer);

router.get("/test", (req, res) => res.status(200).send({data: {answer: 42}}));

router.get("*", (req, res) => {
  return res.status(404).send({error: "Not found"});
});

export default router;