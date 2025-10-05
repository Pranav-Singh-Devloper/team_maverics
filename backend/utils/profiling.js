import { githubRequest, githubRequestSafe, getNpmDownloads, calculateBusFactor } from './github.js';

export async function fetchRepoProfile(fullName) {
  console.log(`📦 Profiling: ${fullName}`);
  
  const [owner, repo] = fullName.split('/');
  
  // Fetch all repository data in parallel
  const [
    repoData,
    commits,
    releases,
    issues,
    pullRequests,
    readme,
    contributingFile,
    codeOfConduct
  ] = await Promise.all([
    githubRequest(`/repos/${fullName}`),
    githubRequestSafe(`/repos/${fullName}/commits?per_page=100`, []),
    githubRequestSafe(`/repos/${fullName}/releases?per_page=100`, []),
    githubRequestSafe(`/repos/${fullName}/issues?state=all&per_page=100`, []),
    githubRequestSafe(`/repos/${fullName}/pulls?state=all&per_page=100`, []),
    githubRequestSafe(`/repos/${fullName}/readme`, null),
    githubRequestSafe(`/repos/${fullName}/contents/CONTRIBUTING.md`, null),
    githubRequestSafe(`/repos/${fullName}/contents/CODE_OF_CONDUCT.md`, null)
  ]);
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  
  const commits_last_30_days = commits.filter(c => 
    new Date(c.commit.author.date) > thirtyDaysAgo
  ).length;
  
  const releases_last_90_days = releases.filter(r => 
    new Date(r.created_at) > ninetyDaysAgo
  ).length;
  
  const goodFirstIssuesData = await githubRequestSafe(
    `/search/issues?q=repo:${fullName}+is:open+label:"good first issue"`,
    { total_count: 0 }
  );
  const good_first_issues = goodFirstIssuesData.total_count || 0;
  const recentIssues = issues.filter(i => 
    new Date(i.created_at) > sixMonthsAgo && !i.pull_request
  );
  const closedRecentIssues = recentIssues.filter(i => i.state === 'closed');
  const issue_closure_rate = recentIssues.length > 0 
    ? closedRecentIssues.length / recentIssues.length 
    : 0;
  
  const recentPRs = pullRequests.slice(0, 100);
  const mergedPRs = recentPRs.filter(pr => pr.merged_at !== null);
  const pr_merge_ratio = recentPRs.length > 0 
    ? mergedPRs.length / recentPRs.length 
    : 0;
  
  const bus_factor = calculateBusFactor(commits);
  
  const packageName = repoData.name.toLowerCase();
  const weekly_downloads = (repoData.language === 'JavaScript' || repoData.language === 'TypeScript')
    ? await getNpmDownloads(packageName)
    : 0;
  
  let readme_content = '';
  const documentation_metrics = {
    has_readme: readme !== null,
    readme_length: 0,
    license_type: repoData.license?.spdx_id || 'NONE',
    has_contributing: contributingFile !== null,
    has_code_of_conduct: codeOfConduct !== null,
    readme_sections: 0,
    has_badges: false,
    has_docs_folder: false,
    has_wiki: repoData.has_wiki
  };
  
  if (readme && readme.content) {
    try {
      readme_content = Buffer.from(readme.content, 'base64').toString('utf-8');
      documentation_metrics.readme_length = readme_content.length;
      const sectionMatches = readme_content.match(/^##\s+/gm);
      documentation_metrics.readme_sections = sectionMatches ? sectionMatches.length : 0;
      documentation_metrics.has_badges = /!\[.*?\]\(.*?(badge|shield).*?\)/i.test(readme_content);
    } catch (error) {
      console.warn(`Failed to parse README for ${fullName}`);
    }
  }
  
  try {
    const contents = await githubRequest(`/repos/${fullName}/contents`);
    documentation_metrics.has_docs_folder = contents.some(item => 
      item.type === 'dir' && (item.name === 'docs' || item.name === 'documentation')
    );
  } catch {}
  
  return {
    full_name: fullName,
    name: repoData.name,
    description: repoData.description,
    topics: repoData.topics || [],
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    weekly_downloads,
    created_at: repoData.created_at,
    pushed_at: repoData.pushed_at,
    commits_last_30_days,
    releases_last_90_days,
    good_first_issues,
    issue_closure_rate: parseFloat(issue_closure_rate.toFixed(2)),
    pr_merge_ratio: parseFloat(pr_merge_ratio.toFixed(2)),
    bus_factor,
    has_security_vulnerabilities: false,
    documentation_metrics,
    readme_content
  };
}
