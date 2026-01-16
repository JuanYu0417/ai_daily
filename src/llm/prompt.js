/**
 * Prompt templates for LLM summarization
 *
 * This file defines structured prompts used to summarize
 * GitHub repositories into daily AI calendar content.
 */

/**
 * Build prompt for GitHub repository summarization
 *
 * @param {Object} repo
 * @param {string} repo.name
 * @param {string} repo.description
 * @param {string} repo.language
 * @param {number} repo.stars
 * @returns {string}
 */
export function buildRepoSummaryPrompt(repo) {
  return `
You are a senior AI engineer and technical analyst.

Given the following GitHub repository information, generate a concise and structured summary.

Repository:
- Name: ${repo.name}
- Description: ${repo.description}
- Primary Language: ${repo.language || "Unknown"}
- Stars: ${repo.stars}

Tasks:
1. Write a concise technical summary in English (2–3 sentences).
2. Write a concise Chinese summary (2–3 sentences).
3. Explain "Why it matters" in ONE short sentence, focusing on practical or technical value.

Constraints:
- Be factual and technical.
- Avoid marketing language.
- Do NOT invent features that are not implied by the description.
- Keep the total response short and information-dense.

Output format (STRICT):

EN_SUMMARY:
<English summary>

CN_SUMMARY:
<Chinese summary>

WHY_IT_MATTERS:
<One sentence explanation>
`.trim();
}
