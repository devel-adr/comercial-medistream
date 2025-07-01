
import React from 'react';

export const AnalysisBar = () => {
  const handleAnalysisClick = () => {
    window.open('https://develms.app.n8n.cloud/webhook/unmet_needs', '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">Análisis de Unmet Needs</h2>
          <p className="text-purple-100 mb-4">
            Descubre oportunidades no cubiertas en el mercado farmacéutico
          </p>
          <button
            onClick={handleAnalysisClick}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            Iniciar Análisis
          </button>
        </div>
        <div className="text-6xl opacity-20">
          🔬
        </div>
      </div>
    </div>
  );
};
