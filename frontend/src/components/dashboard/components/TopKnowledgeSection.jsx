import React from 'react';
import { ExternalLink, Trophy } from 'lucide-react';
import { PageSection } from '../../ui';

const TopKnowledgeSection = ({ analytics, onKnowledgeClick }) => {
  return (
    <PageSection title="Top 5 Conhecimentos Mais Desejados">
      <div className="space-y-4">
        {analytics.topDesiredKnowledge?.length > 0 ? (
          analytics.topDesiredKnowledge.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200"
              onClick={() => onKnowledgeClick(item)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.desired} desejados • {item.obtained} obtidos • {item.required} obrigatórios
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-xl font-bold text-blue-600 mr-3">
                  {item.desired}
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">Carregando rankings</h4>
            <p className="text-gray-500">Conhecimentos mais desejados em breve...</p>
          </div>
        )}
      </div>
    </PageSection>
  );
};

export default TopKnowledgeSection;
