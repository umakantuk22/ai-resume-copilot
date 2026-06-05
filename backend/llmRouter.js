const { ChatOpenAI } = require("@langchain/openai");
require("dotenv").config();

const apiKey = process.env.OPENROUTER_API_KEY || "sk-or-v1-24iojnkfkn456tgffhhjklkjhgdfhjeugyuuguipudug3687439";

// ====================================================================
// 🧠 TOP 1% TUNING: OPTIMIZED INTERFACE MATRIX CONFIGURATION
// ====================================================================
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
  temperature: 0.1, // Adjusted slightly to allow fluid JSON structural balancing
  
  // ⚡ TOKENS BUDGET FIX: Throttled to 2500 max output tokens.
  // This easily handles long structured JSON summaries while sliding cleanly under OpenRouter's credit ceiling limit.
  maxTokens: 2500, 

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

/**
 * Executes high-resiliency server-side AI evaluation routing over multi-model chains
 */
async function executeResilientAIAnalysis(systemInstruction, fullyFormattedPrompt) {
  try {
    const response = await openRouterModel.invoke([
      { role: "system", content: systemInstruction },
      { role: "user", content: fullyFormattedPrompt }
    ]);
    return response.content;
  } catch (error) {
    console.error("❌ OpenRouter Gateway Request Failure:", error.message);
    
    // Fallback logic check: If a strict limit error occurs again, intercept and run a tight safe configuration patch
    if (error.message.includes("402") || error.message.includes("tokens")) {
      console.warn("⚠️ [LLM Router Critical Fallback] Adjusting token budgeting metrics dynamically on secondary pass...");
      
      try {
        // Tight, ultra-compact fallback execution profile
        const ultraCompactModel = new ChatOpenAI({
          configuration: openRouterModel.configuration,
          apiKey: apiKey,
          openAIApiKey: apiKey,
          modelName: "google/gemini-2.5-flash",
          temperature: 0.0,
          maxTokens: 1500 // Drops the ceiling to an ultra-safe level to drain remaining free credits perfectly
        });
        
        const retryResponse = await ultraCompactModel.invoke([
          { role: "system", content: systemInstruction },
          { role: "user", content: fullyFormattedPrompt }
        ]);
        return retryResponse.content;
      } catch (fallbackError) {
        console.error("❌ [LLM Router Critical Fallback] Secondary execution link snapped:", fallbackError.message);
        throw fallbackError;
      }
    }
    throw error;
  }
}

module.exports = { executeResilientAIAnalysis };