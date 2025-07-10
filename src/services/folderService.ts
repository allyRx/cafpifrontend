// src/services/folderService.ts
import { Folder } from '../types'; // Assuming Folder type is available
import { mockFolders } from '../data/mockData'; // Adjusted path

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Commented out for mock

// Placeholder for adding auth headers if/when JWT is implemented
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken'); // Or however token is stored
//   return token ? { 'Authorization': `Bearer ${token}` } : {};
// };

export const getFolders = async (): Promise<Folder[]> => {
  // console.log("folderService: Using mock getFolders");
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve([...mockFolders]); // Return a copy to prevent direct mutation
};

export const createFolder = async (folderData: { name: string; description?: string }): Promise<Folder> => {
  // console.log("folderService: Using mock createFolder with data:", folderData);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const newMockFolder: Folder = {
    id: Date.now().toString(), // Simple unique ID for mock
    name: folderData.name,
    description: folderData.description || '',
    createdAt: new Date().toISOString(),
    fileCount: 0,
    status: 'active', // Default status for new mock folder
    // userId: 'mockUserId' // Add if your Folder type requires it and it's not optional
  };
  // Add to the mockFolders array to simulate persistence for the session
  // Note: This modifies the mockFolders array in mockData.ts.
  // For a cleaner mock, you might manage a local copy within the service or context.
  // mockFolders.unshift(newMockFolder); // Add to beginning

  return Promise.resolve(newMockFolder);
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
