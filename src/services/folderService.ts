// src/services/folderService.ts
import { Folder } from '../types'; // Assuming Folder type is available

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Placeholder for adding auth headers if/when JWT is implemented
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken'); // Or however token is stored
//   return token ? { 'Authorization': `Bearer ${token}` } : {};
// };

export const getFolders = async (): Promise<Folder[]> => {
  const response = await fetch(`${API_BASE_URL}/folders`, {
    method: 'GET',
    // headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    headers: { 'Content-Type': 'application/json' }, // Using mock auth for now
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch folders' }));
    // The backend might send { error: "message" } or { errors: [{msg: "message"}] }
    throw new Error(errorData.error || errorData.errors?.[0]?.msg || errorData.message || 'Failed to fetch folders');
  }
  // The backend for GET /api/folders returns an array of folders directly
  const data = await response.json();
  return data || []; // If backend sends array directly, use data, otherwise adapt
};

export const createFolder = async (folderData: { name: string; description?: string }): Promise<Folder> => {
  const response = await fetch(`${API_BASE_URL}/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // Using mock auth for now
    body: JSON.stringify(folderData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create folder' }));
    throw new Error(errorData.error || errorData.errors?.[0]?.msg || errorData.message || 'Failed to create folder');
  }
  // The backend for POST /api/folders returns the created folder object directly
  const data = await response.json();
  return data;
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
