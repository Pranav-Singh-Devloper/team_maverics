import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
export const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const NPM_REGISTRY = 'https://api.npmjs.org/downloads/point/last-week';

// Validate required environment variables
if (!GITHUB_TOKEN || !GROQ_API_KEY) {
  console.error("ERROR: Missing GITHUB_TOKEN or GROQ_API_KEY");
  process.exit(1);
}

export const GITHUB_API_BASE = 'https://api.github.com';
export const GITHUB_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': `token ${GITHUB_TOKEN}`,
  'User-Agent': 'GitHub-Discovery-Pro',
};

export const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Persona weights for different user types
export const PERSONA_WEIGHTS = {
  contributor: {
    popularity: 0.15,
    community: 0.35,
    velocity: 0.25,
    maturity: 0.15,
    risk: 0.10
  },
  early_adopter: {
    popularity: 0.10,
    community: 0.15,
    velocity: 0.40,
    maturity: 0.20,
    risk: 0.15
  },
  enterprise: {
    popularity: 0.20,
    community: 0.10,
    velocity: 0.15,
    maturity: 0.35,
    risk: 0.20
  },
  learner: {
    popularity: 0.25,
    community: 0.35,
    velocity: 0.10,
    maturity: 0.25,
    risk: 0.05
  }
};
