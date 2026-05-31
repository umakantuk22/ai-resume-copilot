const { discoverLiveJobs } = require('./jobRecommender');

async function testDiscovery() {
  console.log("⚙️ Triggering live network stream request...");
  
  // Simulated candidate resume profile focusing on your stack profile text markers
  const mockResume = "Umakant Sharma. Full Stack Web Developer proficient in React.js, Node.js, Express, and MongoDB.";
  
  try {
    const jobs = await discoverLiveJobs(mockResume, 3);
    console.log("\n================================================================");
    console.log("🚀 LIVE JOB DISCOVERY ENGINE: PIPELINE FULLY OPERATIONAL!");
    console.log(JSON.stringify(jobs, null, 2));
    console.log("================================================================\n");
  } catch (err) {
    console.error("❌ Fatal network test compilation failure:", err.message);
  }
}

testDiscovery();