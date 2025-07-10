// src/services/uploadService.ts
import { UploadedFile as UploadedFileType } from '../types'; // Assuming type is available

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Commented out for mock

// Placeholder for adding auth headers if/when JWT is implemented
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken'); // Or however token is stored
//   return token ? { 'Authorization': `Bearer ${token}` } : {};
// };

export const uploadFile = async (file: File, folderId: string): Promise<UploadedFileType> => {
  // console.log(`uploadService: Mock uploading file "${file.name}" to folderId "${folderId}"`);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate 1.5 seconds delay

  const newMockUploadedFile: UploadedFileType = {
    id: `mock-${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    type: file.type,
    size: file.size,
    status: 'completed', // Or 'uploaded', assuming backend status for a newly uploaded file
    // folderId: folderId, // Include if your UploadedFileType in types.ts supports it
    // downloadUrl: '#',    // Placeholder if needed by the type
    createdAt: new Date().toISOString(), // Add if needed by the type
    // preview: undefined, // Preview is usually a frontend-only concern, not part of backend model
  };

  // console.log("uploadService: Mock file created:", newMockUploadedFile);
  return Promise.resolve(newMockUploadedFile);
};
