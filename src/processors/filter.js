/**
 * Repository Filter
 *
 * Filters GitHub repositories based on quality rules.
 */

/**
 * Filter repositories by basic quality rules
 *
 * @param {Array} repos - GitHub repositories
 * @param {Object} options
 * @param {number} options.minStars
 * @param {string[]} options.allowedLanguages
 * @returns {Array}
 */
export function filterRepos(
  repos = [],
  {
    minStars = 0,
    allowedLanguages = []
  } = {}
) {
  if (!Array.isArray(repos)) {
    throw new Error("filterRepos expects an array of repositories");
  }

  return repos.filter(repo => {
    if (!repo) return false;

    // 1️⃣ Minimum stars
    if (repo.stars < minStars) {
      return false;
    }

    // 2️⃣ Language whitelist (if provided)
    if (
      allowedLanguages.length &&
      (!repo.language || !allowedLanguages.includes(repo.language))
    ) {
      return false;
    }

    // 3️⃣ Must have description
    if (!repo.description || repo.description.trim().length === 0) {
      return false;
    }

    return true;
  });
}
