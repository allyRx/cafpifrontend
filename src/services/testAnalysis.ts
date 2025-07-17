import React, { useEffect } from 'react';
import { getAnalysisResults, getAnalysisResult } from '../services/analysisService';

export const TestAnalysis = () => {
  useEffect(() => {
    const test = async () => {
      try {
        const results = await getAnalysisResults();
        console.log('✅ Résultats reçus :', results);

        if (results.length > 0) {
          const firstId = results[0]._id;
          const detail = await getAnalysisResult(firstId);
          console.log('📄 Détail du premier résultat :', detail);
        } else {
          console.log('⚠️ Aucun résultat trouvé');
        }
      } catch (err) {
        console.error('❌ Erreur :', err);
      }
    };

    test();
  }, []);

  return  "Test API (regarde la console)";
};
