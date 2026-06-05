const { ChatOpenAI } = require("@langchain/openai");
require("dotenv").config();

const apiKey = process.env.OPENROUTER_API_KEY || "sk-or-v1-24iojnkfkn456tgffhhjklkjhgdfhjeugyuuguipudug3687439";

// ====================================================================
// 🧠 PHASE 1 ARCHITECTURE: OPTIMIZED INTERFACE MATRIX CONFIGURATION
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
  temperature: 0.1, 
  maxTokens: 2500, // Token budget limit safely bypassing credit thresholds

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
 * Helper utility to halt loop execution asynchronously for a specific duration
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 🛡️ PHASE 2 CORE: HIGH-RESILIENCY AI EVALUATION ROUTING WITH EXPONENTIAL BACKOFF
 */
async function executeResilientAIAnalysis(systemInstruction, fullyFormattedPrompt) {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // Standard invocation path
      const response = await openRouterModel.invoke([
        { role: "system", content: systemInstruction },
        { role: "user", content: fullyFormattedPrompt }
      ]);
      return response.content;

    } catch (error) {
      attempt++;
      console.error(`❌ [LLM Router] Request attempt ${attempt} failed:`, error.message);

      // Early short-circuit: If it's a known credit limitation error, skip retries and fire the compact fallback profile immediately
      if (error.message.includes("402") || error.message.includes("tokens")) {
        console.warn("⚠️ [LLM Router] Credit-based error intercepted. Skipping standard retry loops...");
        return runUltraCompactFallback(systemInstruction, fullyFormattedPrompt);
      }

      // If we still have retry budget left, execute exponential backoff delay calculation
      if (attempt < MAX_RETRIES) {
        const delayMs = Math.pow(2, attempt) * 1000; // 2^1 * 1000 = 2000ms, 2^2 * 1000 = 4000ms, etc.
        console.warn(`⏳ [Resiliency Engine] Gateway rate-limiting or network hiccup detected. Backing off for ${delayMs}ms before automated attempt ${attempt + 1}...`);
        await sleep(delayMs);
      } else {
        console.error("🚨 [Resiliency Engine] All standard connection attempts exhausted. Deploying ultimate failsafe recovery procedures...");
        return runUltraCompactFallback(systemInstruction, fullyFormattedPrompt);
      }
    }
  }
}

/**
 * Failsafe backup parser that uses a rigid token footprint to guarantee delivery
 */
async function runUltraCompactFallback(systemInstruction, fullyFormattedPrompt) {
  try {
    console.log("🛰️ [LLM Router Fallback] Initializing safe execution profile...");
    const ultraCompactModel = new ChatOpenAI({
      configuration: openRouterModel.configuration,
      apiKey: apiKey,
      openAIApiKey: apiKey,
      modelName: "google/gemini-2.5-flash",
      temperature: 0.0,
      maxTokens: 1500 // Strips output buffer to step neatly under strict API rate ceilings
    });
    
    const retryResponse = await ultraCompactModel.invoke([
      { role: "system", content: systemInstruction },
      { role: "user", content: fullyFormattedPrompt }
    ]);
    return retryResponse.content;
  } catch (fallbackError) {
    console.error("❌ [LLM Router Fallback] Terminal connection failure:", fallbackError.message);
    throw fallbackError; // Bubbles error up safely to be elegantly captured by server.js string fallbacks
  }
}

module.exports = { executeResilientAIAnalysis };