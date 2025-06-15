// src/services/uploadService.ts
import { UploadedFile as UploadedFileType } from '../types'; // Assuming type is available

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Placeholder for adding auth headers if/when JWT is implemented
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken'); // Or however token is stored
//   return token ? { 'Authorization': `Bearer ${token}` } : {};
// };

export const uploadFile = async (file: File, folderId: string): Promise<UploadedFileType> => {
  const formData = new FormData();
  formData.append('file', file); // 'file' should match multer field name in backend

  // As per prompt, including folderId. Backend /api/upload currently doesn't store this
  // in UploadedFile model. This might be for a different purpose or require backend changes.
  formData.append('folderId', folderId);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    // headers: { ...getAuthHeaders() }, // Auth headers if needed, omit for FormData if backend handles it
    // For FormData, Content-Type is set automatically by the browser with boundary.
    // Explicitly setting 'Content-Type': 'multipart/form-data' can sometimes cause issues if boundary is missing.
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'File upload failed' }));
    throw new Error(errorData.error || errorData.errors?.[0]?.msg || errorData.message || 'File upload failed');
  }
  // The backend for POST /api/upload returns the created UploadedFile object directly
  // (after excluding 'content' buffer in its response)
  const data = await response.json();
  // The service expects the backend to return the file object, not nested like { uploadedFile: data }
  return data;
};
