import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { getAnalysisResults, updateAnalysisResult, deleteAnalysisResult } from '../services/analysisService';
import { AnalysisResult } from '../types';
import { useToast } from '../hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';

export const Results: React.FC = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [editingResult, setEditingResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fetchedResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ['analysisResults'],
    queryFn: getAnalysisResults,
    onSuccess: (data) => {
      setResults(data);
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        title: 'Erreur de chargement des résultats',
        description: (error as Error).message,
        variant: 'destructive',
      });
      setIsLoading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnalysisResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysisResults'] });
      toast({
        title: 'Résultat supprimé',
        description: 'Le résultat a été supprimé avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur de suppression',
        description: (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateAnalysisResult(editingResult!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysisResults'] });
      toast({
        title: 'Résultat mis à jour',
        description: 'Le résultat a été mis à jour avec succès.',
      });
      setEditingResult(null);
    },
    onError: (error) => {
      toast({
        title: 'Erreur de mise à jour',
        description: (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleUpdate = (data: any) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div>Chargement des résultats...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Résultats des analyses
        </h1>
        <p className="text-gray-600">
          Consultez les résultats des documents analysés
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du fichier</TableHead>
              <TableHead>Dossier</TableHead>
              <TableHead>Date d'analyse</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result._id}>
                <TableCell className="font-medium">
                  {result.metadata?.filename || 'Inconnu'}
                </TableCell>
                <TableCell>{result.folderName || '—'}</TableCell>
                <TableCell>
                  {result.createdAt
                    ? new Date(result.createdAt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <Badge>
                    {result.metadata?.processing_status || 'Inconnu'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedResult(result)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingResult(result)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(result._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingResult && (
        <Dialog open={!!editingResult} onOpenChange={() => setEditingResult(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le résultat</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Modification en cours pour le fichier: {editingResult.metadata?.filename}</p>
              {/* Add form fields here to edit the result */}
            </div>
            <DialogFooter>
              <Button onClick={() => handleUpdate({})}>Sauvegarder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedResult && (
        <div className="mt-8 border rounded-lg p-6 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Détails du résultat</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <h3 className="md:col-span-2 font-semibold">Informations bancaires</h3>
            <div>
              <strong>Titulaire :</strong>{' '}
              {selectedResult.bank_account_info?.titulaire || '—'}
            </div>
            <div>
              <strong>Numéro de compte :</strong>{' '}
              {selectedResult.bank_account_info?.numero_compte || '—'}
            </div>
            <div>
              <strong>Banque :</strong>{' '}
              {selectedResult.bank_account_info?.banque || '—'}
            </div>
            <div>
              <strong>Période :</strong>{' '}
              {selectedResult.bank_account_info?.periode || '—'}
            </div>
            <div>
              <strong>Solde début :</strong>{' '}
              {selectedResult.bank_account_info?.solde_debut || '—'}
            </div>
            <div>
              <strong>Solde fin :</strong>{' '}
              {selectedResult.bank_account_info?.solde_fin || '—'}
            </div>
            <div>
              <strong>IBAN :</strong>{' '}
              {selectedResult.bank_account_info?.iban || '—'}
            </div>

            <h3 className="md:col-span-2 font-semibold mt-6">
              Analyse financière
            </h3>
            <div>
              <strong>Équilibre du compte :</strong>{' '}
              {selectedResult.financial_analysis?.equilibre_compte || '—'}
            </div>
            <div>
              <strong>Frais bancaires détectés :</strong>{' '}
              {typeof selectedResult.financial_analysis?.frais_bancaires_detectes === 'boolean'
                ? selectedResult.financial_analysis.frais_bancaires_detectes
                  ? 'Oui'
                  : 'Non'
                : '—'}
            </div>
            <div>
              <strong>Nombre de frais :</strong>{' '}
              {selectedResult.financial_analysis?.nombre_frais ?? '—'}
            </div>
            <div>
              <strong>Revenus réguliers :</strong>{' '}
              {typeof selectedResult.financial_analysis?.revenus_reguliers === 'boolean'
                ? selectedResult.financial_analysis.revenus_reguliers
                  ? 'Oui'
                  : 'Non'
                : '—'}
            </div>
            <div>
              <strong>Prêts en cours :</strong>{' '}
              {typeof selectedResult.financial_analysis?.prets_en_cours === 'boolean'
                ? selectedResult.financial_analysis.prets_en_cours
                  ? 'Oui'
                  : 'Non'
                : '—'}
            </div>
            <div>
              <strong>Revenus fonciers :</strong>{' '}
              {typeof selectedResult.financial_analysis?.revenus_fonciers === 'boolean'
                ? selectedResult.financial_analysis.revenus_fonciers
                  ? 'Oui'
                  : 'Non'
                : '—'}
            </div>

            <h3 className="md:col-span-2 font-semibold mt-6">Validations CAFPI</h3>
            <div>
              <strong>Nom conforme :</strong>{' '}
              {selectedResult.validations_cafpi?.nom_conforme || '—'}
            </div>
            <div>
              <strong>Frais excessifs :</strong>{' '}
              {selectedResult.validations_cafpi?.frais_excessifs || '—'}
            </div>
            <div>
              <strong>Gestion équilibrée :</strong>{' '}
              {selectedResult.validations_cafpi?.gestion_equilibree || '—'}
            </div>
            <div>
              <strong>Revenus détectés :</strong>{' '}
              {selectedResult.validations_cafpi?.revenus_detectes || '—'}
            </div>
            <div>
              <strong>Prêts en cours :</strong>{' '}
              {selectedResult.validations_cafpi?.prets_en_cours || '—'}
            </div>

            <h3 className="md:col-span-2 font-semibold mt-6">
              Analyse des transactions
            </h3>
            <div className="md:col-span-2">
              <strong>Débits réguliers :</strong>
              {selectedResult.transactions_analysis?.debits_reguliers?.length ? (
                <ul className="list-disc list-inside">
                  {selectedResult.transactions_analysis.debits_reguliers.map(
                    (debit, i) => (
                      <li key={i}>
                        {debit.type} — {debit.montant} ({debit.frequence})
                      </li>
                    )
                  )}
                </ul>
              ) : (
                ' Aucun'
              )}
            </div>
            <div className="md:col-span-2">
              <strong>Crédits réguliers :</strong>
              {selectedResult.transactions_analysis?.credits_reguliers?.length ? (
                <ul className="list-disc list-inside">
                  {selectedResult.transactions_analysis.credits_reguliers.map(
                    (credit, i) => (
                      <li key={i}>
                        {credit.type} — {credit.montant} ({credit.frequence})
                      </li>
                    )
                  )}
                </ul>
              ) : (
                ' Aucun'
              )}
            </div>
            <div className="md:col-span-2">
              <strong>Frais bancaires :</strong>
              {selectedResult.transactions_analysis?.frais_bancaires?.length ? (
                <ul className="list-disc list-inside">
                  {selectedResult.transactions_analysis.frais_bancaires.map(
                    (fee, i) => <li key={i}>{fee.type} — {fee.montant}</li>
                  )}
                </ul>
              ) : (
                ' Aucun'
              )}
            </div>
            <div className="md:col-span-2">
              <strong>Opérations inhabituelles :</strong>
              {selectedResult.transactions_analysis?.operations_inhabituelles?.length ? (
                <ul className="list-disc list-inside">
                  {selectedResult.transactions_analysis.operations_inhabituelles.map(
                    (op, i) =>
                      op && typeof op === 'object' && 'type' in op && 'montant' in op
                        ? <li key={i}>{op.type} — {op.montant}</li>
                        : <li key={i}>{String(op)}</li>
                  )}
                </ul>
              ) : (
                ' Aucun'
              )}
            </div>

            <h3 className="md:col-span-2 font-semibold mt-6">Revenus détectés</h3>
            <div>
              <strong>Salaire :</strong>{' '}
              {selectedResult.revenus_detectes?.salaire || '—'}
            </div>
            <div>
              <strong>Foncier :</strong>{' '}
              {selectedResult.revenus_detectes?.foncier || '—'}
            </div>
            <div>
              <strong>Autres :</strong>{' '}
              {selectedResult.revenus_detectes?.autres || '—'}
            </div>

            <h3 className="md:col-span-2 font-semibold mt-6">Qualité & Confiance</h3>
            <div>
              <strong>Confiance globale :</strong>{' '}
              {selectedResult.quality_metrics?.overall_confidence ?? '—'}%
            </div>
            <div>
              <strong>Revue nécessaire :</strong>{' '}
              {selectedResult.quality_metrics?.needs_review ? 'Oui' : 'Non'}
            </div>
            <div className="md:col-span-2">
              <strong>Champs manquants :</strong>{' '}
              {(selectedResult.quality_metrics?.missing_fields?.length ?? 0) > 0
                ? selectedResult.quality_metrics.missing_fields.join(', ')
                : 'Aucun'}
            </div>

            {selectedResult.quality_metrics?.confidence_breakdown && (
              <>
                <h4 className="md:col-span-2 font-semibold mt-4">
                  Détail confiance par catégorie
                </h4>
                <div>
                  <strong>Titulaire compte :</strong>{' '}
                  {selectedResult.quality_metrics.confidence_breakdown.titulaire_compte ?? '—'}%
                </div>
                <div>
                  <strong>Solde début :</strong>{' '}
                  {selectedResult.quality_metrics.confidence_breakdown.solde_debut ?? '—'}%
                </div>
                <div>
                  <strong>Solde fin :</strong>{' '}
                  {selectedResult.quality_metrics.confidence_breakdown.solde_fin ?? '—'}%
                </div>
                <div>
                  <strong>Frais bancaires :</strong>{' '}
                  {selectedResult.quality_metrics.confidence_breakdown.frais_bancaires ?? '—'}%
                </div>
                <div>
                  <strong>Crédits réguliers :</strong>{' '}
                  {selectedResult.quality_metrics.confidence_breakdown.credits_reguliers ?? '—'}%
                </div>
                <div>
                  <strong>Débits réguliers :</strong>{' '}
                  {selectedResult.quality_metrics.confidence_breakdown.debits_reguliers ?? '—'}%
                </div>
                <div>
                  <strong>Opérations inhabituelles :</strong>{' '}
                  {selectedResult.quality_metrics.confidence_breakdown.operations_inhabituelles ?? '—'}%
                </div>
              </>
            )}

            <h3 className="md:col-span-2 font-semibold mt-6">Évaluation du risque</h3>
            <div>
              <strong>Stabilité financière :</strong>{' '}
              {selectedResult.risk_assessment?.financial_stability || '—'}
            </div>
            <div>
              <strong>Comportement bancaire :</strong>{' '}
              {selectedResult.risk_assessment?.banking_behavior || '—'}
            </div>
            <div>
              <strong>Fiabilité des revenus :</strong>{' '}
              {selectedResult.risk_assessment?.income_reliability || '—'}
            </div>
            <div>
              <strong>Crédit :</strong>{' '}
              {selectedResult.risk_assessment?.creditworthiness || '—'}
            </div>

            <h3 className="md:col-span-2 font-semibold mt-6">Métadonnées</h3>
            <div>
              <strong>Nom du fichier :</strong>{' '}
              {selectedResult.metadata?.filename || '—'}
            </div>
            <div>
              <strong>Date du document :</strong>{' '}
              {selectedResult.metadata?.timestamp
                ? new Date(selectedResult.metadata.timestamp).toLocaleString()
                : '—'}
            </div>
            <div>
              <strong>Commentaires :</strong>{' '}
              {selectedResult.metadata?.comments || 'Aucun'}
            </div>
            <div>
              <strong>Statut traitement :</strong>{' '}
              {selectedResult.metadata?.processing_status || '—'}
            </div>

            <h3 className="md:col-span-2 font-semibold mt-6">Recommandations</h3>
            <div className="md:col-span-2">
              {selectedResult.recommendations?.length ? (
                <ul className="list-disc list-inside">
                  {selectedResult.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              ) : (
                'Aucune recommandation'
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
function useQuery<T>({
  queryKey,
  queryFn,
  onSuccess,
  onError,
}: {
  queryKey: string[];
  queryFn: () => Promise<T>;
  onSuccess: (data: T) => void;
  onError: (error: any) => void;
}): { data: T | undefined; isLoading: boolean } {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    queryFn()
      .then((result) => {
        if (isMounted) {
          setData(result);
          onSuccess(result);
        }
      })
      .catch((error) => {
        if (isMounted) {
          onError(error);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...queryKey]);

  return { data, isLoading };
}
