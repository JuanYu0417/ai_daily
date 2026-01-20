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
Provide the concise JSON summary as requested by the system instruction.

Repository:
- Name: ${repo.name}
- Description: ${repo.description}
- Primary Language: ${repo.language || "Unknown"}
- Stars: ${repo.stars}

Tasks(Map these to the JSON keys "en", "cn", "why"):
1. "en":Write a concise technical summary in English (2–3 sentences).
2. "cn":Write a concise Chinese summary (2–3 sentences).
3. "why":Explain "Why it matters" in ONE short sentence, focusing on practical or technical value.

Constraints:
- Be factual and technical.
- Avoid marketing language.
- Do NOT invent features that are not implied by the description.
- Keep the total response short and information-dense.

`.trim();
}
