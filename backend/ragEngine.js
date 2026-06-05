const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
require("dotenv").config();

// ====================================================================
// 🧠 HIGH-SIGNAL INLINE CONFIGURATION: ENTERPRISE SKILLS WEIGHT MATRIX
// ====================================================================
// Common English filler words that degrade local search relevance
const DISCARDED_STOP_WORDS = new Set([
  'about', 'above', 'after', 'again', 'against', 'along', 'around', 'before', 'behind',
  'below', 'beneath', 'between', 'beyond', 'during', 'except', 'forward', 'through',
  'under', 'until', 'while', 'would', 'should', 'could', 'their', 'there', 'these',
  'those', 'which', 'where', 'using', 'using', 'based', 'highly', 'strong', 'experience'
]);

// Premium technical terms that indicate core engineering alignment
const TECH_STACK_WEIGHT_MULTIPLIERS = {
  'java': 3, 'javascript': 3, 'react': 3, 'node': 3, 'mongodb': 3, 'express': 3,
  'mern': 4, 'rag': 4, 'llm': 4, 'dsa': 3, 'python': 3, 'aws': 3, 'docker': 3,
  'sql': 3, 'rest': 3, 'api': 3, 'backend': 2, 'frontend': 2, 'fullstack': 3
};

/**
 * Normalizes words down to their root stems to prevent variations from breaking matches
 */
function normalizeToRootStem(word) {
  let cleaned = word.toLowerCase().trim();
  if (cleaned.length <= 3) return cleaned;
  
  // High-speed native trimming rules for common engineering verb suffixes
  if (cleaned.endsWith('ing')) return cleaned.slice(0, -3);
  if (cleaned.endsWith('ed')) return cleaned.slice(0, -2);
  if (cleaned.endsWith('ment')) return cleaned.slice(0, -4);
  if (cleaned.endsWith('s') && !cleaned.endsWith('ss')) return cleaned.slice(0, -1);
  
  return cleaned;
}

/**
 * Executes high-speed hybrid text chunk matching across candidate strings
 */
async function retrieveRelevantJobContext(resumeText, jobDescription) {
  try {
    console.log("\n🌀 [RAG Engine] Initializing advanced semantic text chunking strategy...");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 450, // Balanced size maximizing prompt structural integrity
      chunkOverlap: 60  // Preserves sentence boundaries across splits
    });

    const chunks = await splitter.splitText(jobDescription);
    console.log(`📦 [RAG Engine] Partitioned target text into ${chunks.length} localized chunks.`);

    console.log("🔍 [RAG Engine] Executing hybrid keyword-weight matrix calculations...");
    
    // Step 1: Tokenize the candidate's resume and extract high-signal keywords
    const rawTokens = resumeText.toLowerCase().split(/[\s,.\/()\-]+/);
    const uniqueKeywordsMap = new Map();

    rawTokens.forEach(token => {
      if (token.length < 3 || DISCARDED_STOP_WORDS.has(token)) return;
      
      const stem = normalizeToRootStem(token);
      // Assign custom multipliers to heavy technical terms, fallback to 1 for standard terms
      const inherentWeight = TECH_STACK_WEIGHT_MULTIPLIERS[token] || TECH_STACK_WEIGHT_MULTIPLIERS[stem] || 1;
      
      uniqueKeywordsMap.set(stem, inherentWeight);
    });

    // Step 2: Score each text chunk based on weighted keyword match occurrences
    const scoredChunks = chunks.map(chunk => {
      let cumulativeScore = 0;
      const chunkTokens = chunk.toLowerCase().split(/[\s,.\/()\-]+/);
      
      // Normalize chunk tokens to perform stem-to-stem matches
      const chunkStems = chunkTokens.map(t => normalizeToRootStem(t));

      // Check unique keywords against the chunk stems array
      for (const [keywordStem, weight] of uniqueKeywordsMap.entries()) {
        if (chunkStems.includes(keywordStem)) {
          cumulativeScore += weight; // Accelerate score rank using our engineering multipliers
        }
      }
      return { chunk, score: cumulativeScore };
    });

    // Step 3: Sort by highest score rank stability matrix
    scoredChunks.sort((a, b) => b.score - a.score);
    
    // Isolate top 4 high-signal context blocks
    const relevantChunks = scoredChunks.slice(0, 4).map(item => item.chunk);

    console.log("✅ [RAG Engine] Matrix execution finalized. High-signal segments successfully bound.");
    return relevantChunks.join("\n\n---\n\n");

  } catch (error) {
    console.error("❌ RAG Engine matrix calculation crash:", error.message);
    console.warn("⚠️ Deploying emergency fallback: routing raw job description block...");
    return jobDescription;
  }
}

module.exports = { retrieveRelevantJobContext };