import React from 'react';
import RepositoryCard from './RepositoryCard';
import { Loader2, AlertCircle, Search } from 'lucide-react';

const SearchResults = ({ results, loading, error, query }) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-700 text-lg font-medium">Searching for repositories...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-gray-900 font-semibold text-lg mb-2">Search Failed</p>
        <p className="text-gray-600 text-center max-w-md leading-relaxed">
          {error.message || 'Unable to search repositories. Please check your connection and try again.'}
        </p>
      </div>
    );
  }

  // No results
  if (results && results.repositories && results.repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Search className="w-10 h-10 text-gray-400 mb-4" />
        <p className="text-gray-900 font-semibold text-lg mb-2">No repositories found</p>
        <p className="text-gray-600 text-center max-w-md leading-relaxed">
          Try adjusting your search terms or using different keywords.
        </p>
      </div>
    );
  }

  // Results found
  if (results && results.repositories) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Search Summary */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Search Results for "{query}"
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {results.repositories.length} repositories
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              🎯 Persona: {results.persona}
            </span>
            {results.metadata && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                Ranked {results.metadata.total_ranked} total
              </span>
            )}
          </div>
        </div>

        {/* Repository Grid */}
        <div className="grid gap-6">
          {results.repositories.map((repo, index) => (
            <RepositoryCard 
              key={repo.full_name} 
              repository={repo}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Showing top {results.repositories.length} results
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Powered by git.Search Discovery Engine
          </p>
        </div>
      </div>
    );
  }

  // Default state (no search performed)
  return null;
};

export default SearchResults;
