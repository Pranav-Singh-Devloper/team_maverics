import { GITHUB_API_BASE, GITHUB_HEADERS, NPM_REGISTRY } from '../config/config.js';

export async function githubRequest(endpoint) {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers: GITHUB_HEADERS });
  if (!response.ok) throw new Error(`GitHub API ${response.status}`);
  return response.json();
}

export async function githubRequestSafe(endpoint, fallback = null) {
  try {
    return await githubRequest(endpoint);
  } catch (error) {
    console.warn(`Failed ${endpoint}:`, error.message);
    return fallback;
  }
}

export async function getNpmDownloads(packageName) {
  try {
    const response = await fetch(`${NPM_REGISTRY}/${packageName}`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.downloads || 0;
  } catch {
    return 0;
  }
}

export async function searchGitHub(query) {
  const params = new URLSearchParams({ q: query, sort: 'stars', order: 'desc', per_page: 30 });
  return githubRequest(`/search/repositories?${params}`);
}

// Calculate bus factor (how many contributors control 80% of commits)
export function calculateBusFactor(commits) {
  if (!commits || commits.length === 0) return 0;
  
  const contributorCommits = {};
  commits.forEach(commit => {
    const author = commit.author?.login || commit.commit.author.name;
    contributorCommits[author] = (contributorCommits[author] || 0) + 1;
  });
  
  const sorted = Object.values(contributorCommits).sort((a, b) => b - a);
  const totalCommits = commits.length;
  const threshold = totalCommits * 0.8;
  
  let cumulative = 0;
  let busFactor = 0;
  
  for (const count of sorted) {
    cumulative += count;
    busFactor++;
    if (cumulative >= threshold) break;
  }
  
  return busFactor;
}
