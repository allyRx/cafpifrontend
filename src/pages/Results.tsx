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
import { Eye } from 'lucide-react';
import { getAnalysisResults } from '../services/analysisService';
import { AnalysisResult } from '../types';
import { useToast } from '../hooks/use-toast';

export const Results: React.FC = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAnalysisResults();
        setResults(data);
      } catch (error) {
        toast({
          title: 'Erreur de chargement des résultats',
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [toast]);

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
                  {result.metadata.filename}
                </TableCell>
                <TableCell>{result.dossier_number}</TableCell>
                <TableCell>
                  {new Date(result.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge>{result.metadata.processing_status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
