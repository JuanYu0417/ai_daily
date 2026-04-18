/**
 * LLM Summarizer
 *
 * Calls OpenAI API to generate structured summaries
 * for GitHub repositories.
 */

import OpenAI from "openai";
import { buildRepoSummaryPrompt } from "./prompt.js";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" 
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Parse structured LLM output
 *
 * @param {string} text
 * @returns {{ en: string, cn: string, why: string }}
 */
function parseLLMOutput(text) {
 try {
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.warn("JSON Parse Failed, raw text:", text);
    return { en: "", cn: "", why: "" };
  }
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
      model: process.env.LLM_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", 
          content: `You are a technical summarizer. You MUST return valid JSON with exactly these keys: "en" (English summary), "cn" (Chinese summary), "why" (Why it matters).` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" }
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
export async function summarizeRepos(repos = [], delayMs = 1000) {
  const results = [];

  for (const repo of repos) {
    const summarized = await summarizeRepo(repo);
    results.push(summarized);
    await sleep(delayMs);
  }

  return results;
}
