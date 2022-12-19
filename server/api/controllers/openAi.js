import * as openAiService from "../services/openAi.js";

export const getPrayer = async (req, res) => {
  const {prompt, style, hotdog} = req.query;
  const includeHotDogma = hotdog === "false" ? false : true;
  const religiousStyle = style.slice(0, 31); // limit length of style string
  const userInput = prompt.slice(0, 255); // limit length of prompt
  if (!prompt) {
    return res.status(404).send({error: "Not found"});
  }
  try {
    const prayer = await openAiService.getPrayer(userInput, includeHotDogma, religiousStyle);
    return res.status(200).send({prayer});
  } catch (error) {
    console.error("Error getting openai prayer:", error);
    if (error.message === "moderation violation") {
      return res.status(422).send({error: "Request violates content moderation policies"});
    }
    return res.status(400).send({error: "Bad request"});
  }
}
