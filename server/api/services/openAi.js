import { Configuration, OpenAIApi } from "openai";
import memCache from "./localCache.js";

const POLICED_CATEGORIES = ["hate", "hate/threatening", "sexual/minors"];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getModeration = async input => {
  const response = await openai.createModeration({input});
  return response?.data?.results;
}

export const getCompletion = prompt => {
  return openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 256,
    temperature: 0.95
  })
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

export const getPrayer = async (input, includeHotDogma, style = "Christianity") => {
  const [{categories}] = await getModeration(input);
  for (const category in categories) {
    if (categories[category] && POLICED_CATEGORIES.includes(category)) {
      throw(new Error("moderation violation"));
    }
  }
  const cacheKey = `${input}__${style}__${includeHotDogma}`;
  console.log("cacheKey:", cacheKey);
  // get cached prayer
  let prayer = await memCache.get(cacheKey);
  console.log("prayer:", prayer);
  if (!prayer) {
    const prompt = getPrayerPrompt(input, includeHotDogma, style);
    const updateFn = async () => {
      const response = await getCompletion(prompt);
      return response?.data?.choices && response.data.choices[0].text;
    }
    prayer = await updateFn();
    // cache prayer for 24 hours (or until server restarts)
    memCache.put(cacheKey, prayer, {updateFn, expirationTime: 1000 * 60 * 60 * 24});
  }
  return prayer;
};
