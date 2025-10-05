import React, { useState } from 'react';
import { Search, ArrowRight, Home, Code, Plus, User, Grid3x3, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchResults from './components/SearchResults';
import PersonaSelector from './components/PersonaSelector';
import HealthCheck from './components/HealthCheck';
import apiService from './services/api';

// Hero Component
const Hero = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-7xl font-bold text-gray-900 mb-4 tracking-tight">
        git.Search
      </h1>
      <p className="text-gray-600 text-xl">
        Discover your next open source project
      </p>
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ onSearch, loading }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <form onSubmit={handleSearch}>
        <div className={`relative bg-white rounded-full border-2 transition-all duration-300 shadow-sm ${
          isFocused 
            ? 'border-blue-500 ring-4 ring-blue-100' 
            : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-4 px-6 py-4">
            <Search className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for open source projects..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-lg"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button 
                size="icon" 
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white" 
                type="submit"
                disabled={loading || !query.trim()}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};


// Sidebar Component
const AppSidebar = ({ isOpen, onToggle, currentView, onViewChange }) => {
  const menuItems = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'projects', icon: Code, label: 'Projects' }
  ];

  const handleSidebarClick = () => {
    if (!isOpen) {
      onToggle();
    }
  };

  return (
    <>
      <div className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex h-full flex-col py-4">
          {/* Header */}
          <div className="px-3 pb-4">
            {isOpen ? (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-900">git.Search</span>
                <button 
                  onClick={onToggle}
                  className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button 
                  onClick={onToggle}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex flex-1 flex-col gap-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${!isOpen ? 'justify-center px-2' : ''}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
        </div>
      </div>
    </>
  );
};

// Main App Component
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('contributor');
  const [currentView, setCurrentView] = useState('search');

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    
    try {
      const results = await apiService.searchRepositories(query, selectedPersona);
      setSearchResults(results);
    } catch (err) {
      setError(err);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const hasSearched = searchResults || loading || error;

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <AppSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen((v) => !v)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-[margin] duration-300 min-h-screen px-8`}>
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-20 z-40 p-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
          >
            <Grid3x3 className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="w-full max-w-7xl mx-auto">
          {currentView === 'search' && (
            <>
                  {!hasSearched && (
                <div className="flex items-center justify-center min-h-screen">
                  <div>
                    <Hero />
                    <PersonaSelector 
                      selectedPersona={selectedPersona}
                      onPersonaChange={setSelectedPersona}
                    />
                    <SearchBar onSearch={handleSearch} loading={loading} />
                  </div>
                </div>
              )}
              
              {hasSearched && (
                <div className="py-8">
                  <div className="mb-8">
                    <SearchBar onSearch={handleSearch} loading={loading} />
                  </div>
                  
                  <SearchResults 
                    results={searchResults}
                    loading={loading}
                    error={error}
                    query={currentQuery}
                  />
                </div>
              )}
            </>
          )}

          {currentView === 'projects' && (
            <div className="py-8">
              <div className="text-center py-16">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Projects</h2>
                <p className="text-gray-600">Manage your saved repositories and projects</p>
                <div className="mt-8">
                  <PersonaSelector 
                    selectedPersona={selectedPersona}
                    onPersonaChange={setSelectedPersona}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <HealthCheck />
    </div>
  );
};

export default App;