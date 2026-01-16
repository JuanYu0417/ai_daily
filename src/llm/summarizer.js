/**
 * LLM Summarizer
 *
 * Calls OpenAI API to generate structured summaries
 * for GitHub repositories.
 */

import OpenAI from "openai";
import { buildRepoSummaryPrompt } from "./prompt.js";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/**
 * Parse structured LLM output
 *
 * @param {string} text
 * @returns {{ en: string, cn: string, why: string }}
 */
function parseLLMOutput(text) {
  const getSection = (label) => {
    const regex = new RegExp(`${label}:\\n([\\s\\S]*?)(\\n\\n|$)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    en: getSection("EN_SUMMARY"),
    cn: getSection("CN_SUMMARY"),
    why: getSection("WHY_IT_MATTERS")
  };
}

/**
 * Summarize a single GitHub repository
 *
 * @param {Object} repo
 * @returns {Promise<Object>}
 */
export async function summarizeRepo(repo) {
  const prompt = buildRepoSummaryPrompt(repo);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise technical summarizer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty LLM response");
    }

    const parsed = parseLLMOutput(content);

    return {
      ...repo,
      summary_en: parsed.en,
      summary_cn: parsed.cn,
      why_it_matters: parsed.why
    };
  } catch (error) {
    console.error(`LLM summarization failed for ${repo.name}`, error.message);

    // 🔻 Fallback: no LLM, keep repo but mark summary as unavailable
    return {
      ...repo,
      summary_en: "Summary unavailable.",
      summary_cn: "摘要生成失败。",
      why_it_matters: "LLM summarization failed."
    };
  }
}

/**
 * Summarize multiple repositories sequentially
 * (safe for rate limits & cost control)
 *
 * @param {Array} repos
 * @returns {Promise<Array>}
 */
export async function summarizeRepos(repos = []) {
  const results = [];

  for (const repo of repos) {
    const summarized = await summarizeRepo(repo);
    results.push(summarized);
  }

  return results;
}
