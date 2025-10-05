import React from 'react';
import { Star, GitFork, Calendar, Activity, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RepositoryCard = ({ repository }) => {
  const {
    full_name,
    name,
    description,
    stars,
    forks,
    created_at,
    pushed_at,
    commits_last_30_days,
    good_first_issues,
    scoreOutOf10,
    documentation_metrics
  } = repository;

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get score color based on rating
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-700 bg-green-100 border border-green-200';
    if (score >= 6) return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
    return 'text-red-700 bg-red-100 border border-red-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            <a 
              href={`https://github.com/${full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center gap-2 group"
            >
              <span className="truncate">{name}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          </h3>
          <p className="text-sm text-gray-500 mb-2 font-mono">{full_name}</p>
          {description && (
            <p className="text-gray-700 mb-3 line-clamp-2 leading-relaxed">{description}</p>
          )}
        </div>
        
        {/* Score Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ml-4 ${getScoreColor(scoreOutOf10)}`}>
          {scoreOutOf10.toFixed(1)}/10
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">{stars.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <GitFork className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{forks.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-green-500" />
          <span>{commits_last_30_days} commits (30d)</span>
        </div>
        
        {good_first_issues > 0 && (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{good_first_issues} good first issues</span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDate(created_at)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(pushed_at)}</span>
        </div>
      </div>

      {/* Documentation Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {documentation_metrics.has_readme && (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">README</span>
        )}
        {documentation_metrics.license_type !== 'NONE' && (
          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
            {documentation_metrics.license_type}
          </span>
        )}
        {documentation_metrics.has_contributing && (
          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Contributing Guide</span>
        )}
        {documentation_metrics.has_code_of_conduct && (
          <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Code of Conduct</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(`https://github.com/${full_name}`, '_blank')}
          className="text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          View on GitHub
        </Button>
        {good_first_issues > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`https://github.com/${full_name}/issues?q=is%3Aopen+label%3A%22good+first+issue%22`, '_blank')}
            className="text-blue-700 border-blue-300 hover:bg-blue-50"
          >
            Good First Issues ({good_first_issues})
          </Button>
        )}
      </div>
    </div>
  );
};

export default RepositoryCard;
