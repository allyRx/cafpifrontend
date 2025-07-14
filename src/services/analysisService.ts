import { AnalysisResult } from '../types';
import api from '../lib/api';

export const getAnalysisResults = async (): Promise<AnalysisResult[]> => {
  const response = await api.get('/analysis');
  return response.data;
};

export const getAnalysisResult = async (id: string): Promise<AnalysisResult> => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};
