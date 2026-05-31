const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
require("dotenv").config();

/**
 * Executes high-speed procedural text chunk matching across candidate strings
 */
async function retrieveRelevantJobContext(resumeText, jobDescription) {
  try {
    console.log("🌀 [RAG Engine] Initializing text chunking strategy on target Job Description...");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 50
    });

    const chunks = await splitter.splitText(jobDescription);
    console.log(`📦 [RAG Engine] Generated ${chunks.length} discrete semantic text chunks.`);

    console.log("🔍 [RAG Engine] Isolating high-relevance description strings natively...");
    
    // Scans context terms natively to assemble optimal matches instantly
    const keywords = resumeText.toLowerCase().split(/[\s,.\/()\-]+/).filter(w => w.length > 4);
    const scoredChunks = chunks.map(chunk => {
      let score = 0;
      const lowerChunk = chunk.toLowerCase();
      keywords.forEach(word => { if (lowerChunk.includes(word)) score++; });
      return { chunk, score };
    });

    // Sort by best structural match relevance
    scoredChunks.sort((a, b) => b.score - a.score);
    const relevantChunks = scoredChunks.slice(0, 4).map(item => item.chunk);

    console.log("✅ [RAG Engine] Successfully retrieved high-relevance job description segments.");
    return relevantChunks.join("\n\n---\n\n");

  } catch (error) {
    console.error("❌ RAG Engine execution failed:", error.message);
    console.warn("⚠️ Falling back safely to raw text passing mode...");
    return jobDescription;
  }
}

module.exports = { retrieveRelevantJobContext };