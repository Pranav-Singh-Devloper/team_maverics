# Team Maverics - GitHub Discovery Engine

A powerful, AI-driven platform to discover and rank GitHub repositories based on your developer persona and needs.

## 🌟 Features

- **AI-Powered Search**: Uses Groq AI to analyze your queries and understand intent
- **Persona-Based Ranking**: Tailored results for Learners, Contributors, Early Adopters, and Enterprise users
- **Comprehensive Repository Analysis**: Deep profiling including activity, community health, and documentation quality
- **Beautiful Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Health Monitoring**: Live status of backend services
- **Advanced Scoring Algorithm**: Multi-factor scoring considering popularity, velocity, maturity, and risk

## 🏗️ Architecture

### Backend (`/backend/`)
Well-organized, beginner-friendly structure:
```
backend/
├── config/           # Configuration and environment variables
├── services/         # External service connections (Pinecone, Groq)
├── utils/            # Utility functions by purpose
│   ├── github.js     # GitHub API interactions
│   ├── scoring.js    # Repository scoring logic
│   ├── ranking.js    # Ranking algorithms
│   ├── profiling.js  # Repository analysis
│   ├── ai.js         # AI query processing
│   └── search.js     # Search functionality
├── routes/           # API endpoints
└── server.js         # Main server file
```

### Frontend (`/frontend/`)
Modern React application with component-based architecture:
```
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── services/     # API communication
│   └── lib/          # Utility functions
├── public/           # Static assets
└── ...config files
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- GitHub Personal Access Token
- Groq API Key
- Pinecone API Key (optional)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd team_maverics
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API keys:
# GITHUB_TOKEN=your_github_token
# GROQ_API_KEY=your_groq_api_key
# PINECONE_API_KEY=your_pinecone_key (optional)
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start Development Servers

**Option 1: Use the convenience script**
```bash
# From project root
./start-dev.sh
```

**Option 2: Start manually**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🎯 How to Use

1. **Choose Your Persona**: Select from Learner, Contributor, Early Adopter, or Enterprise
2. **Search**: Enter your query (e.g., "React component library", "Python machine learning")
3. **Explore Results**: Browse ranked repositories with detailed metrics
4. **Discover**: Click through to GitHub or find good first issues

## 🔧 API Endpoints

### Search Repositories
```bash
POST /api/search
{
  "query": "react hooks",
  "persona": "learner"  # optional
}
```

### Get Repository Details
```bash
GET /api/repo/:owner/:name
```

### Health Check
```bash
GET /health
```

## 👥 Developer Personas

### 🎓 Learner
- Prioritizes documentation quality
- Focuses on beginner-friendly projects
- Values clear README and contributing guides

### 🤝 Contributor
- Emphasizes community activity
- Looks for good first issues
- Values active maintainership

### ⚡ Early Adopter
- Prioritizes recent activity and velocity
- Focuses on trending and new projects
- Values innovation over stability

### 🏢 Enterprise
- Emphasizes stability and maturity
- Prioritizes proper licensing
- Values long-term maintenance

## 🛠️ Development

### Backend Development
The backend uses a modular structure for easy maintenance:

- **Add new API endpoints**: Edit `routes/api.js`
- **Modify scoring logic**: Edit `utils/scoring.js`
- **Add GitHub API calls**: Edit `utils/github.js`
- **Update configuration**: Edit `config/config.js`

### Frontend Development
The frontend uses modern React patterns:

- **Add new components**: Create in `src/components/`
- **Modify API calls**: Edit `src/services/api.js`
- **Update styling**: Edit component files or `src/index.css`

### Environment Variables

#### Backend (.env)
```
PORT=3001
GITHUB_TOKEN=your_github_personal_access_token
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key  # optional
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic system preference detection
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Real-time Status**: Live backend connection monitoring

## 🔍 Search Examples

Try these search queries:
- "beginner friendly Python projects"
- "React component libraries for enterprise"
- "new JavaScript frameworks 2024"
- "machine learning projects with good documentation"

## 📊 Scoring Algorithm

Repositories are scored based on:
- **Popularity**: Stars, forks, downloads
- **Community**: PR merge ratio, good first issues
- **Velocity**: Recent commits, releases
- **Maturity**: Documentation, licensing, stability
- **Risk**: Security vulnerabilities, bus factor

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- GitHub API for repository data
- Groq for AI-powered query analysis
- Pinecone for vector search capabilities
- The open source community for inspiration

---

**Team Maverics** - Discover your next open source adventure! 🚀
