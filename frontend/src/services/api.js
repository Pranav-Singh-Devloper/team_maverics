const API_BASE_URL = 'https://team-mavericks-1.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async checkHealth() {
    return this.makeRequest('/health');
  }

  async searchRepositories(query, persona = null) {
    return this.makeRequest('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, persona }),
    });
  }

  async getRepository(owner, name) {
    return this.makeRequest(`/api/repo/${owner}/${name}`);
  }
}

const apiService = new ApiService();
export default apiService;
