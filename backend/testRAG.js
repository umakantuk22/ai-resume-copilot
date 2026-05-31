const { retrieveRelevantJobContext } = require('./ragEngine');

const sampleResume = `
Umakant Sharma
Full Stack Developer
Technical Projects:
- Car Rental Application and Fitness tracker built using MongoDB, Express.js, React.js, and Node.js.
- Implemented state management and backend routing APIs.
- Solved 150+ DSA coding problems on LeetCode using Java.
`;

const sampleJobDescription = `
Associate Software Engineer Job Opening
We are seeking an engineer to build highly scalable backend web applications.
Required Qualifications:
- Strong experience with JavaScript, Node.js, and Express framework API routing architectures.
- Experience with frontend component rendering via React.js libraries.
- Proficient in Data Structures and Algorithms (DSA) principles.
Preferred Qualifications:
- Understanding of automated testing suites like Jest or Mocha.
- Familiarity with CI/CD orchestration and cloud deployment routines.
`;

async function runRAGTest() {
  console.log("⚙️ Testing local RAG cross-retrieval infrastructure...");
  try {
    const context = await retrieveRelevantJobContext(sampleResume, sampleJobDescription);
    console.log("\n================================================================");
    console.log("🚀 LOCAL RAG CORE PIPELINE: OPERATIONAL!");
    console.log("Extracted Semantic Context blocks Passed to Prompt:\n");
    console.log(context);
    console.log("================================================================\n");
  } catch (error) {
    console.error("\n❌ RAG PIPELINE TEST FAILED!");
    console.error("Error details:", error.message, "\n");
  }
}

runRAGTest();