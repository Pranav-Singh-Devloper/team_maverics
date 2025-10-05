import React from 'react';
import { GraduationCap, Users, Zap, Building } from 'lucide-react';

const PersonaSelector = ({ selectedPersona, onPersonaChange }) => {
  const personas = [
    {
      id: 'contributor',
      name: 'Contributor',
      icon: Users
    },
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      icon: Zap
    },
    {
      id: 'enterprise',
      name: 'Enterprise Adopter',
      icon: Building
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-700 mb-3">Search Persona</h3>
        
        <div className="flex flex-wrap gap-3">
          {personas.map((persona) => {
            const Icon = persona.icon;
            const isSelected = selectedPersona === persona.id;
            
            return (
              <button
                key={persona.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                  isSelected 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
                onClick={() => onPersonaChange(persona.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{persona.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;
