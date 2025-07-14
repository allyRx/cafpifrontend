import { UploadedFile as UploadedFileType } from '../types';
import api from '../lib/api';

export const uploadFile = async (file: File, folderId: string): Promise<UploadedFileType> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folderId', folderId);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const submitForAnalysis = async (data: {
  dossier_number: string;
  borrower_name: string;
  document_base64: string;
  filename: string;
  comments?: string;
}): Promise<any> => {
  const response = await api.post('/webhook/cafpi-document-analysis', data);
  return response.data;
};
