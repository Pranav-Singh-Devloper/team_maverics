import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const HealthCheck = () => {
  const [health, setHealth] = useState({ status: 'checking', services: {} });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthData = await apiService.checkHealth();
        setHealth({ status: 'ok', services: healthData.services });
      } catch (error) {
        setHealth({ status: 'error', services: {} });
      }
    };

    checkHealth();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ok':
        return 'Connected';
      case 'error':
        return 'Disconnected';
      default:
        return 'Connecting...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon(health.status)}
        <span className="text-gray-900 font-medium">{getStatusText(health.status)}</span>
      </div>
      {health.status === 'ok' && health.services && (
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-1">
            <span className={health.services.github ? 'text-green-600' : 'text-red-600'}>
              {health.services.github ? '✓' : '✗'}
            </span>
            <span>GitHub API</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={health.services.groq ? 'text-green-600' : 'text-red-600'}>
              {health.services.groq ? '✓' : '✗'}
            </span>
            <span>AI Service</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;
