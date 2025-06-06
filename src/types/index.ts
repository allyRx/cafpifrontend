
export interface User {
  id: string;
  email: string;
  name: string;
  subscription: {
    plan: 'free' | 'basic' | 'premium';
    status: 'active' | 'inactive' | 'expired';
    endDate?: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  fileCount: number;
  status: 'active' | 'processing' | 'completed';
}

export interface ProcessingJob {
  id: string;
  folderId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  createdAt: string;
  completedAt?: string;
  resultFiles?: ResultFile[];
}

export interface ResultFile {
  id: string;
  name: string;
  type: 'excel' | 'pdf';
  size: string;
  downloadUrl: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
}
