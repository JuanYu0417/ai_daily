/**
 * Repository Ranking
 *
 * Scores and ranks GitHub repositories based on popularity and recency.
 */

/**
 * Calculate recency score (0 ~ 1)
 * Newer updates get higher score
 *
 * @param {string} updatedAt - ISO date string
 * @param {number} maxDays
 * @returns {number}
 */
function calculateRecencyScore(updatedAt, maxDays = 30) {
  const updatedTime = new Date(updatedAt).getTime();
  const now = Date.now();

  const diffDays = (now - updatedTime) / (1000 * 60 * 60 * 24);

  if (diffDays <= 0) return 1;
  if (diffDays >= maxDays) return 0;

  return 1 - diffDays / maxDays;
}

/**
 * Rank repositories by score
 *
 * @param {Array} repos
 * @param {Object} options
 * @param {number} options.starWeight
 * @param {number} options.recencyWeight
 * @param {number} options.maxDays
 * @param {number} options.limit
 * @returns {Array}
 */
export function rankRepos(
  repos = [],
  {
    starWeight = 0.6,
    recencyWeight = 0.4,
    maxDays = 30,
    limit = 5
  } = {}
) {
  if (!Array.isArray(repos)) {
    throw new Error("rankRepos expects an array of repositories");
  }

  const scoredRepos = repos.map(repo => {
    const starScore = Math.log10(repo.stars + 1); // smooth large star gaps
    const recencyScore = calculateRecencyScore(repo.updated_at, maxDays);

    const score =
      starScore * starWeight +
      recencyScore * recencyWeight;

    return {
      ...repo,
      score: Number(score.toFixed(4))
    };
  });

  return scoredRepos
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
