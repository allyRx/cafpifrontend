import { Folder } from '../types';
import api from '../lib/api';

export const getFolders = async (): Promise<Folder[]> => {
  const response = await api.get('/folders');
  return response.data;
};

export const createFolder = async (folderData: { name:string; description?: string }): Promise<Folder> => {
  const response = await api.post('/folders', folderData);
  return response.data;
};

// Stub for updateFolder - to be implemented if needed
export const updateFolder = async (id: string, folderData: Partial<Folder>): Promise<Folder> => {
  console.log('updateFolder called with:', id, folderData);
  // const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' }, // Using mock auth for now
  //   body: JSON.stringify(folderData),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({ message: 'Failed to update folder' }));
  //   throw new Error(errorData.error || errorData.message || 'Failed to update folder');
  // }
  // const data = await response.json();
  // return data.folder;
  throw new Error('updateFolder not implemented yet');
};

// Stub for deleteFolder - to be implemented if needed
export const deleteFolder = async (id: string): Promise<void> => {
  console.log('deleteFolder called with:', id);
  // const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
  //   method: 'DELETE',
  //   headers: { 'Content-Type': 'application/json' }, // Using mock auth for now
  // });
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({ message: 'Failed to delete folder' }));
  //   throw new Error(errorData.error || errorData.message || 'Failed to delete folder');
  // }
  // return;
  throw new Error('deleteFolder not implemented yet');
};
