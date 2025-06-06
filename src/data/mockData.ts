
import { User, Folder, ProcessingJob, ResultFile } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Utilisateur Demo',
  subscription: {
    plan: 'premium',
    status: 'active',
    endDate: '2024-12-31'
  }
};

export const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Contrats Clients 2024',
    description: 'Traitement automatique des contrats clients pour l\'année 2024',
    createdAt: '2024-01-15T10:30:00Z',
    fileCount: 25,
    status: 'completed'
  },
  {
    id: '2',
    name: 'Factures Fournisseurs',
    description: 'Extraction de données des factures fournisseurs',
    createdAt: '2024-02-01T14:20:00Z',
    fileCount: 12,
    status: 'processing'
  },
  {
    id: '3',
    name: 'Documents RH',
    description: 'Analyse des documents ressources humaines',
    createdAt: '2024-02-10T09:15:00Z',
    fileCount: 8,
    status: 'active'
  }
];

export const mockProcessingJobs: ProcessingJob[] = [
  {
    id: '1',
    folderId: '1',
    fileName: 'contrat_client_001.pdf',
    status: 'completed',
    progress: 100,
    createdAt: '2024-02-01T10:00:00Z',
    completedAt: '2024-02-01T10:05:00Z',
    resultFiles: [
      {
        id: '1',
        name: 'contrat_client_001_extracted.xlsx',
        type: 'excel',
        size: '2.3 MB',
        downloadUrl: '#',
        createdAt: '2024-02-01T10:05:00Z'
      }
    ]
  },
  {
    id: '2',
    folderId: '2',
    fileName: 'facture_fournisseur_002.pdf',
    status: 'processing',
    progress: 65,
    createdAt: '2024-02-10T15:30:00Z'
  },
  {
    id: '3',
    folderId: '2',
    fileName: 'facture_fournisseur_003.pdf',
    status: 'error',
    progress: 0,
    createdAt: '2024-02-10T16:00:00Z'
  }
];

export const mockResultFiles: ResultFile[] = [
  {
    id: '1',
    name: 'rapport_mensuel_janvier.xlsx',
    type: 'excel',
    size: '5.2 MB',
    downloadUrl: '#',
    createdAt: '2024-02-01T10:05:00Z'
  },
  {
    id: '2',
    name: 'synthese_contrats.pdf',
    type: 'pdf',
    size: '1.8 MB',
    downloadUrl: '#',
    createdAt: '2024-02-01T10:10:00Z'
  },
  {
    id: '3',
    name: 'donnees_extraites_Q1.xlsx',
    type: 'excel',
    size: '3.4 MB',
    downloadUrl: '#',
    createdAt: '2024-02-05T14:20:00Z'
  }
];

export const subscriptionPlans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    features: [
      '5 documents par mois',
      'Formats PDF uniquement',
      'Support email',
      'Stockage 1 GB'
    ],
    limitations: ['Limité à 5 documents', 'Pas de traitement en lot']
  },
  {
    id: 'basic',
    name: 'Basique',
    price: '29€',
    period: '/mois',
    features: [
      '100 documents par mois',
      'PDF, Images, Word',
      'Support prioritaire',
      'Stockage 10 GB',
      'API basique'
    ],
    limitations: []
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '99€',
    period: '/mois',
    features: [
      'Documents illimités',
      'Tous formats supportés',
      'Support 24/7',
      'Stockage 100 GB',
      'API complète',
      'Intégrations avancées',
      'Analyse IA avancée'
    ],
    limitations: [],
    popular: true
  }
];
