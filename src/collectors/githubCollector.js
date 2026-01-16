/**
 * GitHub Repository Collector
 *
 * Fetches trending AI repositories from GitHub Search API
 * based on topics and ranking strategy.
 */

import fetch from "node-fetch";

/**
 * Build GitHub search query from topics
 * @param {string[]} topics
 * @returns {string}
 */
export function buildQuery(rawTopics = []) {
  const topics = (rawTopics || [])
    .map(t => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
    .filter(Boolean);

  const unique = Array.from(new Set(topics));
  if (unique.length === 0) {
    throw new Error("No valid GitHub topics found in configuration");
  }
  return unique.map(t => `topic:${t}`).join(' OR ');
}

/**
 * Fetch repositories from GitHub Search API
 * @param {Object} options
 * @param {string[]} options.topics
 * @param {number} options.perPage
 * @param {string} options.sort
 * @param {string} options.order
 * @returns {Promise<Array>}
 */
export async function fetchGitHubRepos({
  topics = [],
  perPage = 10,
  sort = "stars",
  order = "desc"
}) {
  const query = buildQuery(topics);

  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.append("q", query);
  url.searchParams.append("sort", sort);
  url.searchParams.append("order", order);
  url.searchParams.append("per_page", perPage.toString());

  const response = await fetch(url.toString(), {
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "ai-daily-calendar-bot"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.items || !Array.isArray(data.items)) {
    throw new Error("Invalid GitHub API response format");
  }

  return data.items.map(repo => ({
    name: repo.full_name,
    description: repo.description || "",
    stars: repo.stargazers_count,
    url: repo.html_url,
    updated_at: repo.updated_at,
    language: repo.language
  }));
}
