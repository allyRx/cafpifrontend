import api from '../lib/api';
import { Folder, ProcessingJob } from '../types';

export const getDashboardStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getRecentJobs = async () => {
  const response = await api.get<ProcessingJob[]>('/jobs?limit=3&sort=createdAt:desc');
  return response.data;
};

export const getActiveFolders = async () => {
  const response = await api.get<Folder[]>('/folders?status=active');
  return response.data;
};
