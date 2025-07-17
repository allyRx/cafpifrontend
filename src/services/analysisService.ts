import { AnalysisResult } from '../types';
import api from '../lib/api';

export const getAnalysisResults = async (): Promise<AnalysisResult[]> => {
  console.log('Fetching analysis results...');
  const response = await api.get('/analysis');
  console.log('Fetched analysis results:', response.data);
  return response.data as AnalysisResult[];
};

export const getAnalysisResult = async (id: string): Promise<AnalysisResult> => {
  const response = await api.get(`/analysis/${id}`);
  return response.data as AnalysisResult;
};
