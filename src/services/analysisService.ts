import { AnalysisResult, Folder } from '../types';
import api from '../lib/api';
import { getFolders } from './folderService';

export const getAnalysisResults = async (): Promise<AnalysisResult[]> => {
  console.log('Fetching analysis results and folders...');
  const [resultsResponse, foldersResponse] = await Promise.all([
    api.get('/analysis'),
    getFolders(),
  ]);

  const results = resultsResponse.data as AnalysisResult[];
  const folders = foldersResponse as Folder[];

  const folderMap = new Map(folders.map(folder => [folder.id, folder.name]));

  const resultsWithFolderNames = results.map(result => ({
    ...result,
    folderName: folderMap.get(result.dossier_number) || 'Inconnu',
  }));

  console.log('Processed analysis results:', resultsWithFolderNames);
  return resultsWithFolderNames;
};

export const getAnalysisResult = async (id: string): Promise<AnalysisResult> => {
  const response = await api.get(`/analysis/${id}`);
  return response.data as AnalysisResult;
};
