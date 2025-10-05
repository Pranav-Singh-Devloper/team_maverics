import { groq } from '../services/services.js';

export async function analyzeQuery(userQuery) {
  const prompt = `Analyze this GitHub search query and return JSON:
{
  "technologies": ["tech1"],
  "persona": "contributor" | "early_adopter" | "enterprise" | "learner",
  "search_terms": ["term1", "term2"]
}

Query: "${userQuery}"

Rules:
- persona: "learner" if beginner/newbie/learning, "contributor" if contributing/issues, "early_adopter" if new/trending, "enterprise" if production/stable
- technologies: exact framework names
- search_terms: key search words`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('AI analysis failed:', error.message);
    const isLearning = /newbie|beginner|learn/i.test(userQuery);
    return {
      technologies: [],
      persona: isLearning ? "learner" : "contributor",
      search_terms: userQuery.split(/\s+/).filter(w => w.length > 3)
    };
  }
}
