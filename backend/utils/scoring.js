import { PERSONA_WEIGHTS } from '../config/config.js';
import { isAfter, subDays } from 'date-fns';

export function calculateDocumentationScore(metrics) {
  let earnedPoints = 0;
  const maxPoints = 100;
  
  if (metrics.has_readme) earnedPoints += 15;
  if (['MIT', 'Apache-2.0'].includes(metrics.license_type)) earnedPoints += 10;
  if (metrics.has_contributing) earnedPoints += 10;
  if (metrics.has_code_of_conduct) earnedPoints += 5;
  if (metrics.readme_length > 1500) earnedPoints += 10;
  if (metrics.readme_sections >= 3) earnedPoints += 15;
  if (metrics.has_badges) earnedPoints += 5;
  if (metrics.has_docs_folder) earnedPoints += 10;
  if (metrics.has_wiki) earnedPoints += 10;
  
  return earnedPoints / maxPoints;
}

export function calculateInitialQualityScore(repoProfile) {
  const maxPoints = 100;
  let earnedPoints = 0;
  const readmeContent = repoProfile.readme_content || "";
  
  if (readmeContent) {
    earnedPoints += 15;
    if (readmeContent.length > 1500) earnedPoints += 10;
    const sections = (readmeContent.match(/## /g) || []).length;
    if (sections >= 3) earnedPoints += 15;
  }
  
  if (repoProfile.documentation_metrics.has_contributing) earnedPoints += 5;
  if (repoProfile.documentation_metrics.has_code_of_conduct) earnedPoints += 5;
  if (repoProfile.documentation_metrics.license_type !== 'NONE') earnedPoints += 10;
  
  return earnedPoints / maxPoints;
}

export function calculatePotentialScore(repoProfile, persona) {
  const weights = PERSONA_WEIGHTS[persona];
  if (!weights) throw new Error(`Invalid persona: ${persona}`);
  
  // Popularity Score
  const popularityScore = (
    Math.log10(1 + repoProfile.stars) + 
    Math.log10(1 + repoProfile.forks) + 
    Math.log10(1 + repoProfile.weekly_downloads)
  ) / 15;
  
  // Community Score
  const gfiScore = 1 - (1 / (1 + 0.2 * repoProfile.good_first_issues));
  const communityScore = (repoProfile.pr_merge_ratio + gfiScore) / 2;
  
  // Velocity Score
  const daysSincePush = (new Date() - new Date(repoProfile.pushed_at)) / (1000 * 3600 * 24);
  const recencyScore = Math.exp(-0.5 * Math.pow(daysSincePush / 90, 2));
  const activityScore = (
    Math.log10(1 + repoProfile.commits_last_30_days) + 
    Math.log10(1 + repoProfile.releases_last_90_days)
  ) / 5;
  const velocityScore = (recencyScore + activityScore) / 2;
  
  // Maturity Score
  const docScore = calculateDocumentationScore(repoProfile.documentation_metrics);
  const permissiveLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause'];
  const licenseScore = permissiveLicenses.includes(repoProfile.documentation_metrics.license_type) ? 1.0 : 0.2;
  const stabilityScore = repoProfile.issue_closure_rate;
  const maturityScore = (licenseScore + docScore + stabilityScore) / 3;
  
  // Risk Score
  const dependencyHealthScore = repoProfile.has_security_vulnerabilities ? 0.1 : 1.0;
  const busFactorScore = repoProfile.bus_factor > 0 ? 1 - (1 / repoProfile.bus_factor) : 0;
  const riskScore = (dependencyHealthScore + busFactorScore) / 2;
  
  const potentialScore = (
    weights.popularity * popularityScore +
    weights.community * communityScore +
    weights.velocity * velocityScore +
    weights.maturity * maturityScore +
    weights.risk * riskScore
  );
  
  return { potentialScore };
}
