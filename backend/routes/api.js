import express from 'express';
import { GITHUB_TOKEN, GROQ_API_KEY, CACHE_TTL } from '../config/config.js';
import { analyzeQuery } from '../utils/ai.js';
import { conductSearch } from '../utils/search.js';
import { fetchRepoProfile } from '../utils/profiling.js';
import { calculateFinalRankings } from '../utils/ranking.js';

const router = express.Router();
const cache = new Map();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    services: { github: !!GITHUB_TOKEN, groq: !!GROQ_API_KEY }
  });
});

router.post('/search', async (req, res) => {
  const { query, persona } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });
  
  const userPersona = persona || null;
  
  console.log(`\n${'='.repeat(60)}\n🔍 "${query}"\n${'='.repeat(60)}`);
  
  // Check cache first
  const cacheKey = `${query}:${userPersona}`;
  if (cache.has(cacheKey)) {
    console.log('✅ Cache hit');
    return res.json({ ...cache.get(cacheKey), cached: true });
  }
  
  try {
    const analysis = await analyzeQuery(query);
    const detectedPersona = userPersona || analysis.persona;
    
    console.log(`👤 Persona: ${detectedPersona}`);
    
    const repos = await conductSearch(query, analysis);
    
    if (repos.length === 0) {
      return res.json({ query, persona: detectedPersona, repositories: [] });
    }
    
    console.log(`📦 Profiling ${repos.length} repositories...`);
    const profiles = await Promise.all(
      repos.slice(0, 15).map(repo => fetchRepoProfile(repo.full_name))
    );
    
    const ranked = calculateFinalRankings(profiles, query, detectedPersona);
    
    const response = {
      query,
      persona: detectedPersona,
      repositories: ranked.slice(0, 10).map(repo => ({
        full_name: repo.full_name,
        name: repo.name,
        description: repo.description,
        stars: repo.stars,
        forks: repo.forks,
        weekly_downloads: repo.weekly_downloads,
        created_at: repo.created_at,
        pushed_at: repo.pushed_at,
        commits_last_30_days: repo.commits_last_30_days,
        releases_last_90_days: repo.releases_last_90_days,
        good_first_issues: repo.good_first_issues,
        issue_closure_rate: repo.issue_closure_rate,
        pr_merge_ratio: repo.pr_merge_ratio,
        bus_factor: repo.bus_factor,
        has_security_vulnerabilities: repo.has_security_vulnerabilities,
        documentation_metrics: repo.documentation_metrics,
        finalScore: parseFloat(repo.finalScore.toFixed(4)),
        scoreOutOf10: parseFloat(repo.scoreOutOf10.toFixed(2)),
        relevanceScore: parseFloat(repo.relevanceScore.toFixed(4)),
        potentialScore: parseFloat(repo.potentialScore.toFixed(4))
      })),
      metadata: {
        total_ranked: ranked.length,
        timestamp: new Date().toISOString()
      }
    };
    
    cache.set(cacheKey, response);
    setTimeout(() => cache.delete(cacheKey), CACHE_TTL);
    
    console.log('✅ Complete\n');
    res.json(response);
    
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/repo/:owner/:name', async (req, res) => {
  const { owner, name } = req.params;
  const fullName = `${owner}/${name}`;
  
  try {
    const profile = await fetchRepoProfile(fullName);
    res.json(profile);
  } catch (error) {
    res.status(404).json({ error: 'Repository not found' });
  }
});

export default router;
