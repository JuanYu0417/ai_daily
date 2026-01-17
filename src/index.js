/**
 * Main Orchestrator — AI Daily Calendar
 *
 * Pipeline:
 * 1. Fetch GitHub repos
 * 2. Filter & rank
 * 3. Summarize with LLM
 * 4. Generate Markdown
 * 5. Commit to GitHub
 * 6. Optionally send Email
 */
import "dotenv/config";
//import config from "./config/default.json" with { type: "json" };
import { createRequire } from "module";
import { fetchGitHubRepos } from "./collectors/githubCollector.js";
import { filterRepos } from "./processors/filter.js";
import { rankRepos } from "./processors/rank.js";
import { summarizeRepos } from "./llm/summarizer.js";
import { generateMarkdown, saveDailyMarkdown } from "./generators/markdown.js";
import { commitAndPushDaily } from "./services/git.js";
import { mailer } from "./services/mailer.js";

const require = createRequire(import.meta.url);
const config = require("./config/default.json");

const date = new Date().toISOString().slice(0, 10);

async function main() {
  console.log("🚀 Starting AI Daily Calendar pipeline:", date);

  try {
    if (!config.topics || !Array.isArray(config.topics) || config.topics.length === 0) {
      throw new Error("❌ Config Error: 'topics' is missing or empty in default.json");
    }
    console.log("⚙️  Config loaded. Topics:", config.topics);
    // 1️⃣ Fetch
    const repos = await fetchGitHubRepos({
      topics: config.topics,
      perPage: 20
    });
    console.log(`📥 Fetched ${repos.length} repositories.`);

    // 2️⃣ Filter
    const filtered = filterRepos(repos, {
      minStars: config.stars_threshold,
      allowedLanguages: config.language_whitelist
    });

    // 3️⃣ Rank
    const ranked = rankRepos(filtered, {
      limit: config.max_repos
    });

    // 4️⃣ Summarize
    const summarized = await summarizeRepos(ranked);

    // 5️⃣ Generate Markdown
    const markdown = generateMarkdown({
      date,
      category: "LLM / AI Tools",
      repos: summarized
    });

    const filePath = saveDailyMarkdown(markdown, date);
    console.log("✅ Markdown saved:", filePath);

    // 6️⃣ Commit to Git
    //commitAndPushDaily(date);

    // 7️⃣ Send email (optional)
    await mailer({
      date,
      markdown,
      to: process.env.EMAIL_TO?.split(",") || []
    });

  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
    process.exit(1);
  }
}

main();
