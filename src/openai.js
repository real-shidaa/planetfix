import OpenAI from "openai";
console.log("OpenAI API Key:", process.env.REACT_APP_OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Dev only
});

export default openai;