import lunr from 'lunr';
import { isAfter, subDays } from 'date-fns';
import { calculatePotentialScore, calculateInitialQualityScore } from './scoring.js';

export function calculateFinalRankings(repoCollection, query, persona) {
  console.log(`📊 Ranking ${repoCollection.length} repositories for persona: ${persona}`);
  const searchIndex = lunr(function () {
    this.ref('full_name');
    this.field('name', { boost: 10 });
    this.field('topics', { boost: 5 });
    this.field('description');
    this.field('readme_content');
    
    repoCollection.forEach(repo => {
      this.add({ 
        ...repo, 
        topics: (repo.topics || []).join(' '),
        readme_content: repo.readme_content || ''
      });
    });
  });
  
  const searchResults = searchIndex.search(query);
  const relevanceScores = new Map(searchResults.map(r => [r.ref, r.score]));
  const rankedRepos = repoCollection.map(repoProfile => {
    const relevanceScore = relevanceScores.get(repoProfile.full_name) || 0;
    const { potentialScore } = calculatePotentialScore(repoProfile, persona);
    
    let finalScore = relevanceScore * (1 + potentialScore);
    
    const sixtyDaysAgo = subDays(new Date(), 60);
    const isNewRepo = isAfter(new Date(repoProfile.created_at), sixtyDaysAgo);
    if (isNewRepo) {
      const initialQualityScore = calculateInitialQualityScore(repoProfile);
      finalScore *= (1 + initialQualityScore);
    }
    
    return { ...repoProfile, finalScore, relevanceScore, potentialScore };
  });
  
  const sortedRepos = rankedRepos.sort((a, b) => b.finalScore - a.finalScore);
  const topScore = sortedRepos.length > 0 ? sortedRepos[0].finalScore : 1;
  return sortedRepos.map(repo => ({
    ...repo,
    scoreOutOf10: (repo.finalScore / topScore) * 10
  }));
}
