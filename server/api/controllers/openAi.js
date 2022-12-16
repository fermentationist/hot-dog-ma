import * as openAiService from "../services/openAi.js";

export const getPrayer = async (req, res) => {
  const {prompt, style, hotdog} = req.query;
  const includeHotDogma = hotdog === "false" ? false : true;
  if (!prompt) {
    return res.status(404).send({error: "Not found"});
  }
  try {
    const prayer = await openAiService.getPrayer(prompt, includeHotDogma, style);
    return res.status(200).send({prayer});
  } catch (error) {
    console.error("Error getting openai psalm:", error);
    if (error.message === "moderation violation") {
      return res.status(422).send({error: "Request violates content policies"});
    }
    return res.status(400).send({error: "Bad request"});
  }
}
