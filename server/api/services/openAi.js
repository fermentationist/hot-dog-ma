import OpenAIApi from "openai";
import memCache from "./localCache.js";

const GPT_MODEL = process.env.GPT_MODEL || "gpt-3.5-turbo";
const POLICED_CATEGORIES = ["hate", "hate/threatening", "sexual/minors"];
const TOKEN_LIMIT = 2048;
const MODEL_TEMPERATURE = 0.95;

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAIApi(configuration);

export const getModeration = async input => {
  const response = await openai.moderations.create({input});
  return response?.results?.[0]?.categories;
}

export const getCompletion = async prompt => {
  const response = await openai.chat.completions.create({
    model: GPT_MODEL,
    messages: [{role: "user", content: prompt}],
    max_tokens: TOKEN_LIMIT,
    temperature: MODEL_TEMPERATURE,
  });
  console.log("\nGPT response:", response.choices?.[0]?.message)
  console.log("\nGPT model used:", response?.model);
  console.log("Total tokens:", response?.usage?.total_tokens);
  return response?.choices &&
      response.choices?.[0]?.message?.content;
}

const getPrayerPrompt = (input, includeHotDogma, religion) => {
  let form, style;
  const hotDogma = includeHotDogma ? ", that also acknowledges that a hot dog is a sandwich, and that ketchup must never be put on the hot dog, but only mention ketchup once" : "";

  switch (religion.toLowerCase()) {
    case "secular":
      form = "secular meditation"
      style = "Kurt Vonnegut";
      break;
    case "christianity":
      form = "Christian prayer";
      style = "the Book of Psalms";
      break;
    case "judaism":
      form = "Jewish prayer";
      style = "the Torah";
      break;
    case "hinduism":
      form = "Hindu prayer";
      style = "the Bhagavad Gita";
      break;
    case "islam":
      form = "Muslim prayer";
      style = "the Zabur";
      break;
    case "buddhism":
      form = "Buddhist prayer";
      style = "the Pali Udana";
      break;
    default:
      form = "Christian prayer";
      style = "the Book of Psalms";
  }
  return `Write a ${form} in the style of ${style}, about "${input}"${hotDogma}.`;
}

export const getPrayer = async (userInput, includeHotDogma, style = "Christianity") => {
  const input = userInput.slice(0, 255); // truncate user input
  const categories = await getModeration(input);
  if (categories) {
    for (const category in categories) {
      if (categories[category] && POLICED_CATEGORIES.includes(category)) {
        throw(new Error("moderation violation"));
      }
    }
  }
  const cacheKey = `${input}__${style}__${includeHotDogma}`;
  // get cached prayer
  let prayer = await memCache.get(cacheKey);
  if (!prayer) {
    const prompt = getPrayerPrompt(input, includeHotDogma, style);
    const updateFn = async () => {
      const response = await getCompletion(prompt);
      return response;
    }
    prayer = await updateFn();
    // cache prayer for 24 hours (or until server restarts)
    memCache.put(cacheKey, prayer, {updateFn, expirationTime: 1000 * 60 * 60 * 24});
  }
  return prayer;
};
