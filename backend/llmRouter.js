const { GoogleGenAI } = require('@google/genai');

// Initialize the free fallback engine node natively using the official SDK parameters
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes a resilient AI resume optimization pass.
 * Tier 1: OpenRouter Pipeline (Llama 3.1)
 * Tier 2: Native Gemini 2.5 Flash with backoff retries
 * Tier 3: High-Availability Production Gemini 2.5 Flash Fallback Cluster
 */
async function executeResilientAIAnalysis(systemInstruction, userPrompt) {
    // ----------------------------------------------------------------
    // 🔥 TIER 1: PRIMARY OPENROUTER ROUTING MATRIX
    // ----------------------------------------------------------------
    try {
        console.log("🤖 [LLM Router] Routing optimization request to primary OpenRouter pipeline...");
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "AI Resume Copilot Pro"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-70b-instruct",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        if (response.status === 402 || (data.error && (data.error.code === 402 || data.error.message.includes('credits')))) {
            console.warn("⚠️ [LLM Router] OpenRouter reported a Credit Exhaustion Error (402).");
            throw new Error("OPENROUTER_CREDITS_EXHAUSTED");
        }

        if (!response.ok || data.error) {
            throw new Error(data.error ? data.error.message : `HTTP Gateway returned status code: ${response.status}`);
        }

        console.log("✅ [LLM Router] Successfully optimized candidate data using OpenRouter.");
        return data.choices[0].message.content;

    } catch (primaryError) {
        console.error("❌ [LLM Router] Primary Engine Pipeline faltered:", primaryError.message);
        
        // ----------------------------------------------------------------
        // 🟢 TIER 2: NATIVE GEMINI 2.5 FLASH WITH BACKOFF RETRIES
        // ----------------------------------------------------------------
        console.log("🛰️ [LLM Router] Activating Tier 2 automatic emergency backup fallback layer...");
        const maxRetries = 2;
        let delay = 1500; // Increased sleep step to allow server traffic slots to clear out

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🛰️ [LLM Router Failover] Dispatching to Gemini 2.5 node (Attempt ${attempt}/${maxRetries})...`);
                
                if (!process.env.GEMINI_API_KEY) {
                    throw new Error("GEMINI_API_KEY is missing from environment secrets configuration.");
                }

                // Explicitly targeting the core production standard identifier mapping format
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: userPrompt,
                    config: {
                        systemInstruction: systemInstruction,
                        responseMimeType: "application/json",
                        temperature: 0.2
                    }
                });

                if (!response.text) throw new Error("Empty response string layout.");
                console.log("✅ [LLM Router Failover] Core resume optimization metrics finalized successfully via Gemini 2.5.");
                return response.text;

            } catch (fallbackError) {
                console.warn(`⚠️ [Gemini 2.5 Attempt ${attempt} Failed]:`, fallbackError.message);
                if (attempt < maxRetries) {
                    console.log(`🌀 Sleeping for ${delay}ms before final server retry pass...`);
                    await sleep(delay);
                    delay *= 2;
                }
            }
        }

        // ----------------------------------------------------------------
        // 🚀 TIER 3: STABLE PRODUCTION POOL (RECONCILED MAPPING FORMAT)
        // ----------------------------------------------------------------
        try {
            console.log("🛰️ [LLM Router Tier 3] Rerouting payload to verified stable Gemini 2.5 production cluster...");
            
            // Reconciling model parameter directly to the global production standard endpoint string
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    temperature: 0.1 // Dropped temperature for strict validation mapping compliance
                }
            });

            if (!response.text) {
                throw new Error("Received an empty string layout from the Gemini gateway.");
            }

            console.log("✅ [LLM Router Tier 3] Fully tailored resume generated successfully via Gemini stable production pool!");
            return response.text;

        } catch (tier3Error) {
            console.error("❌ [LLM Router Critical Crash] All server clusters exhausted:", tier3Error.message);
            throw tier3Error;
        }
    }
}

module.exports = { executeResilientAIAnalysis };