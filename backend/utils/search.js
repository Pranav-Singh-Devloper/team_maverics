import { searchGitHub } from './github.js';

export async function conductSearch(userQuery, analysis) {
  const searchTerms = analysis.search_terms.join(' ');
  const query = `${searchTerms} stars:>=50`;
  
  console.log(`🔍 Searching: ${query}`);
  const result = await searchGitHub(query);
  return result.items || [];
}
