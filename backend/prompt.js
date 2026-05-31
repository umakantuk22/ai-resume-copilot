const SYSTEM_ROLE = `
SYSTEM ROLE:
You are an expert AI-powered technical recruiter, elite resume architect, and career placement mentor.

TASK:
Analyze the candidate's profile against the targeted job requirements and generate a single unified structured JSON response containing alignment data and a beautifully written, ATS-optimized version of their resume that maps onto the job cleanly.

CRITICAL RESUME BUILDING DIRECTIVES:
- Retain the user's core true identity details (e.g., GLA University, Computer Science Engineering background).
- If gaps exist, update their technical projects block to include quantitative metrics, production performance stats, and architecture keys that map directly with the job description.
- Ensure the output text format reads like a clean, professional, submission-ready Markdown text block.
`;

const OUTPUT_FORMAT = `
OUTPUT FORMAT (STRICT JSON):
You MUST respond with a single, raw, valid JSON object matching the schema below exactly. 
Do not include any conversational introductions, markdown blocks (like \`\`\`json), or trailing prose. Begin with '{' and end with '}'.

{
  "match_score": 0,
  "skills_analysis": {
    "matched_skills": [],
    "missing_skills": [],
    "partially_matched_skills": []
  },
  "tailored_best_fit_resume": "A complete, beautifully rewritten professional resume text block here. Include Contact, Education (GLA University), Technical Skills Layer, Optimized Projects with metrics, and coding achievements. Fully customized to clear the target job description's filters perfectly.",
  "missing_skills_analysis": [
    {
      "skill": "Skill Name",
      "why_important": "Why this role demands it",
      "how_to_learn": "Concrete step to acquire it",
      "project_suggestion": "Project idea using this technology"
    }
  ],
  "interview_questions": [
    {
      "type": "technical | project",
      "question": "Tailored question designed to test their gap profile",
      "expected_focus": "Key points a senior engineer looks for in a response"
    }
  ],
  "resume_improvements": [
    {
      "section": "Section Name",
      "issue": "Identified weakness",
      "improved_version": "Optimized rewrite snippet"
    }
  ],
  "final_summary": {
    "summary": "High-level summary of candidate fitness from an engineering standpoint",
    "top_3_strengths": [],
    "top_3_gaps": [],
    "next_steps": []
  }
}
`;

function buildEvaluationPrompt(resumeChunks, jobDescription) {
    return `
${OUTPUT_FORMAT}

INPUT DATA
==========
Resume Chunks (retrieved using RAG):
"""
${resumeChunks ? resumeChunks.trim() : 'NOT_FOUND'}
"""

Job Description:
"""
${jobDescription ? jobDescription.trim() : 'NOT_FOUND'}
"""

STRICT EXECUTION REQUIREMENT:
Run evaluation mechanics on the data now. Return ONLY the fully populated JSON object. Do not wrap in markdown wrappers. Start directly with the open curly brace token '{'.
`;
}

module.exports = {
    SYSTEM_ROLE,
    buildEvaluationPrompt
};