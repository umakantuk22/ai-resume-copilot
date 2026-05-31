const { ChatOpenAI } = require("@langchain/openai");
require("dotenv").config();

const apiKey = process.env.OPENROUTER_API_KEY || "sk-or-v1-24iojnkfkn456tgffhhjklkjhgdfhjeugyuuguipudug3687439";

const openRouterModel = new ChatOpenAI({
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://127.0.0.1:5500",
      "X-Title": "AI Resume Copilot Portfolio Build",
    }
  },
  apiKey: apiKey,
  openAIApiKey: apiKey,
  modelName: "google/gemini-2.5-flash",
  temperature: 0.0,
  maxTokens: 8192, // ⚡ FIXED: Crucial for free tier. Prevents the 402 credit limitation crash.
  modelKwargs: {
    "extra_body": {
      "models": [
        "google/gemini-2.5-flash", 
        "meta-llama/llama-3.3-70b-instruct", 
        "openai/gpt-4o-mini"
      ]
    }
  }
});

async function executeResilientAIAnalysis(systemInstruction, fullyFormattedPrompt) {
  try {
    const response = await openRouterModel.invoke([
      { role: "system", content: systemInstruction },
      { role: "user", content: fullyFormattedPrompt }
    ]);
    return response.content;
  } catch (error) {
    console.error("❌ OpenRouter Gateway Request Failure:", error.message);
    throw error;
  }
}

module.exports = { executeResilientAIAnalysis };