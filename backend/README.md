# GitHub Discovery Engine - Backend

A well-organized, beginner-friendly backend structure for the GitHub Discovery Engine.

## 📁 Folder Structure

```
backend/
├── config/           # Configuration files
│   └── config.js     # Environment variables and settings
├── services/         # External service connections
│   └── services.js   # Pinecone, Groq, and embedder setup
├── utils/            # Utility functions
│   ├── github.js     # GitHub API functions
│   ├── scoring.js    # Repository scoring logic
│   ├── ranking.js    # Repository ranking engine
│   ├── profiling.js  # Repository profiling
│   ├── ai.js         # AI query analysis
│   └── search.js     # Search functionality
├── routes/           # API route handlers
│   └── api.js        # All API endpoints
├── server.js         # Main server file (simplified)
├── package.json      # Dependencies
└── .env              # Environment variables
```

## 🎯 What Each File Does

### **server.js** - Main Server
- Starts the Express server
- Sets up middleware (CORS, JSON parsing)
- Connects all routes
- Initializes services

### **config/config.js** - Configuration
- Environment variables (API keys, ports)
- GitHub API settings
- Persona weights for different user types
- Cache settings

### **services/services.js** - External Services
- Pinecone database connection
- Groq AI service setup
- Text embedder initialization

### **routes/api.js** - API Endpoints
- `/health` - Check if services are working
- `POST /api/search` - Main search endpoint
- `GET /api/repo/:owner/:name` - Get detailed repo info

### **utils/** - Helper Functions

#### **github.js** - GitHub API
- Make requests to GitHub
- Get NPM download stats
- Search repositories
- Calculate "bus factor" (contributor diversity)

#### **scoring.js** - Repository Scoring
- Calculate documentation quality
- Score repositories for different personas
- Evaluate initial quality of new repos

#### **ranking.js** - Ranking Engine
- Rank repositories based on search relevance
- Apply persona-specific weights
- Boost high-quality new repositories

#### **profiling.js** - Repository Analysis
- Fetch comprehensive repo data
- Calculate activity metrics
- Analyze documentation and community health

#### **ai.js** - AI Analysis
- Analyze user queries with AI
- Detect user persona (learner, contributor, etc.)
- Extract search terms and technologies

#### **search.js** - Search Logic
- Conduct GitHub searches
- Apply filters and sorting

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables in `.env`:**
   ```
   GITHUB_TOKEN=your_github_token
   GROQ_API_KEY=your_groq_api_key
   PINECONE_API_KEY=your_pinecone_key (optional)
   PORT=3001
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## 🔍 API Usage

### Search for repositories:
```bash
POST /api/search
{
  "query": "react component library",
  "persona": "learner" // optional: learner, contributor, early_adopter, enterprise
}
```

### Get repository details:
```bash
GET /api/repo/facebook/react
```

### Check health:
```bash
GET /health
```

## 👥 User Personas

- **Learner**: Beginner-friendly projects with good documentation
- **Contributor**: Projects with active communities and contribution opportunities
- **Early Adopter**: New and trending projects with high velocity
- **Enterprise**: Stable, mature projects suitable for production use

## 🎯 Benefits of This Structure

1. **Beginner-Friendly**: Each file has a clear, single purpose
2. **Easy to Maintain**: Related code is grouped together
3. **Scalable**: Easy to add new features in the right place
4. **Testable**: Each utility function can be tested independently
5. **Readable**: Clear naming and organization

## 📝 Adding New Features

- **New API endpoint**: Add to `routes/api.js`
- **New scoring method**: Add to `utils/scoring.js`
- **New GitHub API call**: Add to `utils/github.js`
- **New configuration**: Add to `config/config.js`

This structure keeps the code organized and makes it easy for beginners to understand and contribute!
