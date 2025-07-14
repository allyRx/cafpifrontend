
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

export interface AnalysisResult {
  _id: string;
  dossier_number: string;
  borrower_name: string;
  document_type: string;
  bank_account_info: {
    titulaire: string;
    numero_compte: string;
    banque: string;
    periode: string;
    solde_debut: string;
    solde_fin: string;
    iban: string;
  };
  financial_analysis: {
    equilibre_compte: string;
    frais_bancaires_detectes: boolean;
    nombre_frais: number;
    revenus_reguliers: boolean;
    prets_en_cours: boolean;
    revenus_fonciers: boolean;
  };
  validations_cafpi: {
    nom_conforme: string;
    frais_excessifs: string;
    gestion_equilibree: string;
    revenus_detectes: string;
    prets_en_cours: string;
  };
  transactions_analysis: {
    credits_reguliers: any[];
    debits_reguliers: any[];
    frais_bancaires: any[];
    operations_inhabituelles: string[];
  };
  revenus_detectes: {
    salaire: string;
    foncier: string;
    autres: string;
  };
  quality_metrics: {
    overall_confidence: number;
    needs_review: boolean;
    missing_fields: string[];
    confidence_breakdown: any;
  };
  metadata: {
    dossier_number: string;
    borrower_name: string;
    filename: string;
    timestamp: Date;
    comments: string;
    processing_status: string;
  };
  recommendations: string[];
  risk_assessment: {
    financial_stability: string;
    banking_behavior: string;
    income_reliability: string;
    creditworthiness: string;
  };
  createdAt: string;
  updatedAt: string;
}
